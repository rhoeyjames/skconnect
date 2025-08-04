const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")
const Event = require("../models/Event")
const Registration = require("../models/Registration")
const Suggestion = require("../models/Suggestion")
const Feedback = require("../models/Feedback")
const auth = require("../middleware/auth")
const mongoose = require("mongoose") // Import mongoose

const router = express.Router()

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "sk_official") {
    return res.status(403).json({ message: "Access denied. Admin privileges required." })
  }
  next()
}

// Get dashboard statistics
router.get("/dashboard", auth, adminAuth, async (req, res) => {
  try {
    const [
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalSuggestions,
      totalFeedback,
      recentUsers,
      upcomingEvents,
      pendingSuggestions,
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Event.countDocuments(),
      Registration.countDocuments(),
      Suggestion.countDocuments(),
      Feedback.countDocuments(),
      User.find({ isActive: true }).sort({ createdAt: -1 }).limit(5).select("firstName lastName email createdAt"),
      Event.find({ status: "upcoming" })
        .sort({ date: 1 })
        .limit(5)
        .select("title date location currentParticipants maxParticipants"),
      Suggestion.find({ status: "pending" })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("author", "firstName lastName")
        .select("title category createdAt author"),
    ])

    // Get user registration trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          isActive: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get event participation by category
    const eventsByCategory = await Event.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalParticipants: { $sum: "$currentParticipants" },
        },
      },
    ])

    res.json({
      statistics: {
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalSuggestions,
        totalFeedback,
      },
      recentUsers,
      upcomingEvents,
      pendingSuggestions,
      userTrends,
      eventsByCategory,
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all users with pagination
router.get("/users", auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", role = "" } = req.query
    const query = {}

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }

    if (role) {
      query.role = role
    }

    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user role
router.put(
  "/users/:id/role",
  auth,
  adminAuth,
  [body("role").isIn(["youth", "sk_official", "admin"]).withMessage("Valid role is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { role } = req.body

      const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select("-password")

      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      res.json({
        message: "User role updated successfully",
        user,
      })
    } catch (error) {
      console.error("Update user role error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Toggle user active status
router.put("/users/:id/status", auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.isActive = !user.isActive
    await user.save()

    res.json({
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
      user: user.toJSON(),
    })
  } catch (error) {
    console.error("Toggle user status error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all events with detailed info
router.get("/events", auth, adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status = "", category = "" } = req.query
    const query = {}

    if (status) query.status = status
    if (category) query.category = category

    const events = await Event.find(query)
      .populate("organizer", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Event.countDocuments(query)

    // Get registration counts for each event
    const eventsWithStats = await Promise.all(
      events.map(async (event) => {
        const registrationCount = await Registration.countDocuments({ event: event._id })
        return {
          ...event.toObject(),
          registrationCount,
        }
      }),
    )

    res.json({
      events: eventsWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get admin events error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get detailed event analytics
router.get("/events/:id/analytics", auth, adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "firstName lastName email")

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    const [registrations, feedback, registrationsByStatus, ageDistribution, barangayDistribution] = await Promise.all([
      Registration.find({ event: req.params.id }).populate("user", "firstName lastName email age barangay phoneNumber"),
      Feedback.find({ event: req.params.id }).populate("user", "firstName lastName"),
      Registration.aggregate([
        { $match: { event: mongoose.Types.ObjectId(req.params.id) } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Registration.aggregate([
        { $match: { event: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $unwind: "$userInfo" },
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lt: ["$userInfo.age", 18] }, then: "15-17" },
                  { case: { $lt: ["$userInfo.age", 21] }, then: "18-20" },
                  { case: { $lt: ["$userInfo.age", 25] }, then: "21-24" },
                  { case: { $gte: ["$userInfo.age", 25] }, then: "25-30" },
                ],
                default: "Unknown",
              },
            },
            count: { $sum: 1 },
          },
        },
      ]),
      Registration.aggregate([
        { $match: { event: mongoose.Types.ObjectId(req.params.id) } },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        { $unwind: "$userInfo" },
        { $group: { _id: "$userInfo.barangay", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ])

    // Calculate average feedback ratings
    const avgRatings =
      feedback.length > 0
        ? {
            overall: feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length,
            organization: feedback.reduce((sum, f) => sum + (f.categories?.organization || 0), 0) / feedback.length,
            content: feedback.reduce((sum, f) => sum + (f.categories?.content || 0), 0) / feedback.length,
            venue: feedback.reduce((sum, f) => sum + (f.categories?.venue || 0), 0) / feedback.length,
          }
        : null

    res.json({
      event,
      registrations,
      feedback,
      analytics: {
        registrationsByStatus,
        ageDistribution,
        barangayDistribution,
        avgRatings,
        totalRegistrations: registrations.length,
        totalFeedback: feedback.length,
      },
    })
  } catch (error) {
    console.error("Get event analytics error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Export data (CSV format)
router.get("/export/:type", auth, adminAuth, async (req, res) => {
  try {
    const { type } = req.params
    let data = []
    let filename = ""

    switch (type) {
      case "users":
        data = await User.find({ isActive: true }).select("firstName lastName email age barangay role createdAt").lean()
        filename = "users_export.csv"
        break

      case "events":
        data = await Event.find().populate("organizer", "firstName lastName").lean()
        filename = "events_export.csv"
        break

      case "registrations":
        data = await Registration.find()
          .populate("event", "title date")
          .populate("user", "firstName lastName email")
          .lean()
        filename = "registrations_export.csv"
        break

      default:
        return res.status(400).json({ message: "Invalid export type" })
    }

    // Convert to CSV (simplified - in production, use a proper CSV library)
    const csv = convertToCSV(data)

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename=${filename}`)
    res.send(csv)
  } catch (error) {
    console.error("Export data error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Helper function to convert data to CSV
function convertToCSV(data) {
  if (!data.length) return ""

  const headers = Object.keys(data[0])
  const csvHeaders = headers.join(",")

  const csvRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header]
        return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value
      })
      .join(","),
  )

  return [csvHeaders, ...csvRows].join("\n")
}

module.exports = router
