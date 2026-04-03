import express from "express";
//import Event from "../models/Event.js";
import auth from "../middleware/authMiddleware.js";


import {
  createEvent,
  getUserEvents,
  getFeedEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from "../controllers/eventcontroller.js";

const router = express.Router();

router.post("/", auth, createEvent);
router.get("/", auth, getUserEvents);
router.get("/feed", auth, getFeedEvents);
router.get("/:id", auth, getEventById);
router.put("/:id", auth, updateEvent);
router.delete("/:id", auth, deleteEvent);

export default router;