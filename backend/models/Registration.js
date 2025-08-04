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
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    registrationDate: {
      type: Date,
      default: Date.now,
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^(\+63|0)[0-9]{10}$/, "Please enter a valid Philippine phone number"],
    },
    emergencyContact: {
      name: {
        type: String,
        required: [true, "Emergency contact name is required"],
        trim: true,
      },
      relationship: {
        type: String,
        required: [true, "Emergency contact relationship is required"],
        trim: true,
      },
      phone: {
        type: String,
        required: [true, "Emergency contact phone is required"],
        match: [/^(\+63|0)[0-9]{10}$/, "Please enter a valid Philippine phone number"],
      },
    },
    uploadedFiles: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    specialRequirements: {
      type: String,
      maxlength: [500, "Special requirements cannot exceed 500 characters"],
    },
    adminNotes: {
      type: String,
      maxlength: [1000, "Admin notes cannot exceed 1000 characters"],
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate registrations
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true })

// Index for better query performance
registrationSchema.index({ status: 1 })
registrationSchema.index({ eventId: 1, status: 1 })

module.exports = mongoose.model("Registration", registrationSchema)
