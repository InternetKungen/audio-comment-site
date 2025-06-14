import Episode from "../models/Episode.js";
import fs from "fs";
import path from "path";

const buildUrls = (episode) => {
  const base = "/api";
  return {
    ...episode.toObject(),
    audioUrl: `${base}/stream/audio/${episode.audioFile}`,
    downloadUrl: `${base}/download/audio/${episode.audioFile}`,
  };
};

export const getAllEpisodes = async (req, res) => {
  try {
    const episodes = await Episode.find();
    const episodesWithUrls = episodes.map(buildUrls);
    res.json(episodesWithUrls);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch episodes", error });
  }
};

export const getEpisodeById = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }
    res.json(buildUrls(episode));
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch episode", error });
  }
};

export const createEpisode = async (req, res) => {
  try {
    const episode = new Episode(req.body);
    await episode.save();
    res.status(201).json(episode);
  } catch (error) {
    res.status(400).json({ message: "Failed to create episode", error });
  }
};

export const updateEpisode = async (req, res) => {
  try {
    const updatedEpisode = await Episode.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEpisode) {
      return res.status(404).json({ message: "Episode not found" });
    }
    res.json(updatedEpisode);
  } catch (error) {
    res.status(400).json({ message: "Failed to update episode", error });
  }
};

export const deleteEpisode = async (req, res) => {
  try {
    const episode = await Episode.findByIdAndDelete(req.params.id);
    if (!episode) {
      return res.status(404).json({ message: "Episode not found" });
    }

    // Ta bort ljudfilen
    if (episode.audioFile) {
      const audioPath = path.resolve("public/uploads/audio", episode.audioFile);
      fs.unlink(audioPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete audio file:", err);
        }
      });
    }

    // Ta bort postern (ta bort första / om den finns)
    if (episode.poster) {
      const normalizedPosterPath = episode.poster.startsWith("/")
        ? episode.poster.slice(1)
        : episode.poster;
      const posterPath = path.resolve(normalizedPosterPath);

      fs.unlink(posterPath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete poster file:", err);
        }
      });
    }

    res.json({ message: "Episode, audio file and poster deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete episode", error });
  }
};
