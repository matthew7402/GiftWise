import Gift from "../models/Gift.js";
import Event from "../models/Event.js";
import User from "../models/User.js";
import { cloudinary } from "../config/cloudinary.js";


export const pledgeGift = async (req, res) => {
  try {
    const userId = req.userId;
    const { giftId } = req.params;

    const gift = await Gift.findById(giftId);
    if (!gift)
      return res.status(404).json({ message: "Gift not found" });

    if (gift.pledgedBy)
      return res.status(400).json({ message: "Gift already pledged" });

    const event = await Event.findById(gift.event);
    if (!event)
      return res.status(404).json({ message: "Event not found" });

    if (event.organizer.equals(userId))
      return res.status(403).json({ message: "Cannot pledge your own event" });

    const creator = await User.findById(event.organizer);

    if (!creator.friends.includes(userId))
      return res.status(403).json({ message: "Only friends can pledge gifts" });

    const existingPledge = await Gift.findOne({
      event: event._id,
      pledgedBy: userId
    });

    if (existingPledge)
      return res
        .status(400)
        .json({ message: "You already pledged a gift in this event" });

    gift.pledgedBy = userId;
    await gift.save();

    res.json({ message: "Gift pledged successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const unpledgeGift = async (req, res) => {
  try {
    const userId = req.userId;
    const { giftId } = req.params;

    const gift = await Gift.findById(giftId);
    if (!gift)
      return res.status(404).json({ message: "Gift not found" });

    if (!gift.pledgedBy || !gift.pledgedBy.equals(userId))
      return res
        .status(403)
        .json({ message: "You did not pledge this gift" });

    gift.pledgedBy = null;
    await gift.save();

    res.json({ message: "Gift unpledged successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const createGift = async (req, res) => {
  try {
    const giftData = {
      name: req.body.name,
      event: req.body.event,
      description: req.body.description,
      imageUrl: req.file ? req.file.path : null,
      imagePublicId: req.file ? req.file.filename : null
    };

    const gift = await Gift.create(giftData);
    res.status(201).json(gift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get gifts for an event
 */
export const getGiftsByEvent = async (req, res) => {
  try {
    const gifts = await Gift.find({ event: req.params.eventId });
    res.json(gifts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Update gift
 */
export const updateGift = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      return res.status(404).json({ message: "Gift not found" });
    }

    // ✅ Delete old image if new one uploaded
    if (req.file && gift.imagePublicId) {
      await cloudinary.uploader.destroy(gift.imagePublicId);
    }

    const updates = {
      name: req.body.name,
      price: req.body.price
    };

    if (req.file) {
      updates.imageUrl = req.file.path;
      updates.imagePublicId = req.file.filename;
    }

    const updatedGift = await Gift.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(updatedGift);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Delete gift
 */
export const deleteGift = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);

    if (!gift) {
      return res.status(404).json({ message: "Gift not found" });
    }

    // ✅ Delete image from Cloudinary
    if (gift.imagePublicId) {
      await cloudinary.uploader.destroy(gift.imagePublicId);
    }

    await gift.deleteOne();

    res.json({ message: "Gift deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
