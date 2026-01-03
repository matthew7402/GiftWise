import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String , required: true },
    description: String,
    date: Date,
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
