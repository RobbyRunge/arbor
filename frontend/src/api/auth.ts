import axios from "axios";

export async function loginUser(email: string, password: string) {
  const response = await axios.post("/api/auth/login/", { email, password });
  return response.data;
}
