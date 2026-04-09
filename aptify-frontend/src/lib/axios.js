import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const apiClient = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${API_BASE_URL}/api` : "/api",
  withCredentials: true,
});