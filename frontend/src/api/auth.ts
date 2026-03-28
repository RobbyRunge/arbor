import axios from "axios";

export async function loginUser(email: string, password: string) {
  const response = await axios.post("/api/auth/login/", { email, password });
  return response.data;
}

export async function registerUser(data: {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}) {
  const response = await axios.post("/api/auth/register/", data);
  return response.data;
}
