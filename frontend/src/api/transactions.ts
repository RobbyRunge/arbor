import axios from "axios";

export interface CategoryDetail {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: string;
}

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

export async function fetchTransactions(filters: {
  month: string;
  type: string;
  category: string;
  search: string;
}): Promise<Transaction[]> {
  const { data } = await axios.get("/api/transactions/", {
    withCredentials: true,
    params: filters,
  });
  return data;
}
