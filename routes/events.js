const express = require("express")
const { body, validationResult } = require("express-validator")
const Event = require("../models/Event")
const Registration = require("../models/Registration")
const { auth, adminAuth } = require("../middleware/auth")
const upload = require("../middleware/upload")

const router = express.Router()

// Get all events (public)
router.get("/", async (req, res) => {
  try {
    const { type, upcoming } = req.query
    const query = { isActive: true }

    if (type) {
      query.type = type
    }

    if (upcoming === "true") {
      query.date = { $gte: new Date() }
    }

    const events = await Event.find(query).populate("createdBy", "name").sort({ date: 1 })

    res.json(events)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name")

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Get registration count
    const registrationCount = await Registration.countDocuments({
      eventId: event._id,
      status: "approved",
    })

    res.json({
      ...event.toObject(),
      registrationCount,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create event (admin only)
router.post(
  "/",
  adminAuth,
  upload.single("eventImage"),
  [
    body("title").trim().isLength({ min: 3 }).withMessage("Title must be at least 3 characters"),
    body("description").trim().isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
    body("date").isISO8601().withMessage("Please enter a valid date"),
    body("time").notEmpty().withMessage("Time is required"),
    body("type")
      .isIn(["workshop", "seminar", "sports", "cultural", "community-service", "meeting", "other"])
      .withMessage("Invalid event type"),
    body("venue").trim().isLength({ min: 3 }).withMessage("Venue is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { title, description, date, time, type, venue, maxParticipants } = req.body

      const event = new Event({
        title,
        description,
        date: new Date(date),
        time,
        type,
        venue,
        maxParticipants: maxParticipants || 100,
        image: req.file ? req.file.path : "",
        createdBy: req.user._id,
      })

      await event.save()
      await event.populate("createdBy", "name")

      res.status(201).json(event)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update event (admin only)
router.put("/:id", adminAuth, upload.single("eventImage"), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    const updateData = { ...req.body }
    if (req.file) {
      updateData.image = req.file.path
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true }).populate(
      "createdBy",
      "name",
    )

    res.json(updatedEvent)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete event (admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    await Event.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ message: "Event deleted successfully" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
