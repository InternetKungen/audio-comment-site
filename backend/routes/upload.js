import express from "express";
import {
  handleAudioUpload,
  handlePosterUpload,
} from "../controllers/uploadController.js";
import { audioUpload, posterUpload } from "../middlewares/multerConfig.js";
import { authUser } from "../middlewares/authUser.js";
import { isAuthAdmin } from "../middlewares/isAuthAdmin.js";

const uploadRouter = express.Router();

uploadRouter.post(
  "/audio",
  authUser, // Ensure the user is authenticated
  isAuthAdmin,
  audioUpload.single("audioFile"),
  handleAudioUpload
);
uploadRouter.post(
  "/poster",
  authUser, // Ensure the user is authenticated
  isAuthAdmin,
  posterUpload.single("posterFile"),
  handlePosterUpload
);

export default uploadRouter;
