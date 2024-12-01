import express from "express";
import { authUser } from "../middlewares/authUser.js";
import {
  getUserInfo,
  updateProfile,
  updatePassword,
} from "../controllers/userController.js";
const userRouter = express.Router();

//Authenticated routes----------------
//Profile routes-----------
userRouter.get("/info", authUser, getUserInfo);

//update profile
userRouter.post("/update-profile", authUser, updateProfile);

//update password
userRouter.post("/update-password", authUser, updatePassword);

export default userRouter;
