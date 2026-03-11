import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { tokenBlacklistModel } from "../models/blacklist.model.js";

/**
 * @name register
 * @description register a new user, expects username, email, password
 * @access Public
 */

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 character" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (user) {
      return res.status(400).json({ message: "Account already exist with this email or username" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id, username: newUser.username }, ENV.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    await newUser.save();

    res.status(201).json({
      message: "User register successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @name login
 * @description login a user, expects email and password in the request body
 * @access Public
 */

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, ENV.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @name logout
 * @description clear token from user cookie and add the token in blacklist
 * @access Private
 */

export const logout = async (req, res) => {
  try {
    const token = req.cookies.jwt;

    if (token) {
      const isAlreadyBlacklisted = await tokenBlacklistModel.findOne({ token });

      if (!isAlreadyBlacklisted) {
        await tokenBlacklistModel.create({ token });
      }
    }

    res.clearCookie("jwt");

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

/**
 * @name getMe
 * @description get the current logged in user details.
 * @access Private
 */

export const getMe = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User details fetched successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};
