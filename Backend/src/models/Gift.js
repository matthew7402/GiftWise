import mongoose from "mongoose";

const giftSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    imagePublicId: String,
    imageUrl: String,
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true
    },
    pledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
    
  },
  { timestamps: true }
);

export default mongoose.model("Gift", giftSchema);
