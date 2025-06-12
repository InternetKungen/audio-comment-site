import express from "express";
import fs from "fs";
import path from "path";

const streamRouter = express.Router();

streamRouter.get("/audio/:filename", (req, res) => {
  const audioPath = path.resolve("public/uploads/audio", req.params.filename);

  fs.stat(audioPath, (err, stats) => {
    if (err || !stats.isFile()) {
      return res.status(404).send("Audio file not found");
    }

    const range = req.headers.range;
    if (!range) {
      // Om ingen range ges, skicka hela filen
      res.writeHead(200, {
        "Content-Length": stats.size,
        "Content-Type": "audio/mpeg",
      });
      fs.createReadStream(audioPath).pipe(res);
      return;
    }

    // Ex: "bytes=0-"
    const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : stats.size - 1;
    const chunkSize = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stats.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "audio/mpeg",
    });

    fs.createReadStream(audioPath, { start, end }).pipe(res);
  });
});

export default streamRouter;
