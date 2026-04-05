import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import { fetchAccounts } from "../api/accounts";
import { fetchTransactions } from "../api/transactions";
import { useAuthStore } from "../store/authStore";
import { getCurrentMonth, getMonthLabel } from "../utils/date";

const DONUT_COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#0ea5e9",
  "#84cc16",
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function StatCard({
  title,
  value,
  icon,
  color,
  sub,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const currentMonth = getCurrentMonth();

  const { data: accounts = [], isLoading: accountsLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: fetchTransactions,
  });

  const isLoading = accountsLoading || txLoading;

  const totalBalance = accounts.reduce(
    (sum, a) => sum + parseFloat(a.balance),
    0,
  );

  const currentMonthTx = transactions.filter((tx) =>
    tx.date.startsWith(currentMonth),
  );

  const monthlyIncome = currentMonthTx
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const monthlyExpenses = currentMonthTx
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);

  const monthlySaldo = monthlyIncome - monthlyExpenses;

  // Build daily data for bar chart
  const dailyMap = new Map<string, { einnahmen: number; ausgaben: number }>();
  for (const tx of currentMonthTx) {
    const day = tx.date.slice(8, 10);
    const entry = dailyMap.get(day) ?? { einnahmen: 0, ausgaben: 0 };
    if (tx.type === "income") entry.einnahmen += parseFloat(tx.amount);
    else entry.ausgaben += parseFloat(tx.amount);
    dailyMap.set(day, entry);
  }
  const dailyData = Array.from(dailyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, vals]) => ({ tag: `${day}.`, ...vals }));

  // Build category expense data for donut chart
  const categoryMap = new Map<string, number>();
  for (const tx of currentMonthTx.filter((tx) => tx.type === "expense")) {
    const name = tx.category_detail?.name ?? "Sonstige";
    categoryMap.set(name, (categoryMap.get(name) ?? 0) + parseFloat(tx.amount));
  }
  const donutData = Array.from(categoryMap.entries()).map(([name, value]) => ({
    name,
    value,
  }));

  // Last 5 transactions
  const recentTx = transactions.slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Wird geladen...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Guten Tag{user?.first_name ? `, ${user.first_name}` : ""}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Überblick für {getMonthLabel()}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Gesamtguthaben"
          value={formatCurrency(totalBalance)}
          icon={<Wallet size={20} className="text-blue-600" />}
          color="bg-blue-50"
          sub={`${accounts.length} Konto${accounts.length !== 1 ? "en" : ""}`}
        />
        <StatCard
          title="Einnahmen"
          value={formatCurrency(monthlyIncome)}
          icon={<TrendingUp size={20} className="text-teal-600" />}
          color="bg-teal-50"
        />
        <StatCard
          title="Ausgaben"
          value={formatCurrency(monthlyExpenses)}
          icon={<TrendingDown size={20} className="text-rose-600" />}
          color="bg-rose-50"
        />
        <StatCard
          title="Saldo"
          value={formatCurrency(monthlySaldo)}
          icon={
            monthlySaldo >= 0 ? (
              <ArrowUpRight size={20} className="text-teal-600" />
            ) : (
              <ArrowDownRight size={20} className="text-rose-600" />
            )
          }
          color={monthlySaldo >= 0 ? "bg-teal-50" : "bg-rose-50"}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-5">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
            Einnahmen &amp; Ausgaben
          </h2>
          {dailyData.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Keine Transaktionen diesen Monat.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={dailyData} barCategoryGap="30%">
                <XAxis dataKey="tag" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}€`} />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "einnahmen" ? "Einnahmen" : "Ausgaben",
                  ]}
                />
                <Bar
                  dataKey="einnahmen"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="einnahmen"
                />
                <Bar
                  dataKey="ausgaben"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  name="ausgaben"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Donut chart */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-5">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
            Ausgaben nach Kategorie
          </h2>
          {donutData.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Keine Ausgaben diesen Monat.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {donutData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend
                  formatter={(value) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent transactions */}
      <div className="bg-white/80 backdrop-blur rounded-2xl shadow p-5">
        <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-4">
          Letzte Transaktionen
        </h2>
        {recentTx.length === 0 ? (
          <p className="text-gray-400 text-sm">Noch keine Transaktionen.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentTx.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: tx.category_detail?.color ?? "#94a3b8",
                    }}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {tx.description ||
                        tx.category_detail?.name ||
                        "Transaktion"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.date).toLocaleDateString("de-DE")} ·{" "}
                      {tx.account_detail.name}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    tx.type === "income" ? "text-teal-600" : "text-rose-500"
                  }`}
                >
                  {tx.type === "income" ? "+" : "−"}
                  {formatCurrency(parseFloat(tx.amount))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
