// utils/cloudinaryUpload.js
import { v2 as cloudinary } from "cloudinary";

export const uploadBufferToCloudinary = (buffer, folder, mimeType, publicId) =>
  new Promise((resolve, reject) => {
    const isPdf = mimeType === "application/pdf";

    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: isPdf ? "raw" : "image", // ✅ PDF -> raw, Image -> image
        format: isPdf ? "pdf" : undefined,
        // type: "upload", // default (public)
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );

    stream.end(buffer);
  });