import api from "./axiosInstance";

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get("/api/categories/");
  return data;
}
