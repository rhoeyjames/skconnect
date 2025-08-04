const mongoose = require("mongoose")

const suggestionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Suggestion title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Suggestion description is required"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    category: {
      type: String,
      enum: ["infrastructure", "education", "health", "environment", "sports", "culture", "technology", "other"],
      default: "other",
    },
    targetBeneficiaries: {
      type: String,
      maxlength: [500, "Target beneficiaries cannot exceed 500 characters"],
    },
    estimatedBudget: {
      type: Number,
      min: [0, "Budget cannot be negative"],
    },
    timeline: {
      type: String,
      maxlength: [200, "Timeline cannot exceed 200 characters"],
    },
    attachments: [
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "under-review", "approved", "rejected", "implemented"],
      default: "pending",
    },
    adminComments: [
      {
        comment: {
          type: String,
          required: true,
          maxlength: [1000, "Comment cannot exceed 1000 characters"],
        },
        commentedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        commentedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reviewedAt: {
      type: Date,
    },
    implementationDate: {
      type: Date,
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
suggestionSchema.index({ status: 1 })
suggestionSchema.index({ createdBy: 1 })
suggestionSchema.index({ category: 1 })

// Virtual for vote count
suggestionSchema.virtual("voteCount", {
  ref: "Vote",
  localField: "_id",
  foreignField: "suggestionId",
  count: true,
})

// Ensure virtual fields are serialized
suggestionSchema.set("toJSON", { virtuals: true })
suggestionSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Suggestion", suggestionSchema)
