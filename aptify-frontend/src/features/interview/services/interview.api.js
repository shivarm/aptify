import { apiClient } from "../../../lib/axios";

export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile }) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);

  const response = await apiClient.post("/interview/report", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getInterviewReportById = async (interviewId) => {
  const response = await apiClient.get(`/interview/report/${interviewId}`);

  return response.data;
};

export const getAllInterviewReports = async () => {
  const response = await apiClient.get("/interview/");

  return response.data;
};

export const generateResumePdf = async ({ interviewReportId }) => {
  const response = await apiClient.post(`/interview/resume/pdf/${interviewReportId}`, null, {
    responseType: "blob",
  });

  return response.data;
};
