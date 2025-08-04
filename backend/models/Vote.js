const mongoose = require("mongoose")

const voteSchema = new mongoose.Schema(
  {
    suggestionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Suggestion",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    voteType: {
      type: String,
      enum: ["upvote", "downvote"],
      default: "upvote",
    },
  },
  {
    timestamps: true,
  },
)

// Compound index to prevent duplicate votes
voteSchema.index({ suggestionId: 1, userId: 1 }, { unique: true })

module.exports = mongoose.model("Vote", voteSchema)
