const express = require("express")
const User = require("../models/User")
const Event = require("../models/Event")

const router = express.Router()

// Get dashboard statistics (optimized for performance)
router.get("/stats", async (req, res) => {
  try {
    // Use Promise.all to run queries in parallel for better performance
    const [
      totalUsers,
      totalEvents,
      eventsThisMonth,
      uniqueLocations,
      completedEvents,
      usersByRole,
      recentEvents
    ] = await Promise.all([
      // Get total active users
      User.countDocuments({ isActive: true }),

      // Get total events
      Event.countDocuments(),

      // Get events this month
      Event.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }),

      // Get unique locations (barangays/municipalities) - limited for performance
      User.distinct("municipality").then(locations => locations.filter(Boolean)),

      // Get completed events (past events)
      Event.countDocuments({
        endDate: { $lt: new Date() }
      }),

      // Get user role distribution
      User.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: "$role", count: { $sum: 1 } } }
      ]),

      // Get recent events (limited fields for performance)
      Event.find()
        .sort({ createdAt: -1 })
        .limit(3)
        .select('title category status startDate endDate')
        .lean() // Use lean() for better performance
    ])
    
    res.json({
      message: "Dashboard statistics retrieved successfully",
      stats: {
        totalUsers,
        totalEvents,
        totalCommunities,
        completedEvents,
        eventsThisMonth,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count
          return acc
        }, {}),
        recentEvents
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({
      message: "Failed to retrieve dashboard statistics",
      error: error.message,
    })
  }
})

module.exports = router
