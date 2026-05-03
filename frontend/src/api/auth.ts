import axios from "axios";
import axiosInstance from "./axiosInstance";

export async function loginUser(email: string, password: string) {
  const response = await axios.post(
    "/api/auth/login/",
    { email, password },
    {
      withCredentials: true,
    },
  );
  return response.data;
}

export async function registerUser(data: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}) {
  const response = await axios.post("/api/auth/register/", data, {
    withCredentials: true,
  });
  return response.data;
}

export async function updateProfile(data: {
  first_name: string;
  last_name: string;
}) {
  const response = await axiosInstance.patch("/api/auth/me/", data);
  return response.data;
}

export async function changePassword(data: {
  current_password: string;
  new_password: string;
  new_password_confirm: string;
}) {
  const response = await axiosInstance.post("/api/auth/change-password/", data);
  return response.data;
}

export async function requestPasswordReset(email: string) {
  const response = await axios.post("/api/auth/password-reset/", { email });
  return response.data;
}

export async function confirmPasswordReset(data: {
  uidb64: string;
  token: string;
  new_password: string;
  new_password_confirm: string;
}) {
  const response = await axios.post("/api/auth/password-reset/confirm/", data);
  return response.data;
}
