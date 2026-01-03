import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.userId;

    const { email } = req.body;

    const receiver = await User.findOne({ email });
    if (!receiver)
      return res.status(404).json({ message: "User not found" });

    if (receiver._id.equals(senderId))
      return res.status(400).json({ message: "Cannot invite yourself" });

    const existing = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiver._id,
      status: "pending"
    });

    if (existing)
      return res.status(400).json({ message: "Request already sent" });

    const request = await FriendRequest.create({
      sender: senderId,
      receiver: receiver._id
    });

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getFriendRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      receiver: req.userId,
      status: "pending"
    }).populate("sender", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const acceptFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (!request.receiver.equals(req.userId))
      return res.status(403).json({ message: "Not authorized" });

    request.status = "accepted";
    await request.save();

    await User.findByIdAndUpdate(request.sender, {
      $addToSet: { friends: request.receiver }
    });

    await User.findByIdAndUpdate(request.receiver, {
      $addToSet: { friends: request.sender }
    });

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const rejectFriendRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.requestId);

    if (!request)
      return res.status(404).json({ message: "Request not found" });

    if (!request.receiver.equals(req.user.id))
      return res.status(403).json({ message: "Not authorized" });

    request.status = "rejected";
    await request.save();

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
