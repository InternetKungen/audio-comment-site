import User from "../models/User.js";
import jwt from "jsonwebtoken";
// This middleware is similar to the authUser middleware, but it checks if the user is an admin.
// If the user is not an admin, it returns an error response.
// If the user is an admin, it calls the next middleware.
export const isAuthAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
    console.log(decoded);
    const user = await User.findOne({ email: decoded.email }).select(
      "-password"
    );
    if (!user) {
      return res.status(401).json({ error: "Unauthorized: User not found" });
    }
    if (user.role !== "admin") {
      return res
        .status(401)
        .json({ error: "Unauthorized: User is not an admin" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: "Server error from isAdmin" });
  }
};
