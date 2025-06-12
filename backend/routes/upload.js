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
  isAuthAdmin,
  posterUpload.single("posterFile"),
  handlePosterUpload
);

export default uploadRouter;
