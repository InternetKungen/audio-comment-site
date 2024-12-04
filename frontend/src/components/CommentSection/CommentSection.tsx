import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext";
import { formatDistanceToNow } from "date-fns";
import "./CommentSection.scss";

interface Comment {
  _id: string;
  episodeId: string;
  userId: {
    _id: string;
    firstName?: string;
    lastName?: string;
  };
  text: string;
  timestamp: string;
}

interface CommentSectionProps {
  episodeId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ episodeId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useContext(UserContext);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/${episodeId}`);
      if (!response.ok) throw new Error("Failed to fetch comments");
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [episodeId]);

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    try {
      const response = await fetch(`/api/comments/${episodeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
          text: newComment.trim(),
        }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      // Refresh comments and clear input
      await fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      // Refresh comments
      await fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (!user) {
    return (
      <div className="comment-section">
        <div className="comment-header">
          <h2>Comments</h2>
        </div>
        <div className="comment-content">
          <p className="login-prompt">
            Please log in to view and post comments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="comment-section">
      <div className="comment-header">
        <h2>Comments ({comments.length})</h2>
      </div>
      <div className="comment-content">
        {/* Comment Input */}
        <div className="comment-input-container">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-textarea"
          />
          <button
            className="comment-submit-btn"
            onClick={handleSubmitComment}
            disabled={!newComment.trim()}
          >
            Post Comment
          </button>
        </div>

        {/* Comments List */}
        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="comment-item">
                <div className="comment-header-row">
                  <div className="comment-user">
                    {comment.userId.firstName} {comment.userId.lastName}
                  </div>
                  {(user.role === "admin" ||
                    user._id === comment.userId._id) && (
                    <button
                      className="comment-delete-btn"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-timestamp">
                  {formatDistanceToNow(new Date(comment.timestamp), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
