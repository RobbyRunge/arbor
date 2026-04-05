import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCurrentMonth } from "../utils/date";
import { fetchTransactions } from "../api/transactions";

function TransactionsPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ["transactions", { month, type, category, search }],
    queryFn: () => fetchTransactions({ month, type, category, search }),
  });

  return (
    <div>
      <h1>Transaktionen</h1>
    </div>
  );
}

export default TransactionsPage;
