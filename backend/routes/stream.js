import express from "express";
import fs from "fs";
import path from "path";

const streamRouter = express.Router();

streamRouter.get("/audio/:filename", (req, res) => {
  const audioPath = path.resolve("public/uploads/audio", req.params.filename);

  // Kontrollera att filen existerar
  fs.stat(audioPath, (err, stats) => {
    if (err || !stats.isFile()) {
      console.error("Audio file not found:", audioPath);
      return res.status(404).send("Audio file not found");
    }

    const fileSize = stats.size;
    const range = req.headers.range;

    // Sätt alltid CORS-headers om behövs
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Range",
      "Access-Control-Expose-Headers": "Content-Range, Content-Length",
    });

    if (!range) {
      // Ingen range-header, skicka hela filen
      console.log("No range header, serving entire file");

      res.writeHead(200, {
        "Content-Length": fileSize,
        "Content-Type": "audio/mpeg",
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=3600", // Cache i 1 timme
      });

      const stream = fs.createReadStream(audioPath);
      stream.pipe(res);

      stream.on("error", (error) => {
        console.error("Stream error:", error);
        if (!res.headersSent) {
          res.status(500).send("Internal Server Error");
        }
      });

      return;
    }

    // Parsa range-header
    console.log("Range header received:", range);

    // Range format: "bytes=start-end"
    const rangeMatch = range.match(/bytes=(\d*)-(\d*)/);
    if (!rangeMatch) {
      console.error("Invalid range format:", range);
      return res.status(416).send("Range Not Satisfiable");
    }

    const startStr = rangeMatch[1];
    const endStr = rangeMatch[2];

    // Beräkna start och end
    const start = startStr ? parseInt(startStr, 10) : 0;
    const end = endStr ? parseInt(endStr, 10) : fileSize - 1;

    // Validera range
    if (start >= fileSize || end >= fileSize || start > end) {
      console.error("Invalid range:", { start, end, fileSize });
      return res
        .status(416)
        .set({
          "Content-Range": `bytes */${fileSize}`,
        })
        .send("Range Not Satisfiable");
    }

    const chunkSize = end - start + 1;

    console.log("Serving range:", { start, end, chunkSize, fileSize });

    // Sätt 206 Partial Content headers
    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=3600",
    });

    // Skapa stream med specificerad range
    const stream = fs.createReadStream(audioPath, { start, end });

    stream.on("error", (error) => {
      console.error("Range stream error:", error);
      if (!res.headersSent) {
        res.status(500).send("Internal Server Error");
      }
    });

    stream.on("open", () => {
      console.log("Stream opened successfully for range:", { start, end });
    });

    stream.pipe(res);
  });
});

// Lägg till en enkel endpoint för att testa att servern fungerar
streamRouter.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Audio streaming service is running" });
});

export default streamRouter;
