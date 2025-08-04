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
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Prevent duplicate feedback
feedbackSchema.index({ eventId: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model("Feedback", feedbackSchema)
