const mongoose = require("mongoose")

const suggestionSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ["event", "program", "facility", "policy", "other"],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "implemented"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    votes: {
      upvotes: {
        type: Number,
        default: 0,
      },
      downvotes: {
        type: Number,
        default: 0,
      },
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    attachments: [
      {
        filename: String,
        url: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewDate: {
      type: Date,
    },
    reviewNotes: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
suggestionSchema.index({ status: 1, createdAt: -1 })
suggestionSchema.index({ category: 1 })
suggestionSchema.index({ author: 1 })

module.exports = mongoose.model("Suggestion", suggestionSchema)
