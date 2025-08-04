const mongoose = require("mongoose")

const registrationSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "attended"],
      default: "pending",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
      relationship: {
        type: String,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate registrations
registrationSchema.index({ event: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("Registration", registrationSchema)
