import axios from "axios";

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
