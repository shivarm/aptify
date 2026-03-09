import { Router } from "express";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/user/register
 * @description Register a new user
 * @access Public
 */

router.post("/user/register", register);
router.post("/user/login", login);
router.post("/user/logout", logout);
router.get("/user/me", authUser, getMe);

export default router;
