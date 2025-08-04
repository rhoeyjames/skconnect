const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
    categories: {
      organization: {
        type: Number,
        min: 1,
        max: 5,
      },
      content: {
        type: Number,
        min: 1,
        max: 5,
      },
      venue: {
        type: Number,
        min: 1,
        max: 5,
      },
      overall: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    suggestions: {
      type: String,
      maxlength: [500, "Suggestions cannot exceed 500 characters"],
    },
    wouldRecommend: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate feedback
feedbackSchema.index({ eventId: 1, userId: 1 }, { unique: true })

// Index for better query performance
feedbackSchema.index({ eventId: 1 })
feedbackSchema.index({ rating: 1 })

module.exports = mongoose.model("Feedback", feedbackSchema)
