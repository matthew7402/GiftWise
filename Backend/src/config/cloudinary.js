import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
//import dotenv from "../dotenv";
import "../env.js";

console.log("CLOUDINARY FILE LOADED");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "giftwise/gifts",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});
console.log("Cloudinary key:", process.env.CLOUDINARY_API_KEY);
export { cloudinary, storage };
