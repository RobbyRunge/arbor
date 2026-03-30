import axios from "axios";

export interface Account {
  id: number;
  name: string;
  type: string;
  balance: string;
  icon: string;
  color: string;
}

export async function fetchAccounts(): Promise<Account[]> {
  const { data } = await axios.get("/api/accounts/", { withCredentials: true });
  return data;
}
