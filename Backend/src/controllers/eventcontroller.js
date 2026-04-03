import Event from "../models/Event.js";
import User from "../models/User.js";

/**
 * Create event
 */
export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.userId
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get user's events
 */
export const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.userId });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Get friends' events (feed)
 */
export const getFeedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("friends");

    const events = await Event.find({
      organizer: { $in: user.friends }
    }).populate("organizer", "name email");

    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get single event
 */
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Update event
 */
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.userId },
      req.body,
      { new: true }
    );

    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Delete event
 */
export const deleteEvent = async (req, res) => {
  try {
    await Event.findOneAndDelete({
      _id: req.params.id,
      organizer: req.userId
    });

    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};