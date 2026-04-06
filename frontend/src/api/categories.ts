import axios from "axios";

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense";
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await axios.get("/api/categories/", {
    withCredentials: true,
  });
  return data;
}
