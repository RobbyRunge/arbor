import api from "./axiosInstance";

export interface Account {
  id: number;
  name: string;
  type: "checking" | "savings" | "cash" | "credit_card" | "investment";
  balance: string;
  icon: string;
  color: string;
}

export interface AccountPayload {
  name: string;
  type: Account["type"];
  icon: string;
  color: string;
  initial_balance?: string;
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await api.get("/api/accounts/");
  return data;
}

export async function createAccount(payload: AccountPayload): Promise<Account> {
  const { data } = await api.post("/api/accounts/", payload);
  return data;
}

export async function updateAccount(id: number, payload: Omit<AccountPayload, "initial_balance">): Promise<Account> {
  const { data } = await api.patch(`/api/accounts/${id}/`, payload);
  return data;
}

export async function deleteAccount(id: number): Promise<void> {
  await api.delete(`/api/accounts/${id}/`);
}
