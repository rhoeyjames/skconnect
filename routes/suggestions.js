const express = require("express")
const { body, validationResult } = require("express-validator")
const Suggestion = require("../models/Suggestion")
const Vote = require("../models/Vote")
const { auth, adminAuth } = require("../middleware/auth")
const upload = require("../middleware/upload")

const router = express.Router()

// Create suggestion
router.post(
  "/",
  auth,
  upload.array("suggestionFiles", 3),
  [
    body("title").trim().isLength({ min: 5 }).withMessage("Title must be at least 5 characters"),
    body("description").trim().isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { title, description } = req.body

      const attachments = req.files
        ? req.files.map((file) => ({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
          }))
        : []

      const suggestion = new Suggestion({
        userId: req.user._id,
        title,
        description,
        attachments,
      })

      await suggestion.save()
      await suggestion.populate("userId", "name barangay")

      res.status(201).json(suggestion)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get all suggestions
router.get("/", async (req, res) => {
  try {
    const { status, sort } = req.query
    const query = {}

    if (status) {
      query.status = status
    }

    let sortOption = { createdAt: -1 }
    if (sort === "votes") {
      sortOption = { votes: -1, createdAt: -1 }
    }

    const suggestions = await Suggestion.find(query).populate("userId", "name barangay").sort(sortOption)

    res.json(suggestions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single suggestion
router.get("/:id", async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id).populate("userId", "name barangay")

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" })
    }

    res.json(suggestion)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Vote on suggestion
router.post("/:id/vote", auth, async (req, res) => {
  try {
    const suggestionId = req.params.id
    const userId = req.user._id

    // Check if suggestion exists
    const suggestion = await Suggestion.findById(suggestionId)
    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" })
    }

    // Check if user already voted
    const existingVote = await Vote.findOne({ suggestionId, userId })
    if (existingVote) {
      // Remove vote
      await Vote.findByIdAndDelete(existingVote._id)
      await Suggestion.findByIdAndUpdate(suggestionId, { $inc: { votes: -1 } })
      return res.json({ message: "Vote removed", voted: false })
    } else {
      // Add vote
      const vote = new Vote({ suggestionId, userId })
      await vote.save()
      await Suggestion.findByIdAndUpdate(suggestionId, { $inc: { votes: 1 } })
      return res.json({ message: "Vote added", voted: true })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update suggestion status (admin only)
router.put(
  "/:id/status",
  adminAuth,
  [
    body("status").isIn(["pending", "approved", "rejected", "under-review"]).withMessage("Invalid status"),
    body("adminComments").optional().isString(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { status, adminComments } = req.body

      const suggestion = await Suggestion.findByIdAndUpdate(
        req.params.id,
        { status, adminComments },
        { new: true },
      ).populate("userId", "name barangay")

      if (!suggestion) {
        return res.status(404).json({ message: "Suggestion not found" })
      }

      res.json(suggestion)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Check if user voted
router.get("/:id/vote-status", auth, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      suggestionId: req.params.id,
      userId: req.user._id,
    })

    res.json({ voted: !!vote })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
