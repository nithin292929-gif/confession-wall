require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const Confession = require("./models/Confession");

const app = express();
app.use(express.json());
app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* RANDOM AVATARS */
const avatars = [
  "🕶️", "👻", "🎭", "🔥", "🌙",
  "💀", "👽", "🦊", "🐼", "🐺"
];

/* SIMPLE AI REPLIES */
const aiReplies = [
  "That’s deeper than it looks.",
  "You’re not alone in this.",
  "That took courage to say.",
  "Sometimes silence says everything.",
  "Life is weird, right?",
  "Plot twist incoming 👀",
  "That confession hit different."
];

/* GET all */
app.get("/api/confessions", async (req, res) => {
  const confessions = await Confession.find().sort({ createdAt: -1 });
  res.json(confessions);
});

/* POST */
app.post("/api/confessions", async (req, res) => {
  try {
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
    const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];

    const newConfession = new Confession({
      text: req.body.text,
      avatar: randomAvatar,
      reply: randomReply,
    });

    const saved = await newConfession.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Error saving confession" });
  }
});

/* LIKE */
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
