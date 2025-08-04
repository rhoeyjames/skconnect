const express = require("express")
const { body, validationResult } = require("express-validator")
const Registration = require("../models/Registration")
const Event = require("../models/Event")
const auth = require("../middleware/auth")

const router = express.Router()

// Register for event
router.post(
  "/",
  auth,
  [
    body("eventId").notEmpty().withMessage("Event ID is required"),
    body("emergencyContact.name").optional().trim(),
    body("emergencyContact.phone").optional().trim(),
    body("emergencyContact.relationship").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { eventId, notes, emergencyContact } = req.body

      // Check if event exists
      const event = await Event.findById(eventId)
      if (!event) {
        return res.status(404).json({ message: "Event not found" })
      }

      // Check if registration deadline has passed
      if (event.registrationDeadline && new Date() > event.registrationDeadline) {
        return res.status(400).json({ message: "Registration deadline has passed" })
      }

      // Check if event is full
      if (event.maxParticipants && event.currentParticipants >= event.maxParticipants) {
        return res.status(400).json({ message: "Event is full" })
      }

      // Check if user is already registered
      const existingRegistration = await Registration.findOne({
        event: eventId,
        user: req.userId,
      })

      if (existingRegistration) {
        return res.status(400).json({ message: "Already registered for this event" })
      }

      // Create registration
      const registration = new Registration({
        event: eventId,
        user: req.userId,
        notes,
        emergencyContact,
      })

      await registration.save()

      // Update event participant count
      await Event.findByIdAndUpdate(eventId, {
        $inc: { currentParticipants: 1 },
      })

      const populatedRegistration = await Registration.findById(registration._id)
        .populate("event", "title date time location")
        .populate("user", "firstName lastName email")

      res.status(201).json({
        message: "Registration successful",
        registration: populatedRegistration,
      })
    } catch (error) {
      console.error("Registration error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get user's registrations
router.get("/my-registrations", auth, async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.userId })
      .populate("event", "title date time location status category")
      .sort({ registrationDate: -1 })

    res.json(registrations)
  } catch (error) {
    console.error("Get registrations error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get event registrations (for organizers)
router.get("/event/:eventId", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId)

    if (!event) {
      return res.status(404).json({ message: "Event not found" })
    }

    // Check if user is the organizer or admin
    if (event.organizer.toString() !== req.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view registrations" })
    }

    const registrations = await Registration.find({ event: req.params.eventId })
      .populate("user", "firstName lastName email phoneNumber age barangay")
      .sort({ registrationDate: -1 })

    res.json(registrations)
  } catch (error) {
    console.error("Get event registrations error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update registration status
router.put(
  "/:id/status",
  auth,
  [body("status").isIn(["pending", "confirmed", "cancelled", "attended"]).withMessage("Valid status is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const registration = await Registration.findById(req.params.id).populate("event")

      if (!registration) {
        return res.status(404).json({ message: "Registration not found" })
      }

      // Check if user is the organizer, the registered user, or admin
      const isOrganizer = registration.event.organizer.toString() === req.userId
      const isRegisteredUser = registration.user.toString() === req.userId
      const isAdmin = req.user.role === "admin"

      if (!isOrganizer && !isRegisteredUser && !isAdmin) {
        return res.status(403).json({ message: "Not authorized to update this registration" })
      }

      const oldStatus = registration.status
      registration.status = req.body.status
      await registration.save()

      // Update event participant count
      if (oldStatus !== req.body.status) {
        if (req.body.status === "cancelled" && oldStatus !== "cancelled") {
          await Event.findByIdAndUpdate(registration.event._id, {
            $inc: { currentParticipants: -1 },
          })
        } else if (oldStatus === "cancelled" && req.body.status !== "cancelled") {
          await Event.findByIdAndUpdate(registration.event._id, {
            $inc: { currentParticipants: 1 },
          })
        }
      }

      res.json({
        message: "Registration status updated successfully",
        registration,
      })
    } catch (error) {
      console.error("Update registration status error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Cancel registration
router.delete("/:id", auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" })
    }

    // Check if user is the registered user or admin
    if (registration.user.toString() !== req.userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this registration" })
    }

    // Update event participant count if registration was confirmed
    if (registration.status !== "cancelled") {
      await Event.findByIdAndUpdate(registration.event, {
        $inc: { currentParticipants: -1 },
      })
    }

    await Registration.findByIdAndDelete(req.params.id)

    res.json({ message: "Registration cancelled successfully" })
  } catch (error) {
    console.error("Cancel registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
