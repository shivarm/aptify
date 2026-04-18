import mongoose from "mongoose";
import { InterviewReport } from "../models/interviewReport.model.js";
import { generateInterviewReport, generateResumePdf } from "../services/ai.service.js";
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

/**
 * @description Controller to get interview report by interviewId.
 */
export const getInterviewReportByIdController = async (req, res) => {
  const { interviewId } = req.params;

  // Validate interviewId
  if (!mongoose.Types.ObjectId.isValid(interviewId)) {
    return res.status(400).json({
      message: "Invalid interview report ID.",
    });
  }

  const interviewReport = await InterviewReport.findOne({ _id: interviewId, user: req.user.id });

  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found.",
    });
  }

  res.status(200).json({
    message: "Interview report fetched successfully.",
    interviewReport,
  });
};


/** 
 * @description Controller to get all interview reports of logged in user.
 */
export const getAllInterviewReportsController = async (req, res) => {
    const interviewReports = await InterviewReport.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}


/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
export const generateResumePdfController = async (req, res) => {
    const { interviewReportId } = req.params

    console.log("generateResumePdfController called with ID:", interviewReportId);

      if (!mongoose.Types.ObjectId.isValid(interviewReportId)) {
        return res.status(400).json({
          message: "Invalid interview report ID.",
        });
      }

    const interviewReport = await InterviewReport.findById(interviewReportId)

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
}