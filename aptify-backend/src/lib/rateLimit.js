import { rateLimit } from "express-rate-limit";

export const apiLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
});

export const authLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 20,
  message: "Too many attempts, please try again after 5 minutes.",
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
});
