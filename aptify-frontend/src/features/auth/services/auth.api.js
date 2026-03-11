import { apiClient } from "../../../lib/axios";

export const register = async ({ username, email, password }) => {
  const res = await apiClient.post("/auth/user/register", {
    username,
    email,
    password,
  });
  return res.data;
};

export const login = async ({ email, password }) => {
  const res = await apiClient.post("/auth/user/login", { email, password });
  return res.data;
};

export const logout = async () => {
  await apiClient.post("/auth/user/logout");
};

export const getMe = async () => {
  const res = await apiClient.get("/auth/user/me");
  return res.data;
};
