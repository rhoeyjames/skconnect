const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["sports", "education", "community", "health", "environment", "culture", "other"],
      required: true,
    },
    maxParticipants: {
      type: Number,
      default: null,
    },
    currentParticipants: {
      type: Number,
      default: 0,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    images: [
      {
        type: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    registrationDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
eventSchema.index({ date: 1, status: 1 })
eventSchema.index({ category: 1 })
eventSchema.index({ organizer: 1 })

module.exports = mongoose.model("Event", eventSchema)
