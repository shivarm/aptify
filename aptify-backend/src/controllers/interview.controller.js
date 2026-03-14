import { InterviewReport } from "../models/interviewReport.model.js";
import { generateInterviewReport } from "../services/ai.service.js";
import { PDFParse } from "pdf-parse";

export const generateInterviewReports = async (req, res) => {
  const resumeContent = await new PDFParse(Uint8Array.from(req.file.buffer)).getText();
  const { selfDescription, jobDescription } = req.body;

  const generateReport = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const report = await InterviewReport.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...generateReport,
  });

  res.status(201).json({ message: "Interview report generated successfully.", report });
};
