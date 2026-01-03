import express from "express";
import auth from "../middleware/authMiddleware.js";
import {
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest
} from "../controllers/friendController.js";

const router = express.Router();

router.post("/invite", auth, sendFriendRequest);
router.get("/requests", auth, getFriendRequests);
router.post("/accept/:requestId", auth, acceptFriendRequest);
router.post("/reject/:requestId", auth, rejectFriendRequest);

export default router;
