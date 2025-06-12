import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (uploadDir) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const fullUploadDir = path.resolve("public", uploadDir);
      if (!fs.existsSync(fullUploadDir)) {
        fs.mkdirSync(fullUploadDir, { recursive: true });
      }
      cb(null, fullUploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });

export const audioUpload = multer({
  storage: createStorage("uploads/audio"),
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp3",
      "audio/m4a",
      "audio/mp4",
      "audio/flac",
      "audio/webm",
      "video/mp4",
      "audio/x-m4a",
    ];
    const allowedExtensions = [".m4a", ".mp4", ".mp3", ".wav", ".ogg", ".flac"];

    const isAllowedMimeType = allowedTypes.includes(file.mimetype);
    const isAllowedExtension = allowedExtensions.includes(
      path.extname(file.originalname).toLowerCase()
    );

    if (isAllowedMimeType || isAllowedExtension) {
      cb(null, true);
    } else {
      cb(new Error("Endast ljudfiler är tillåtna"), false);
    }
  },
  limits: { fileSize: 1000 * 1024 * 1024 }, // 1000 MB
});

export const posterUpload = multer({
  storage: createStorage("uploads/posters"),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Endast bildfiler är tillåtna"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});
