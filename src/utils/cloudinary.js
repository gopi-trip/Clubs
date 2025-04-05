// File: src/utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    
    // Upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto"
    });
    
    // File has been uploaded successfully
    fs.unlinkSync(localFilePath); // Remove the locally saved file
    return response;
  } catch (error) {
    // Remove the locally saved file as the upload operation failed
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };