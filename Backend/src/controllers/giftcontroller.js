import Gift from "../models/Gift.js";
import Event from "../models/Event.js";
import User from "../models/User.js";

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

