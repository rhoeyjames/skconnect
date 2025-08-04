const express = require("express")
const { body, validationResult } = require("express-validator")
const Event = require("../models/Event")
const Registration = require("../models/Registration")
const auth = require("../middleware/auth")
const upload = require("../middleware/upload")

const router = express.Router()

// Get all events
router.get("/", async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query
    const query = { isPublic: true }

    if (category) query.category = category
    if (status) query.status = status

    const events = await Event.find(query)
      .populate("organizer", "firstName lastName")
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Event.countDocuments(query)

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get events error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "firstName lastName email")

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    res.json(event)
  } catch (error) {
    console.error("Get event error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create event (protected)
router.post(
  "/",
  auth,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("date").isISO8601().withMessage("Valid date is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("location").trim().notEmpty().withMessage("Location is required"),
    body("category")
      .isIn(["sports", "education", "community", "health", "environment", "culture", "other"])
      .withMessage("Valid category is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const eventData = {
        ...req.body,
        organizer: req.userId,
      }

      const event = new Event(eventData)
      await event.save()

      const populatedEvent = await Event.findById(event._id).populate("organizer", "firstName lastName")

      res.status(201).json({
        message: "Event created successfully",
        event: populatedEvent,
      })
    } catch (error) {
      console.error("Create event error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update event (protected)
router.put("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this event" })
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("organizer", "firstName lastName")

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    })
  } catch (error) {
    console.error("Update event error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete event (protected)
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this event" })
    }

    await Event.findByIdAndDelete(req.params.id)
    await Registration.deleteMany({ event: req.params.id })

    res.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error("Delete event error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
