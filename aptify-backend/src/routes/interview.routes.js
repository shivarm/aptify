import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { generateInterviewReports } from "../controllers/interview.controller.js";
import { apiLimit } from "../lib/rateLimit.js";

const router = Router();

/**
 * @routes POST /api/interview/report
 * @description generate interview report
 * @access private
 */

router.post("/report", apiLimit, authUser, upload.single("resume"), generateInterviewReports);

export default router;