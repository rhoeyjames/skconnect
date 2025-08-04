const express = require("express")
const { body, validationResult } = require("express-validator")
const Feedback = require("../models/Feedback")
const Event = require("../models/Event")
const Registration = require("../models/Registration")
const { auth } = require("../middleware/auth")

const router = express.Router()

// Submit feedback
router.post(
  "/",
  auth,
  [
    body("eventId").isMongoId().withMessage("Invalid event ID"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").trim().isLength({ min: 10 }).withMessage("Comment must be at least 10 characters"),
    body("anonymous").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { eventId, rating, comment, anonymous } = req.body

      // Check if event exists
      const event = await Event.findById(eventId)
      if (!event) {
        return res.status(404).json({ message: "Event not found" })
      }

      // Check if user was registered for the event
      const registration = await Registration.findOne({
        userId: req.user._id,
        eventId,
        status: "approved",
      })

      if (!registration) {
        return res.status(400).json({ message: "You must be registered for this event to give feedback" })
      }

      // Check if feedback already exists
      const existingFeedback = await Feedback.findOne({
        userId: req.user._id,
        eventId,
      })

      if (existingFeedback) {
        return res.status(400).json({ message: "You have already submitted feedback for this event" })
      }

      const feedback = new Feedback({
        userId: req.user._id,
        eventId,
        rating,
        comment,
        anonymous: anonymous || false,
      })

      await feedback.save()

      res.status(201).json({ message: "Feedback submitted successfully" })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get event feedback
router.get("/event/:eventId", async (req, res) => {
  try {
    const feedback = await Feedback.find({ eventId: req.params.eventId })
      .populate("userId", "name barangay")
      .sort({ createdAt: -1 })

    // Hide user info for anonymous feedback
    const processedFeedback = feedback.map((fb) => ({
      ...fb.toObject(),
      userId: fb.anonymous ? null : fb.userId,
    }))

    res.json(processedFeedback)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get event feedback stats
router.get("/event/:eventId/stats", async (req, res) => {
  try {
    const feedback = await Feedback.find({ eventId: req.params.eventId })

    if (feedback.length === 0) {
      return res.json({
        totalFeedback: 0,
        averageRating: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      })
    }

    const totalRating = feedback.reduce((sum, fb) => sum + fb.rating, 0)
    const averageRating = totalRating / feedback.length

    const ratingDistribution = feedback.reduce((dist, fb) => {
      dist[fb.rating] = (dist[fb.rating] || 0) + 1
      return dist
    }, {})

    res.json({
      totalFeedback: feedback.length,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
