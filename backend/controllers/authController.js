import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const userRegister = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "Användaren finns redan" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "user",
    });
    await newUser.save();
    const { password: _, ...userResponse } = newUser.toObject();
    res
      .status(201)
      .json({ message: "Användaren har skapats", user: userResponse });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Användaren finns inte" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Ogiltigt lösenord" });
    }
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET);
    if (!token) {
      return res.status(500).json({ error: "Misslyckades att skapa token" });
    }
    res.cookie("token", token, {
      httpOnly: false, // Prevents JavaScript access
      secure: false, // Set to true in production (over HTTPS)
      sameSite: "Lax", // CSRF protection
      maxAge: 3600000, // 1 hour
    });
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({
      message: "Användaren har loggats in",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const userLogout = (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Användaren har loggats ut" });
  } catch (error) {
    res.status(500).json({ error: `Server Error ${error.message}` });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Användaren finns inte" });
    }
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Ett nytt lösenord har skapats för ditt konto",
      text: `Ditt nya lösenord: ${newPassword}`,
    };
    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Ett nytt lösenord har skickats till e-post" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
