const express = require("express")
const User = require("../models/User")
const Event = require("../models/Event")

const router = express.Router()

// Get dashboard statistics
router.get("/stats", async (req, res) => {
  try {
    // Get total active users
    const totalUsers = await User.countDocuments({ isActive: true })
    
    // Get total events
    const totalEvents = await Event.countDocuments()
    
    // Get events this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)
    
    const eventsThisMonth = await Event.countDocuments({
      createdAt: { $gte: startOfMonth }
    })
    
    // Get unique locations (barangays/municipalities)
    const uniqueLocations = await User.distinct("municipality")
    const totalCommunities = uniqueLocations.length
    
    // Get completed events (past events)
    const currentDate = new Date()
    const completedEvents = await Event.countDocuments({
      endDate: { $lt: currentDate }
    })
    
    // Get user role distribution
    const usersByRole = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ])
    
    // Get recent events
    const recentEvents = await Event.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title category status startDate endDate')
    
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
