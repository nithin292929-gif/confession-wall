require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Confession = require("./models/Confession");

const app = express();
app.use(express.json());
app.use(express.static("public"));

/* MongoDB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* GET all confessions */
app.get("/api/confessions", async (req, res) => {
  const confessions = await Confession.find().sort({ createdAt: -1 });
  res.json(confessions);
});

/* POST confession */
app.post("/api/confessions", async (req, res) => {
  try {
    const newConfession = new Confession({
      text: req.body.text,
    });

    const saved = await newConfession.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Error saving confession" });
  }
});

/* LIKE confession */
app.put("/api/confessions/:id/like", async (req, res) => {
  try {
    const updated = await Confession.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error liking confession" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port", PORT));
