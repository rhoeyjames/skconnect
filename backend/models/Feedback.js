const mongoose = require("mongoose")

const feedbackSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
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
      trim: true,
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
feedbackSchema.index({ event: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("Feedback", feedbackSchema)
