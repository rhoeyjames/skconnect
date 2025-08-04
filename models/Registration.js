const mongoose = require("mongoose")

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    contactNumber: {
      type: String,
      required: true,
    },
    uploadedFiles: [
      {
        filename: String,
        originalName: String,
        path: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
)

// Prevent duplicate registrations
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true })

module.exports = mongoose.model("Registration", registrationSchema)
