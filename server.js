const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "public")));

// ============================
// MongoDB Connection
// ============================
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ============================
// Confession Schema
// ============================
const confessionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Confession = mongoose.model("Confession", confessionSchema);

// ============================
// Routes
// ============================

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all confessions
app.get("/api/confessions", async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.json(confessions);
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

// Add new confession
app.post("/api/confessions", async (req, res) => {
  try {
    const newConfession = new Confession({
      text: req.body.text,
    });

    await newConfession.save();
    res.status(201).json(newConfession);
  } catch (error) {
    res.status(400).json({ error: "Failed to save confession" });
  }
});

// ============================
// Server
// ============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
