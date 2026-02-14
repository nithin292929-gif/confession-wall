const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

/* ================= SCHEMA ================= */
const confessionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    likes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Confession = mongoose.model("Confession", confessionSchema);

/* ================= ROUTES ================= */

// GET all confessions
app.get("/api/confessions", async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.json(confessions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch confessions" });
  }
});

// POST new confession
app.post("/api/confessions", async (req, res) => {
  try {
    const newConfession = new Confession({ text: req.body.text });
    const saved = await newConfession.save();

    io.emit("newConfession", saved); // realtime update
    res.json(saved);
  } catch (error) {
    res.status(400).json({ error: "Failed to create confession" });
  }
});

// LIKE confession
app.put("/api/confessions/:id/like", async (req, res) => {
  try {
    const updated = await Confession.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    io.emit("updateLikes", updated); // realtime update
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Failed to like confession" });
  }
});

// DELETE confession
app.delete("/api/confessions/:id", async (req, res) => {
  try {
    await Confession.findByIdAndDelete(req.params.id);

    io.emit("deleteConfession", req.params.id); // realtime update
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete confession" });
  }
});

/* ================= SOCKET ================= */
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
