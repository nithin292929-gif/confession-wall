const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Error:", err));

// Schema
const confessionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

const Confession = mongoose.model("Confession", confessionSchema);

// ================= ROUTES =================

// Get all confessions
app.get("/api/confessions", async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.json(confessions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Add new confession
app.post("/api/confessions", async (req, res) => {
  try {
    const newConfession = new Confession({
      text: req.body.text
    });

    const saved = await newConfession.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: "Invalid data" });
  }
});

// Like confession
app.put("/api/confessions/:id/like", async (req, res) => {
  try {
    const updated = await Confession.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likes: 1 } },
      { returnDocument: "after" }
    );

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Update failed" });
  }
});

// Delete confession
app.delete("/api/confessions/:id", async (req, res) => {
  try {
    await Confession.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Delete failed" });
  }
});

// ================= SERVER =================

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
