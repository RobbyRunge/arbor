import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";

import { fetchAccounts } from "../../api/accounts";
import { fetchCategories } from "../../api/categories";
import {
  createTransaction,
  updateTransaction,
  type Transaction,
} from "../../api/transactions";

interface Props {
  onClose: () => void;
  transaction?: Transaction;
}

const today = () => new Date().toISOString().split("T")[0];

function TransactionModal({ onClose, transaction }: Props) {
  const queryClient = useQueryClient();
  const isEdit = transaction !== undefined;

  const [type, setType] = useState<"expense" | "income">(
    transaction?.type ?? "expense",
  );
  const [amount, setAmount] = useState(
    transaction
      ? parseFloat(transaction.amount).toFixed(2).replace(".", ",")
      : "",
  );
  const [date, setDate] = useState(transaction?.date ?? today());
  const [accountId, setAccountId] = useState<string>(
    transaction ? String(transaction.account) : "",
  );
  const [categoryId, setCategoryId] = useState<string>(
    transaction?.category ? String(transaction.category) : "",
  );
  const [description, setDescription] = useState(
    transaction?.description ?? "",
  );
  const [error, setError] = useState("");

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const filteredCategories = categories.filter((c) => c.type === type);

  const mutation = useMutation({
    mutationFn: (payload: Parameters<typeof createTransaction>[0]) =>
      isEdit
        ? updateTransaction(transaction!.id, payload)
        : createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      onClose();
    },
    onError: () => {
      setError("Fehler beim Speichern. Bitte prüfe deine Eingaben.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Bitte einen gültigen Betrag eingeben.");
      return;
    }
    if (!accountId) {
      setError("Bitte ein Konto auswählen.");
      return;
    }

    mutation.mutate({
      type,
      amount: parsedAmount.toFixed(2),
      date,
      account: parseInt(accountId),
      category: categoryId ? parseInt(categoryId) : null,
      description,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? "Transaktion bearbeiten" : "Neue Transaktion"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-xl overflow-hidden border border-gray-200">
            <button
              type="button"
              onClick={() => {
                setType("expense");
                setCategoryId("");
              }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                type === "expense"
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              Ausgabe
            </button>
            <button
              type="button"
              onClick={() => {
                setType("income");
                setCategoryId("");
              }}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                type === "income"
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              Einnahme
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Betrag (€)
            </label>
            <input
              type="text"
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Datum
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Account */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Konto
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Konto wählen…</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Kategorie
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Keine Kategorie</option>
              {filteredCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Beschreibung
            </label>
            <input
              type="text"
              placeholder="Optional…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-teal-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-teal-700 disabled:opacity-60"
            >
              {mutation.isPending
                ? "Speichern…"
                : isEdit
                  ? "Änderungen speichern"
                  : "Speichern"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionModal;
