import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const getUserInfo = async (req, res) => {
  try {
    // Hämta användaren baserat på det inloggade användarens id
    const user = await User.findById(req.user._id);

    console.log("User info endpoint hit");

    // Om användaren inte finns, skicka en 404-status
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ta bort lösenordet från användardata
    const { password, ...userWithoutPassword } = user.toObject();

    // Skicka användardata utan lösenordet som svar
    res.status(200).json({ user: userWithoutPassword });
    console.log("User info sent");
  } catch (error) {
    // Logga och skicka ett serverfel om något går fel
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    await user.save();

    const { password, ...updatedUser } = user.toObject();
    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
