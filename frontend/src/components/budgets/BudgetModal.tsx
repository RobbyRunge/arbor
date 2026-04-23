import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Trash2 } from "lucide-react";

import { fetchCategories } from "../../api/categories";
import {
  createBudget,
  updateBudget,
  deleteBudget,
  type Budget,
} from "../../api/budgets";

interface Props {
  onClose: () => void;
  budget?: Budget;
  defaultMonth: number;
  defaultYear: number;
}

function BudgetModal({ onClose, budget, defaultMonth, defaultYear }: Props) {
  const queryClient = useQueryClient();
  const isEdit = budget !== undefined;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [categoryId, setCategoryId] = useState(
    budget ? String(budget.category) : "",
  );
  const [amount, setAmount] = useState(
    budget ? parseFloat(String(budget.amount)).toFixed(2).replace(".", ",") : "",
  );
  const [threshold, setThreshold] = useState(
    budget ? budget.notification_threshold : 80,
  );
  const [error, setError] = useState("");

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const expenseCategories = categories.filter((c) => c.type === "expense");

  const saveMutation = useMutation({
    mutationFn: (payload: Parameters<typeof createBudget>[0]) =>
      isEdit ? updateBudget(budget!.id, payload) : createBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      onClose();
    },
    onError: () => setError("Fehler beim Speichern. Bitte prüfe deine Eingaben."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteBudget(budget!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets"] });
      onClose();
    },
    onError: () => setError("Budget konnte nicht gelöscht werden."),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const parsedAmount = parseFloat(amount.replace(",", "."));
    if (!categoryId) {
      setError("Bitte eine Kategorie wählen.");
      return;
    }
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Bitte einen gültigen Betrag eingeben.");
      return;
    }
    saveMutation.mutate({
      category: parseInt(categoryId),
      amount: parsedAmount,
      month: isEdit ? budget!.month : defaultMonth,
      year: isEdit ? budget!.year : defaultYear,
      notification_threshold: threshold,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? "Budget bearbeiten" : "Neues Budget"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Kategorie
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isEdit}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">Kategorie wählen…</option>
              {expenseCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Budget (€)
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

          {/* Period — read-only in edit mode */}
          {isEdit && (
            <p className="text-xs text-gray-400">
              Zeitraum:{" "}
              {new Date(budget!.year, budget!.month - 1, 1).toLocaleDateString(
                "de-DE",
                { month: "long", year: "numeric" },
              )}{" "}
              (nicht änderbar)
            </p>
          )}

          {/* Threshold */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Benachrichtigung bei {threshold}%
            </label>
            <input
              type="range"
              min={1}
              max={100}
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value))}
              className="w-full accent-teal-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
              <span>1%</span>
              <span>100%</span>
            </div>
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
              disabled={saveMutation.isPending}
              className="flex-1 bg-teal-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-teal-700 disabled:opacity-60"
            >
              {saveMutation.isPending
                ? "Speichern…"
                : isEdit
                  ? "Änderungen speichern"
                  : "Speichern"}
            </button>
          </div>

          {/* Delete — edit mode only */}
          {isEdit && (
            <div className="pt-1 border-t border-gray-100">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 text-rose-500 text-sm hover:text-rose-700 mt-3"
                >
                  <Trash2 size={15} />
                  Budget löschen
                </button>
              ) : (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sicher löschen?</span>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    className="text-sm text-white bg-rose-500 px-3 py-1 rounded-lg hover:bg-rose-600 disabled:opacity-60"
                  >
                    Ja, löschen
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Abbrechen
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default BudgetModal;
