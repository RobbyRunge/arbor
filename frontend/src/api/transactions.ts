import api from "./axiosInstance";
import type { CategoryDetail } from "../types/types.ts";

export interface AccountDetail {
  id: number;
  name: string;
  type: string;
  balance: string;
  icon: string;
  color: string;
}

export interface Transaction {
  id: number;
  account: number;
  category: number | null;
  account_detail: AccountDetail;
  category_detail: CategoryDetail | null;
  amount: string;
  type: "income" | "expense";
  date: string;
  description: string;
}

export interface TransactionPayload {
  account: number;
  category: number | null;
  amount: string;
  type: "income" | "expense";
  date: string;
  description: string;
}

export async function createTransaction(
  payload: TransactionPayload,
): Promise<Transaction> {
  const { data } = await api.post("/api/transactions/", payload);
  return data;
}

export async function fetchTransactions(filters: {
  month: string;
  type: string;
  category: string;
  search: string;
}): Promise<Transaction[]> {
  const { data } = await api.get("/api/transactions/", { params: filters });
  return data;
}

export async function updateTransaction(
  id: number,
  payload: TransactionPayload,
): Promise<Transaction> {
  const { data } = await api.patch(`/api/transactions/${id}/`, payload);
  return data;
}

export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/api/transactions/${id}/`);
}
