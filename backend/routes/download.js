// backend/routes/downloadRouter.ts
import express from "express";
import path from "path";
import fs from "fs";

const downloadRouter = express.Router();

downloadRouter.get("/audio/:filename", (req, res) => {
  const filePath = path.resolve("public/uploads/audio", req.params.filename);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send("File not found");
    }

    res.download(filePath, req.params.filename); // ← Viktig skillnad
  });
});

export default downloadRouter;
