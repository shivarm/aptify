import jwt from "jsonwebtoken";
import { tokenBlacklistModel } from "../models/blacklist.model.js";
import { ENV } from "../config/env.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({
      message: "Token not provided.",
    });
  }
  const isTokenBlacklisted = await tokenBlacklistModel.findOne({
    token,
  });

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "token is invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
};
