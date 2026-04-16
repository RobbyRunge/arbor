import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

import { getCurrentMonth, getWeekKey, getWeekLabel } from "../utils/date";
import { fetchTransactions, deleteTransaction } from "../api/transactions";
import TransactionModal from "../components/transactions/TransactionModal";

function TransactionsPage() {
  const queryClient = useQueryClient();

  const [month, setMonth] = useState(getCurrentMonth());
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ["transactions", { month, type, category, search }],
    queryFn: () => fetchTransactions({ month, type, category, search }),
  });

  const groupedByWeek = useMemo(() => {
    const groups: Record<string, typeof transactions> = {};
    for (const tx of transactions) {
      const key = getWeekKey(tx.date);
      if (!groups[key]) groups[key] = [];
      groups[key].push(tx);
    }
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [transactions]);

  const mutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      setError("");
    },
    onError: () => {
      setError("Transaktion konnte nicht gelöscht werden.");
    },
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
        {error && <p className="text-sm text-rose-500">{error}</p>}

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
            <p className="text-gray-400 text-sm">
              Keine Transaktionen gefunden.
            </p>
          ) : (
            <div className="space-y-4">
              {groupedByWeek.map(([weekKey, txs]) => {
                const { kw, range } = getWeekLabel(weekKey);
                const weekExpenses = txs
                  .filter((tx) => tx.type === "expense")
                  .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
                const fmt = (amount: number) =>
                  new Intl.NumberFormat("de-DE", {
                    style: "currency",
                    currency: "EUR",
                  }).format(amount);

                return (
                  <div key={weekKey}>
                    {/* Week header */}
                    <div className="flex items-center justify-between px-1 py-1 mb-1">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        KW {kw}&nbsp;&nbsp;
                        <span className="font-normal normal-case tracking-normal text-gray-400">
                          {range}
                        </span>
                      </span>
                    </div>

                    {/* Transactions in this week */}
                    <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
                      {txs.map((tx) => (
                        <div
                          key={tx.id}
                          className="flex items-center justify-between px-3 py-3"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0"
                              style={{
                                backgroundColor:
                                  tx.category_detail?.color ?? "#94a3b8",
                              }}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {tx.description ||
                                  tx.category_detail?.name ||
                                  "Transaktion"}
                              </p>
                              <p className="text-xs text-gray-400">
                                {new Date(tx.date).toLocaleDateString("de-DE")}{" "}
                                · {tx.account_detail.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-sm font-semibold ${tx.type === "income" ? "text-teal-600" : "text-rose-500"}`}
                            >
                              {tx.type === "income" ? "+" : "−"}
                              {fmt(parseFloat(tx.amount))}
                            </span>

                            {confirmId === tx.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  className="text-xs text-rose-500 hover:text-rose-700 font-medium"
                                  disabled={mutation.isPending}
                                  onClick={() => mutation.mutate(tx.id)}
                                >
                                  Ja
                                </button>
                                <button
                                  className="text-xs text-gray-400 hover:text-gray-600"
                                  onClick={() => setConfirmId(null)}
                                >
                                  Nein
                                </button>
                              </div>
                            ) : (
                              <button
                                className="text-gray-400 hover:text-rose-500"
                                disabled={mutation.isPending}
                                onClick={() => setConfirmId(tx.id)}
                              >
                                <Trash2 size={20} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default TransactionsPage;
