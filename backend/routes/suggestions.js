const express = require("express")
const { body, validationResult } = require("express-validator")
const Suggestion = require("../models/Suggestion")
const Vote = require("../models/Vote")
const auth = require("../middleware/auth")
const upload = require("../middleware/upload")

const router = express.Router()

// Get all suggestions
router.get("/", async (req, res) => {
  try {
    const { category, status, page = 1, limit = 10, sort = "-createdAt" } = req.query
    const query = {}

    if (category) query.category = category
    if (status) query.status = status

    const suggestions = await Suggestion.find(query)
      .populate("author", "firstName lastName")
      .populate("reviewedBy", "firstName lastName")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Suggestion.countDocuments(query)

    res.json({
      suggestions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    })
  } catch (error) {
    console.error("Get suggestions error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get single suggestion
router.get("/:id", async (req, res) => {
  try {
    const suggestion = await Suggestion.findById(req.params.id)
      .populate("author", "firstName lastName")
      .populate("reviewedBy", "firstName lastName")
      .populate("comments.user", "firstName lastName")

    if (!suggestion) {
      return res.status(404).json({ message: "Suggestion not found" })
    }

    res.json(suggestion)
  } catch (error) {
    console.error("Get suggestion error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create suggestion
router.post(
  "/",
  auth,
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").trim().notEmpty().withMessage("Description is required"),
    body("category")
      .isIn(["event", "program", "facility", "policy", "other"])
      .withMessage("Valid category is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const suggestionData = {
        ...req.body,
        author: req.userId,
      }

      const suggestion = new Suggestion(suggestionData)
      await suggestion.save()

      const populatedSuggestion = await Suggestion.findById(suggestion._id).populate("author", "firstName lastName")

      res.status(201).json({
        message: "Suggestion created successfully",
        suggestion: populatedSuggestion,
      })
    } catch (error) {
      console.error("Create suggestion error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Vote on suggestion
router.post(
  "/:id/vote",
  auth,
  [body("voteType").isIn(["upvote", "downvote"]).withMessage("Valid vote type is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { voteType } = req.body
      const suggestionId = req.params.id

      // Check if suggestion exists
      const suggestion = await Suggestion.findById(suggestionId)
      if (!suggestion) {
        return res.status(404).json({ message: "Suggestion not found" })
      }

      // Check if user already voted
      const existingVote = await Vote.findOne({
        suggestion: suggestionId,
        user: req.userId,
      })

      if (existingVote) {
        // Update existing vote
        const oldVoteType = existingVote.voteType
        existingVote.voteType = voteType
        await existingVote.save()

        // Update suggestion vote counts
        if (oldVoteType !== voteType) {
          if (oldVoteType === "upvote") {
            suggestion.votes.upvotes -= 1
          } else {
            suggestion.votes.downvotes -= 1
          }

          if (voteType === "upvote") {
            suggestion.votes.upvotes += 1
          } else {
            suggestion.votes.downvotes += 1
          }

          await suggestion.save()
        }
      } else {
        // Create new vote
        const vote = new Vote({
          suggestion: suggestionId,
          user: req.userId,
          voteType,
        })
        await vote.save()

        // Update suggestion vote counts
        if (voteType === "upvote") {
          suggestion.votes.upvotes += 1
        } else {
          suggestion.votes.downvotes += 1
        }

        await suggestion.save()
      }

      res.json({
        message: "Vote recorded successfully",
        votes: suggestion.votes,
      })
    } catch (error) {
      console.error("Vote error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Add comment to suggestion
router.post(
  "/:id/comments",
  auth,
  [body("text").trim().notEmpty().withMessage("Comment text is required")],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const suggestion = await Suggestion.findById(req.params.id)
      if (!suggestion) {
        return res.status(404).json({ message: "Suggestion not found" })
      }

      const comment = {
        user: req.userId,
        text: req.body.text,
      }

      suggestion.comments.push(comment)
      await suggestion.save()

      const populatedSuggestion = await Suggestion.findById(suggestion._id).populate(
        "comments.user",
        "firstName lastName",
      )

      res.json({
        message: "Comment added successfully",
        comments: populatedSuggestion.comments,
      })
    } catch (error) {
      console.error("Add comment error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update suggestion status (admin only)
router.put(
  "/:id/status",
  auth,
  [
    body("status")
      .isIn(["pending", "under_review", "approved", "rejected", "implemented"])
      .withMessage("Valid status is required"),
    body("reviewNotes").optional().trim(),
  ],
  async (req, res) => {
    try {
      // Check if user is admin or SK official
      if (req.user.role !== "admin" && req.user.role !== "sk_official") {
        return res.status(403).json({ message: "Not authorized to update suggestion status" })
      }

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { status, reviewNotes } = req.body

      const suggestion = await Suggestion.findByIdAndUpdate(
        req.params.id,
        {
          status,
          reviewedBy: req.userId,
          reviewDate: new Date(),
          reviewNotes,
        },
        { new: true },
      )
        .populate("author", "firstName lastName")
        .populate("reviewedBy", "firstName lastName")

      if (!suggestion) {
        return res.status(404).json({ message: "Suggestion not found" })
      }

      res.json({
        message: "Suggestion status updated successfully",
        suggestion,
      })
    } catch (error) {
      console.error("Update suggestion status error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

module.exports = router
