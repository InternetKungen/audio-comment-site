import express from "express";
import {
  getAllEpisodes,
  createEpisode,
  updateEpisode,
  deleteEpisode,
} from "../controllers/episodeController.js";

const episodeRouter = express.Router();

// Get all episodes
episodeRouter.get("/", getAllEpisodes);

// Create a new episode
episodeRouter.post("/", createEpisode);

// Update an episode
episodeRouter.put("/:id", updateEpisode);

// Delete an episode
episodeRouter.delete("/:id", deleteEpisode);

export default episodeRouter;
