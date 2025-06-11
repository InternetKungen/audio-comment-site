import Comment from "../models/Comment.js"; // Importera din kommentar-modell

// Hämta alla kommentarer för en specifik episod
export const getCommentsByEpisode = async (req, res) => {
  try {
    const episodeId = req.params.id; // Episodens ID från URL:en

    const comments = await Comment.find({ episodeId }).populate(
      "userId",
      "firstName lastName"
    );
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments", error });
  }
};

// Skapa en ny kommentar
export const createComment = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const episodeId = req.params.id; // Hämtar episod-ID från URL:en

    // Validering (frivilligt)
    if (!text || !episodeId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const comment = new Comment({
      episodeId,
      userId,
      text,
    });

    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create comment", error });
  }
};

// Ta bort en specifik kommentar
export const deleteComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json({ message: "Comment deleted", deletedComment });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment", error });
  }
};
