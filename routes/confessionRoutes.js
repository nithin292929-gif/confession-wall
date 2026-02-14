const express = require("express");
const router = express.Router();
const Confession = require("../models/Confession");

// GET all confessions
router.get("/", async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.json(confessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch confessions" });
  }
});

// POST new confession
router.post("/", async (req, res) => {
  try {
    const newConfession = new Confession({
      text: req.body.text,
    });

    const saved = await newConfession.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save confession" });
  }
});

// DELETE confession
router.delete("/:id", async (req, res) => {
  try {
    await Confession.findByIdAndDelete(req.params.id);
    res.json({ message: "Confession deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete confession" });
  }
});

// LIKE confession
router.put("/:id/like", async (req, res) => {
  try {
    const confession = await Confession.findById(req.params.id);

    if (!confession) {
      return res.status(404).json({ error: "Confession not found" });
    }

    confession.likes += 1;
    await confession.save();

    res.json(confession);
  } catch (err) {
    res.status(500).json({ error: "Failed to like confession" });
  }
});

module.exports = router;
