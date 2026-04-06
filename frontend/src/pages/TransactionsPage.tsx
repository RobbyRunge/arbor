import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getCurrentMonth } from "../utils/date";
import { fetchTransactions } from "../api/transactions";
import TransactionModal from "../components/transactions/TransactionModal";

function TransactionsPage() {
  const [month, setMonth] = useState(getCurrentMonth());
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ["transactions", { month, type, category, search }],
    queryFn: () => fetchTransactions({ month, type, category, search }),
  });

  return (
    <>
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transaktionen</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700"
        >
          + Neue Transaktion
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 bg-white/80 backdrop-blur rounded-2xl shadow p-5">
        <input
          type="text"
          placeholder="Suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">Alle</option>
          <option value="income">Einnahmen</option>
          <option value="expense">Ausgaben</option>
        </select>
      </div>

      {/* List */}
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-5">
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-sm">Keine Transaktionen gefunden.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: tx.category_detail?.color ?? "#94a3b8" }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {tx.description || tx.category_detail?.name || "Transaktion"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.date).toLocaleDateString("de-DE")} · {tx.account_detail.name}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${tx.type === "income" ? "text-teal-600" : "text-rose-500"}`}>
                  {tx.type === "income" ? "+" : "−"}
                  {new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(parseFloat(tx.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
    </>
  );
}    

export default TransactionsPage;
