import express from "express";
import {
  resetPassword,
  userLogin,
  userLogout,
  userRegister,
} from "../controllers/authController.js";

const authRouter = express.Router();

// register a new user
authRouter.post("/register", userRegister);

// login a user
authRouter.post("/login", userLogin);

// logout a user
authRouter.post("/logout", userLogout);

// reset password
authRouter.post("/reset-password", resetPassword);

export default authRouter;
