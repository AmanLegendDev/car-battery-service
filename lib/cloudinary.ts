import "server-only";

import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName) {
  throw new Error("Missing CLOUDINARY_CLOUD_NAME environment variable");
}

if (!apiKey) {
  throw new Error("Missing CLOUDINARY_API_KEY environment variable");
}

if (!apiSecret) {
  throw new Error("Missing CLOUDINARY_API_SECRET environment variable");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;