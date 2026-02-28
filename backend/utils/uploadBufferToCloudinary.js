// utils/cloudinaryUpload.js
import { v2 as cloudinary } from "cloudinary";

export const uploadBufferToCloudinary = (buffer, folder, publicId = undefined) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "auto", // ✅ pdf + image
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    stream.end(buffer);
  });