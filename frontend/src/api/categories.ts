import api from "./axiosInstance";

export interface Category {
  id: number;
  name: string;
  color: string;
  type: "income" | "expense";
}

export interface CategoryPayload {
  name: string;
  color: string;
  type: "income" | "expense";
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await api.get("/api/categories/");
  return data;
}

export async function createCategory(
  payload: CategoryPayload,
): Promise<Category> {
  const { data } = await api.post("/api/categories/", payload);
  return data;
}

export async function updateCategory(
  id: number,
  payload: CategoryPayload,
): Promise<Category> {
  const { data } = await api.patch(`/api/categories/${id}/`, payload);
  return data;
}

export async function deleteCategory(id: number): Promise<void> {
  await api.delete(`/api/categories/${id}/`);
}
