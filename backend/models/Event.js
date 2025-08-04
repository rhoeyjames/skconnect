const mongoose = require("mongoose")

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Event description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
      validate: {
        validator: (value) => value > new Date(),
        message: "Event date must be in the future",
      },
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please enter a valid time format (HH:MM)"],
    },
    venue: {
      type: String,
      required: [true, "Event venue is required"],
      trim: true,
      maxlength: [200, "Venue cannot exceed 200 characters"],
    },
    type: {
      type: String,
      required: [true, "Event type is required"],
      enum: ["workshop", "seminar", "sports", "cultural", "community-service", "meeting", "training", "competition"],
      lowercase: true,
    },
    image: {
      type: String,
      default: null,
    },
    maxParticipants: {
      type: Number,
      default: 100,
      min: [1, "Maximum participants must be at least 1"],
    },
    registrationDeadline: {
      type: Date,
      default: function () {
        return new Date(this.date.getTime() - 24 * 60 * 60 * 1000) // 1 day before event
      },
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "cancelled", "completed"],
      default: "published",
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
eventSchema.index({ date: 1, status: 1 })
eventSchema.index({ type: 1 })
eventSchema.index({ createdBy: 1 })

// Virtual for registration count
eventSchema.virtual("registrationCount", {
  ref: "Registration",
  localField: "_id",
  foreignField: "eventId",
  count: true,
  match: { status: "approved" },
})

// Ensure virtual fields are serialized
eventSchema.set("toJSON", { virtuals: true })
eventSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Event", eventSchema)
