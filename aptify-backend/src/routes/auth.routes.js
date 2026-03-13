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

/**
 * @route POST /api/auth/user/login
 * @description Login user
 * @access Public
 */
router.post("/user/login", login);

/**
 * @route POST /api/auth/user/logout
 * @description Logout user
 * @access Public
 */
router.post("/user/logout", logout);

/**
 * @route GET /api/auth/user/me
 * @description Return authenticated user
 * @access Public
 */
router.get("/user/me", authUser, getMe);

export default router;
