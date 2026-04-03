import express from "express";
import Gift from "../models/Gift.js";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { cloudinary } from "../config/cloudinary.js";
import {
  pledgeGift,
  unpledgeGift,
  createGift,
  getGiftsByEvent,
  updateGift,
  deleteGift  
} from "../controllers/giftcontroller.js";

const router = express.Router();

router.post("/:giftId/pledge", auth, pledgeGift);
router.post("/:giftId/unpledge", auth, unpledgeGift);
router.post("/", auth, upload.single("image"), createGift);
router.get("/event/:eventId", auth, getGiftsByEvent);
router.put("/:id", auth, upload.single("image"), updateGift);
router.delete("/:id", auth, deleteGift);
export default router;
