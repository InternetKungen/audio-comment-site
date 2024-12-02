import Episode from "../models/Episode.js";

export const getAllEpisodes = async (req, res) => {
  try {
    const episodes = await Episode.find();
    res.json(episodes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch episodes", error });
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
    const deletedEpisode = await Episode.findByIdAndDelete(req.params.id);
    if (!deletedEpisode) {
      return res.status(404).json({ message: "Episode not found" });
    }
    res.json({ message: "Episode deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete episode", error });
  }
};
