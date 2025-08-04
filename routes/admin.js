const express = require("express")
const User = require("../models/User")
const Event = require("../models/Event")
const Registration = require("../models/Registration")
const Suggestion = require("../models/Suggestion")
const Feedback = require("../models/Feedback")
const { adminAuth } = require("../middleware/auth")

const router = express.Router()

// Dashboard stats
router.get("/stats", adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" })
    const totalEvents = await Event.countDocuments({ isActive: true })
    const totalRegistrations = await Registration.countDocuments()
    const totalSuggestions = await Suggestion.countDocuments()
    const pendingRegistrations = await Registration.countDocuments({ status: "pending" })
    const pendingSuggestions = await Suggestion.countDocuments({ status: "pending" })

    // Most active barangays
    const barangayStats = await User.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: "$barangay", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ])

    // Most popular events
    const popularEvents = await Registration.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: "$eventId", registrations: { $sum: 1 } } },
      { $lookup: { from: "events", localField: "_id", foreignField: "_id", as: "event" } },
      { $unwind: "$event" },
      { $sort: { registrations: -1 } },
      { $limit: 5 },
      { $project: { title: "$event.title", registrations: 1 } },
    ])

    // Recent activity
    const recentRegistrations = await Registration.find()
      .populate("userId", "name")
      .populate("eventId", "title")
      .sort({ createdAt: -1 })
      .limit(5)

    res.json({
      totalUsers,
      totalEvents,
      totalRegistrations,
      totalSuggestions,
      pendingRegistrations,
      pendingSuggestions,
      barangayStats,
      popularEvents,
      recentRegistrations,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all users
router.get("/users", adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get all registrations
router.get("/registrations", adminAuth, async (req, res) => {
  try {
    const { status } = req.query
    const query = {}

    if (status) {
      query.status = status
    }

    const registrations = await Registration.find(query)
      .populate("userId", "name email age barangay")
      .populate("eventId", "title date")
      .sort({ createdAt: -1 })

    res.json(registrations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Export registrations to CSV
router.get("/export/registrations/:eventId", adminAuth, async (req, res) => {
  try {
    const registrations = await Registration.find({
      eventId: req.params.eventId,
      status: "approved",
    })
      .populate("userId", "name email age barangay")
      .populate("eventId", "title")

    if (registrations.length === 0) {
      return res.status(404).json({ message: "No registrations found" })
    }

    // Create CSV content
    const csvHeader = "Name,Email,Age,Barangay,Contact Number,Registration Date\n"
    const csvContent = registrations
      .map(
        (reg) =>
          `"${reg.userId.name}","${reg.userId.email}",${reg.userId.age},"${reg.userId.barangay}","${reg.contactNumber}","${reg.createdAt.toISOString().split("T")[0]}"`,
      )
      .join("\n")

    const csv = csvHeader + csvContent

    res.setHeader("Content-Type", "text/csv")
    res.setHeader("Content-Disposition", `attachment; filename="${registrations[0].eventId.title}-registrations.csv"`)
    res.send(csv)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
