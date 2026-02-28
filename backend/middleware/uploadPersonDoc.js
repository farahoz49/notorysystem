// middlewares/uploadPersonDoc.js
import multer from "multer";

const storage = multer.memoryStorage();

const allowedMime = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/bmp",
]);

const fileFilter = (req, file, cb) => {
  if (allowedMime.has(file.mimetype)) return cb(null, true);
  cb(new Error("Only PDF or Image files are allowed"), false);
};

export const uploadPersonDoc = multer({
  storage,
  fileFilter,
  limits: {
    files: 1, // ✅ hal file kaliya
    fileSize: 10 * 1024 * 1024, // 10MB (haddii aad rabto beddel)
  },
});