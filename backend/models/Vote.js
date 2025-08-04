const mongoose = require("mongoose")

const voteSchema = new mongoose.Schema(
  {
    suggestion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suggestion",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate votes
voteSchema.index({ suggestion: 1, user: 1 }, { unique: true })

module.exports = mongoose.model("Vote", voteSchema)
