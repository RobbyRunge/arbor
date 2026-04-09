import api from "./axiosInstance";

export interface Account {
  id: number;
  name: string;
  type: string;
  balance: string;
  icon: string;
  color: string;
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await api.get("/api/accounts/");
  return data;
}
