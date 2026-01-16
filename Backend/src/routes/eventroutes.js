import express from "express";
import Event from "../models/Event.js";
import auth from "../middleware/authMiddleware.js";
import User from "../models/User.js";


const router = express.Router();

/**
 * Create event
 */
router.post("/", auth, async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.userId
    });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get user's events
 */
router.get("/", auth, async (req, res) => {
  const events = await Event.find({ organizer: req.userId });
  res.json(events);
});
router.get("/feed", auth, async (req, res) => {
  try {
    // Get user's friends
    const user = await User.findById(req.userId).select("friends");

    const events = await Event.find({
      organizer: { $in: user.friends }
    }).populate("organizer", "name email");

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * Get single event
 */
router.get("/:id", auth, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.json(event);
});

/**
 * Update event
 */
router.put("/:id", auth, async (req, res) => {
  const event = await Event.findOneAndUpdate(
    { _id: req.params.id, organizer: req.userId },
    req.body,
    { new: true }
  );
  res.json(event);
});

/**
 * Delete event
 */
router.delete("/:id", auth, async (req, res) => {
  await Event.findOneAndDelete({ _id: req.params.id, organizer: req.userId });
  res.json({ message: "Event deleted" });
});

export default router;
