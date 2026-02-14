const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const confessionSchema = new mongoose.Schema({
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const Confession = mongoose.model("Confession", confessionSchema);

// 👇 IMPORTANT: create http server
const server = http.createServer(app);

// 👇 Attach socket to server
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Socket connection
io.on("connection", (socket) => {
  console.log("User connected");
});

// Get all confessions
app.get("/confessions", async (req, res) => {
  const confessions = await Confession.find().sort({ createdAt: -1 });
  res.json(confessions);
});

// Post confession
app.post("/confessions", async (req, res) => {
  const newConfession = new Confession({
    text: req.body.text
  });

  await newConfession.save();

  // 🔥 THIS MAKES REALTIME WORK
  io.emit("newConfession", newConfession);

  res.json(newConfession);
});

const PORT = process.env.PORT || 5000;

// ⚠️ IMPORTANT: use server.listen NOT app.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
