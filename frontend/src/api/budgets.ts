import api from "./axiosInstance";
import type { CategoryDetail } from "../types/types.ts";

export interface Budget {
  id: number;
  category: number;
  amount: string;
  spent: string | number;
  month: number;
  year: number;
  notification_threshold: number;
  category_detail: CategoryDetail;
}

export interface BudgetPayload {
  amount: number;
  category: number;
  month: number;
  year: number;
  notification_threshold: number;
}

export async function fetchBudgets(): Promise<Budget[]> {
  const { data } = await api.get("/api/budgets/");
  return data;
}

export async function createBudget(payload: BudgetPayload): Promise<Budget> {
  const { data } = await api.post("/api/budgets/", payload);
  return data;
}

export async function updateBudget(
  id: number,
  payload: BudgetPayload,
): Promise<Budget> {
  const { data } = await api.patch(`/api/budgets/${id}/`, payload);
  return data;
}

export async function deleteBudget(id: number): Promise<void> {
  await api.delete(`/api/budgets/${id}/`);
}
