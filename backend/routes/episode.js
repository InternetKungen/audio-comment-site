import express from "express";
import {
  getAllEpisodes,
  getEpisodeById,
  createEpisode,
  updateEpisode,
  deleteEpisode,
} from "../controllers/episodeController.js";
import { authUser } from "../middlewares/authUser.js";
import { isAuthAdmin } from "../middlewares/isAuthAdmin.js";

const episodeRouter = express.Router();

// Get all episodes
episodeRouter.get("/", getAllEpisodes);

// Get a specific episode by ID
episodeRouter.get("/:id", getEpisodeById);

// Create a new episode
episodeRouter.post("/", authUser, isAuthAdmin, createEpisode);

// Update an episode
episodeRouter.put("/:id", authUser, isAuthAdmin, updateEpisode);

// Delete an episode
episodeRouter.delete("/:id", authUser, isAuthAdmin, deleteEpisode);

export default episodeRouter;
