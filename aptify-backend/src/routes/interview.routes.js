import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  generateInterviewReports,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  generateResumePdfController,
} from "../controllers/interview.controller.js";
import { apiLimit } from "../lib/rateLimit.js";

const router = Router();

/**
 * @routes POST /api/interview/report
 * @description generate interview report
 * @access private
 */

router.post("/report", apiLimit, authUser, upload.single("resume"), generateInterviewReports);

/**
 * @routes GET /api/interview/report/:interviewId
 * @description get interview report by id
 * @access private
 */

router.get("/report/:interviewId", authUser, getInterviewReportByIdController);

/**
 * @routes GET /api/interview/
 * @description get all interview reports of logged in user
 * @access private
 */

router.get("/", authUser, getAllInterviewReportsController);

/**
 * @routes POST /api/interview/resume/pdf/:interviewReportId
 * @description generate resume pdf based on interview report
 * @access private
 */

router.post("/resume/pdf/:interviewReportId", authUser, generateResumePdfController);

export default router;