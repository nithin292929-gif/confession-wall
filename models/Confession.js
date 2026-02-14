const mongoose = require("mongoose");

const confessionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
    },
    reply: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Confession", confessionSchema);
