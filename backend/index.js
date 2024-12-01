import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.js";
import episodeRouter from "./routes/episode.js";
import userRouter from "./routes/user.js";
import http from "http";
import path from "path";

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/episode", episodeRouter);
app.use("/api/user", userRouter);

// Servera statiska filer från dist-mappen
const distPath = path.resolve("..", "frontend", "dist");
app.use(express.static(distPath));

// Serve index.html på icke-API-vägar för att stödja SPA-routning
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Skapa HTTP-server och Socket.io-server
const server = http.createServer(app);

// Starta servern
server.listen(process.env.PORT, async () => {
  try {
    connectDB();
    console.log("Server started at", process.env.PORT);

  } catch (error) {
    console.error("Server failed to start");
    process.exit(1);
  }
});
