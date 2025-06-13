import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const handleAudioUpload = async (req, res, next) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Ingen fil uppladdad" });

    const input = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    // Om det redan är en .mp3, returnera direkt
    if (fileExt === ".mp3") {
      const outputDir = path.resolve("public", "uploads", "audio");
      const output = path.join(outputDir, req.file.filename);

      // Flytta filen till audio-mappen (om den inte redan hamnat där)
      fs.renameSync(input, output);

      return res.json({ filename: req.file.filename });
    }

    const outputFilename =
      path.basename(req.file.filename, path.extname(req.file.filename)) +
      ".mp3";

    const outputDir = path.resolve("public", "uploads", "audio");
    const output = path.join(outputDir, outputFilename);

    ffmpeg(input)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .format("mp3")
      .on("progress", (progress) => {
        req.app.get("wss").clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(
              JSON.stringify({ progress: Math.round(progress.percent) })
            );
          }
        });
      })
      .on("end", () => {
        fs.unlinkSync(input); // Ta bort originalfilen
        res.json({ filename: outputFilename });
      })
      .on("error", (err) => next(err))
      .save(output);
  } catch (error) {
    next(error);
  }
};

export const handlePosterUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Ingen poster har laddats upp" });
  }

  res.json({
    filename: req.file.filename,
    path: `/public/uploads/posters/${req.file.filename}`,
  });
};
