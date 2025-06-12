import express from "express";
import {
  handleAudioUpload,
  handlePosterUpload,
} from "../controllers/uploadController.js";
import { audioUpload, posterUpload } from "../middlewares/multerConfig.js";
import { isAuthAdmin } from "../middlewares/isAuthAdmin.js";

const uploadRouter = express.Router();

uploadRouter.post(
  "/audio",
  isAuthAdmin,
  audioUpload.single("audioFile"),
  handleAudioUpload
);
uploadRouter.post(
  "/poster",
  posterUpload.single("posterFile"),
  isAuthAdmin,
  handlePosterUpload
);

export default uploadRouter;
