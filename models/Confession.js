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
  },
  { timestamps: true } // IMPORTANT for createdAt
);

module.exports = mongoose.model("Confession", confessionSchema);
