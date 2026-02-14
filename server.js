const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

/* ================= MONGODB ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= SCHEMA ================= */
const confessionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  likes: { type: Number, default: 0 }
}, { timestamps: true });

const Confession = mongoose.model("Confession", confessionSchema);

/* ================= ROUTES ================= */

// GET all
app.get("/api/confessions", async (req, res) => {
  const data = await Confession.find().sort({ createdAt: -1 });
  res.json(data);
});

// POST new
app.post("/api/confessions", async (req, res) => {
  const newConfession = new Confession({ text: req.body.text });
  const saved = await newConfession.save();

  io.emit("newConfession", saved); // REALTIME
  res.json(saved);
});

// LIKE
app.put("/api/confessions/:id/like", async (req, res) => {
  const updated = await Confession.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );

  io.emit("updateLikes", updated); // REALTIME
  res.json(updated);
});

// DELETE
app.delete("/api/confessions/:id", async (req, res) => {
  await Confession.findByIdAndDelete(req.params.id);

  io.emit("deleteConfession", req.params.id); // REALTIME
  res.json({ message: "Deleted" });
});

/* ================= SOCKET ================= */
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 10000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
