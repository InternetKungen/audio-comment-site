import Comment from "../models/Comment.js"; // Importera din kommentar-modell

// Hämta alla kommentarer för en specifik episod
export const getCommentsByEpisode = async (req, res) => {
  try {
    const comments = await Comment.find({ episodeId: req.params.id }).populate(
      "userId",
      "name"
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error });
  }
};

// Skapa en ny kommentar
export const createComment = async (req, res) => {
  try {
    const comment = new Comment({
      episodeId: req.params.id,
      userId: req.body.userId,
      text: req.body.text,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: "Failed to add comment", error });
  }
};

// Ta bort en specifik kommentar
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error });
  }
};
