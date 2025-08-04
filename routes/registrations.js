const express = require("express")
const { body, validationResult } = require("express-validator")
const Registration = require("../models/Registration")
const Event = require("../models/Event")
const { auth, adminAuth } = require("../middleware/auth")
const upload = require("../middleware/upload")

const router = express.Router()

// Register for event
router.post(
  "/",
  auth,
  upload.array("registrationFiles", 5),
  [
    body("eventId").isMongoId().withMessage("Invalid event ID"),
    body("contactNumber").isMobilePhone().withMessage("Please enter a valid contact number"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { eventId, contactNumber } = req.body

      // Check if event exists
      const event = await Event.findById(eventId)
      if (!event) {
        return res.status(404).json({ message: "Event not found" })
      }

      // Check if already registered
      const existingRegistration = await Registration.findOne({
        userId: req.user._id,
        eventId,
      })

      if (existingRegistration) {
        return res.status(400).json({ message: "Already registered for this event" })
      }

      // Check if event is full
      const approvedCount = await Registration.countDocuments({
        eventId,
        status: "approved",
      })

      if (approvedCount >= event.maxParticipants) {
        return res.status(400).json({ message: "Event is full" })
      }

      const uploadedFiles = req.files
        ? req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
          }))
        : []

      const registration = new Registration({
        userId: req.user._id,
        eventId,
        contactNumber,
        uploadedFiles,
      })

      await registration.save()
      await registration.populate(["userId", "eventId"])

      res.status(201).json(registration)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get user's registrations
router.get("/my-registrations", auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id }).populate("eventId").sort({ createdAt: -1 })

    res.json(registrations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get event registrations (admin only)
router.get("/event/:eventId", adminAuth, async (req, res) => {
  try {
    const registrations = await Registration.find({ eventId: req.params.eventId })
      .populate("userId", "name email age barangay")
      .sort({ createdAt: -1 })

    res.json(registrations)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update registration status (admin only)
router.put(
  "/:id/status",
  adminAuth,
  [
    body("status").isIn(["pending", "approved", "rejected"]).withMessage("Invalid status"),
    body("adminNotes").optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { status, adminNotes } = req.body

      const registration = await Registration.findByIdAndUpdate(
        req.params.id,
        { status, adminNotes },
        { new: true },
      ).populate(["userId", "eventId"])

      if (!registration) {
        return res.status(404).json({ message: "Registration not found" })
      }

      res.json(registration)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

module.exports = router
