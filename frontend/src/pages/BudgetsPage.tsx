import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";

import { fetchBudgets, type Budget } from "../api/budgets";
import BudgetModal from "../components/budgets/BudgetModal";

function monthLabel(month: number, year: number): string {
  return new Date(year, month - 1, 1).toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
}

function BudgetsPage() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | undefined>();

  const { data: budgets = [] } = useQuery({
    queryKey: ["budgets"],
    queryFn: fetchBudgets,
  });

  const filtered = budgets.filter(
    (b) => b.month === selectedMonth && b.year === selectedYear,
  );

  function prevMonth() {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  }

  function openCreate() {
    setEditingBudget(undefined);
    setShowModal(true);
  }

  function openEdit(budget: Budget) {
    setEditingBudget(budget);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingBudget(undefined);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Budgets</h1>
        <button
          onClick={openCreate}
          className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700"
        >
          + Neues Budget
        </button>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center gap-3">
        <button
          onClick={prevMonth}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium text-gray-700 min-w-[160px] text-center">
          {monthLabel(selectedMonth, selectedYear)}
        </span>
        <button
          onClick={nextMonth}
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Budget Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          Keine Budgets für diesen Monat.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((budget) => {
            const spentNum = parseFloat(String(budget.spent));
            const amountNum = parseFloat(String(budget.amount));
            const pct = amountNum > 0 ? (spentNum / amountNum) * 100 : 0;
            const barWidth = Math.min(100, pct);
            const isOver = pct >= 100;
            const isWarning = !isOver && pct >= budget.notification_threshold;

            const barColor = isOver
              ? "bg-rose-500"
              : isWarning
                ? "bg-amber-400"
                : "bg-teal-500";

            const pctColor = isOver
              ? "text-rose-500"
              : isWarning
                ? "text-amber-500"
                : "text-gray-500";

            return (
              <div
                key={budget.id}
                onClick={() => openEdit(budget)}
                className="bg-white rounded-2xl shadow p-5 relative group cursor-pointer md:cursor-default transition-shadow hover:shadow-md"
              >
                {/* Edit icon — desktop only */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(budget);
                  }}
                  className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
                >
                  <Pencil size={15} />
                </button>

                {/* Category */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: budget.category_detail.color }}
                  />
                  <span className="font-semibold text-gray-800 text-sm">
                    {budget.category_detail.name}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all ${barColor}`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                {/* Amounts + percentage */}
                <div className="flex justify-between items-end">
                  <div className="min-w-0">
                    <span
                      className={`text-lg font-bold ${isOver ? "text-rose-500" : "text-gray-800"}`}
                    >
                      {spentNum.toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      €
                    </span>
                    <span className="text-xs text-gray-400 ml-1">
                      /{" "}
                      {amountNum.toLocaleString("de-DE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      €
                    </span>
                  </div>
                  <span
                    className={`text-sm font-medium flex-shrink-0 ml-2 ${pctColor}`}
                  >
                    {Math.round(pct)}%
                  </span>
                </div>

                {isOver && (
                  <p className="text-xs text-rose-500 mt-1">
                    Budget überschritten
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <BudgetModal
          budget={editingBudget}
          defaultMonth={selectedMonth}
          defaultYear={selectedYear}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default BudgetsPage;
