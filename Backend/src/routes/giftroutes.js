import express from "express";
import Gift from "../models/Gift.js";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { cloudinary } from "../config/cloudinary.js";
import {
  pledgeGift,
  unpledgeGift
} from "../controllers/giftcontroller.js";

const router = express.Router();

router.post("/:giftId/pledge", auth, pledgeGift);
router.post("/:giftId/unpledge", auth, unpledgeGift);

/**
 * Create gift
 */

router.post(
  "/",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const giftData = {
        name: req.body.name,
        price: req.body.price,
        event: req.body.event,
        imageUrl: req.file ? req.file.path : null,
        imagePublicId: req.file ? req.file.filename : null
      };
      const gift = await Gift.create(giftData);
      res.status(201).json(gift);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/**
 * Get gifts for an event
 */
router.get("/event/:eventId", auth, async (req, res) => {
  const gifts = await Gift.find({ event: req.params.eventId });
  res.json(gifts);
});

/**
 * Update gift
 */
router.put(
  "/:id",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const gift = await Gift.findById(req.params.id);
      if (!gift) {
        return res.status(404).json({ message: "Gift not found" });
      }

      // If new image uploaded → delete old one
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
  }
);

/**
 * Delete gift
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) {
      return res.status(404).json({ message: "Gift not found" });
    }

    if (gift.imagePublicId) {
      await cloudinary.uploader.destroy(gift.imagePublicId);
    }

    await gift.deleteOne();
    res.json({ message: "Gift deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
