// /backend/routes/upload.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Configure storage for multer
const createStorage = (uploadDir) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const fullUploadDir = path.resolve("..", "frontend", "public", uploadDir);

      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(fullUploadDir)) {
        fs.mkdirSync(fullUploadDir, { recursive: true });
      }

      cb(null, fullUploadDir);
    },
    filename: (req, file, cb) => {
      // Generate unique filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(
        null,
        file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
      );
    },
  });

// Audio file upload
const audioStorage = createStorage("uploads/audio");
const audioUpload = multer({
  storage: audioStorage,
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
  limits: { fileSize: 1000 * 1024 * 1024 }, // 1000 MB max file size
});

// Poster image upload
const posterStorage = createStorage("uploads/posters");
const posterUpload = multer({
  storage: posterStorage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Endast bildfiler är tillåtna"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max file size
});

// Audio file upload route
router.post("/audio", audioUpload.single("audioFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Ingen fil har laddats upp" });
  }

  res.json({
    filename: req.file.filename,
    path: `/uploads/audio/${req.file.filename}`,
  });
});

// Poster upload route
router.post("/poster", posterUpload.single("posterFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Ingen poster har laddats upp" });
  }

  res.json({
    filename: req.file.filename,
    path: `/uploads/posters/${req.file.filename}`,
  });
});

export default router;
