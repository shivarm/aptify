import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.MODE === "development" ? `${API_BASE_URL}/api` : "/api",
  withCredentials: true,
});