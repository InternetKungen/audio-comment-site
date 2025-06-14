import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";

export const handleAudioUpload = async (req, res, next) => {
  console.log("[CHECKPOINT] handleAudioUpload startad");
  console.log(
    "📁 Fil mottagen:",
    req.file ? req.file.originalname : "INGEN FIL"
  );

  try {
    if (!req.file) {
      console.log("[CHECKPOINT] Ingen fil uppladdad");
      return res.status(400).json({ message: "Ingen fil uppladdad" });
    }

    console.log("[CHECKPOINT] Fil existerar:", {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    });

    const input = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    console.log("[CHECKPOINT] Fil-extension:", fileExt);

    // Om det redan är en .mp3, returnera direkt
    if (fileExt === ".mp3") {
      console.log("[CHECKPOINT] Fil är redan MP3, ingen konvertering behövs");

      const outputDir = path.resolve("public", "uploads", "audio");
      const output = path.join(outputDir, req.file.filename);

      console.log("[CHECKPOINT] Flyttar MP3-fil:", {
        from: input,
        to: output,
      });

      // Flytta filen till audio-mappen (om den inte redan hamnat där)
      fs.renameSync(input, output);

      console.log("[CHECKPOINT] MP3-fil sparad, skickar svar");
      return res.json({ filename: req.file.filename });
    }

    // Konvertering behövs
    console.log("[CHECKPOINT] Startar FFmpeg-konvertering");

    const outputFilename =
      path.basename(req.file.filename, path.extname(req.file.filename)) +
      ".mp3";

    const outputDir = path.resolve("public", "uploads", "audio");
    const output = path.join(outputDir, outputFilename);

    console.log("[CHECKPOINT] Konverteringsparametrar:", {
      input,
      output,
      outputFilename,
    });

    // Kontrollera WebSocket-anslutning
    const wss = req.app.get("wss");
    console.log("[CHECKPOINT] WebSocket status:", {
      exists: !!wss,
      clientCount: wss ? wss.clients.size : 0,
    });

    ffmpeg(input)
      .audioCodec("libmp3lame")
      .audioBitrate(128)
      .format("mp3")
      .on("start", (commandLine) => {
        console.log("[CHECKPOINT] FFmpeg startat:", commandLine);
      })
      .on("progress", (progress) => {
        console.log(
          "[CHECKPOINT] Progress:",
          Math.round(progress.percent) + "%"
        );

        if (wss && wss.clients) {
          const progressData = { progress: Math.round(progress.percent) };
          console.log(
            "[CHECKPOINT] Skickar WebSocket-meddelande:",
            progressData
          );

          wss.clients.forEach((client) => {
            if (client.readyState === 1) {
              try {
                client.send(JSON.stringify(progressData));
                console.log("Meddelande skickat till klient");
              } catch (wsError) {
                console.error("WebSocket send error:", wsError);
              }
            } else {
              console.log(
                "⚠️ Klient inte redo, readyState:",
                client.readyState
              );
            }
          });
        } else {
          console.log("[CHECKPOINT] Ingen WebSocket-server hittad");
        }
      })
      .on("end", () => {
        console.log("[CHECKPOINT] FFmpeg-konvertering klar");
        console.log("[CHECKPOINT] Tar bort originalfil:", input);

        try {
          fs.unlinkSync(input); // Ta bort originalfilen
          console.log("[CHECKPOINT] Originalfil borttagen");
        } catch (deleteError) {
          console.error(
            "[CHECKPOINT] Kunde inte ta bort originalfil:",
            deleteError
          );
        }

        console.log("[CHECKPOINT] Skickar slutligt svar:", {
          filename: outputFilename,
        });
        res.json({ filename: outputFilename });
      })
      .on("error", (err) => {
        console.error("[CHECKPOINT] FFmpeg-fel:", err);
        next(err);
      })
      .save(output);

    console.log("[CHECKPOINT] FFmpeg-process startad, väntar på resultat...");
  } catch (error) {
    console.error("[CHECKPOINT] Oväntat fel i handleAudioUpload:", error);
    next(error);
  }
};

export const handlePosterUpload = (req, res) => {
  console.log("[POSTER CHECKPOINT] handlePosterUpload startad");
  console.log("📁 Poster fil:", req.file ? req.file.originalname : "INGEN FIL");

  if (!req.file) {
    console.log("[POSTER CHECKPOINT] Ingen poster uppladdad");
    return res.status(400).json({ message: "Ingen poster har laddats upp" });
  }

  const response = {
    filename: req.file.filename,
    path: `/public/uploads/posters/${req.file.filename}`,
  };

  console.log("[POSTER CHECKPOINT] Poster sparad:", response);
  res.json(response);
};
