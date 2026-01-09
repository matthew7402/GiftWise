// backend/src/index.js
import "./env.js";

console.log("ENV LOADED IN INDEX");

import authroutes from "./routes/authroutes.js";
import friendroutes from "./routes/friendroutes.js";
import eventRoutes from "./routes/eventroutes.js";
//import upload from '../middleware/upload.js';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import giftRoutes from "./routes/giftroutes.js";

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/gifts", giftRoutes);
app.use("/api/friends", friendroutes);
app.use("/api/events", eventRoutes);



// Middleware
app.use("/api/auth", authroutes);

// Basic test route
app.get('/', (req, res) => res.send('GiftWise backend running 🚀'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
