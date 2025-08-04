const express = require("express")
const { body, validationResult } = require("express-validator")
const Feedback = require("../models/Feedback")
const Event = require("../models/Event")
const Registration = require("../models/Registration")
const auth = require("../middleware/auth")
const mongoose = require("mongoose") // Import mongoose

const router = express.Router()

// Submit feedback for an event
router.post(
  "/",
  auth,
  [
    body("eventId").notEmpty().withMessage("Event ID is required"),
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").optional().trim(),
    body("categories.organization").optional().isInt({ min: 1, max: 5 }),
    body("categories.content").optional().isInt({ min: 1, max: 5 }),
    body("categories.venue").optional().isInt({ min: 1, max: 5 }),
    body("categories.overall").optional().isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { eventId, rating, comment, categories, suggestions, wouldRecommend } = req.body

      // Check if event exists
      const event = await Event.findById(eventId)
      if (!event) {
        return res.status(404).json({ message: "Event not found" })
      }

      // Check if user was registered for the event
      const registration = await Registration.findOne({
        event: eventId,
        user: req.userId,
        status: { $in: ["confirmed", "attended"] },
      })

      if (!registration) {
        return res
          .status(400)
          .json({ message: "You must be registered and confirmed for this event to leave feedback" })
      }

      // Check if user already submitted feedback
      const existingFeedback = await Feedback.findOne({
        event: eventId,
        user: req.userId,
      })

      if (existingFeedback) {
        return res.status(400).json({ message: "You have already submitted feedback for this event" })
      }

      // Create feedback
      const feedback = new Feedback({
        event: eventId,
        user: req.userId,
        rating,
        comment,
        categories,
        suggestions,
        wouldRecommend,
      })

      await feedback.save()

      const populatedFeedback = await Feedback.findById(feedback._id)
        .populate("event", "title date")
        .populate("user", "firstName lastName")

      res.status(201).json({
        message: "Feedback submitted successfully",
        feedback: populatedFeedback,
      })
    } catch (error) {
      console.error("Submit feedback error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get feedback for an event
router.get("/event/:eventId", async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query

    const feedback = await Feedback.find({ event: req.params.eventId })
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Feedback.countDocuments({ event: req.params.eventId })

    // Calculate average ratings
    const avgRatings = await Feedback.aggregate([
      { $match: { event: mongoose.Types.ObjectId(req.params.eventId) } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          avgOrganization: { $avg: "$categories.organization" },
          avgContent: { $avg: "$categories.content" },
          avgVenue: { $avg: "$categories.venue" },
          avgOverall: { $avg: "$categories.overall" },
          totalFeedback: { $sum: 1 },
        },
      },
    ])

    res.json({
      feedback,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      averages: avgRatings[0] || null,
    })
  } catch (error) {
    console.error("Get event feedback error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user's feedback
router.get("/my-feedback", auth, async (req, res) => {
  try {
    const feedback = await Feedback.find({ user: req.userId })
      .populate("event", "title date location")
      .sort({ createdAt: -1 })

    res.json(feedback)
  } catch (error) {
    console.error("Get user feedback error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update feedback
router.put(
  "/:id",
  auth,
  [
    body("rating").optional().isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5"),
    body("comment").optional().trim(),
    body("categories.organization").optional().isInt({ min: 1, max: 5 }),
    body("categories.content").optional().isInt({ min: 1, max: 5 }),
    body("categories.venue").optional().isInt({ min: 1, max: 5 }),
    body("categories.overall").optional().isInt({ min: 1, max: 5 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const feedback = await Feedback.findById(req.params.id)

      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" })
      }

      // Check if user owns this feedback
      if (feedback.user.toString() !== req.userId) {
        return res.status(403).json({ message: "Not authorized to update this feedback" })
      }

      const updatedFeedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      })
        .populate("event", "title date")
        .populate("user", "firstName lastName")

      res.json({
        message: "Feedback updated successfully",
        feedback: updatedFeedback,
      })
    } catch (error) {
      console.error("Update feedback error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete feedback
router.delete("/:id", auth, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" })
    }

    // Check if user owns this feedback or is admin
    if (feedback.user.toString() !== req.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this feedback" })
    }

    await Feedback.findByIdAndDelete(req.params.id)

    res.json({ message: "Feedback deleted successfully" })
  } catch (error) {
    console.error("Delete feedback error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
