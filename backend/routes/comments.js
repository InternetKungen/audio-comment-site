import express from "express";
import { authUser } from "../middlewares/authUser.js";
import {
  getCommentsByEpisode,
  createComment,
  deleteComment,
} from "../controllers/commentsController.js";

const commentsRouter = express.Router();

// Hämta kommentarer för en episod
commentsRouter.get("/:id", getCommentsByEpisode);

// Skapa en kommentar för en episod
commentsRouter.post("/:id", authUser, createComment);

// Ta bort en kommentar
commentsRouter.delete("/:commentId", authUser, deleteComment);

export default commentsRouter;
