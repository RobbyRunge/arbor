import { useQuery } from "@tanstack/react-query";
import {
  Landmark,
  PiggyBank,
  Banknote,
  CreditCard,
  TrendingUp,
} from "lucide-react";

import { fetchAccounts } from "../api/accounts";

const iconMap = {
  checking: Landmark,
  savings: PiggyBank,
  cash: Banknote,
  credit_card: CreditCard,
  investment: TrendingUp,
};

const typeLabels: Record<string, string> = {
  checking: "Girokonto",
  savings: "Sparkonto",
  cash: "Bargeld",
  credit_card: "Kreditkarte",
  investment: "Investment",
};

function AccountsPage() {
  const { data: accounts, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Konten</h1>
        <button
          onClick={() => {}}
          className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700"
        >
          + Neues Konto
        </button>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts?.map((account) => {
          const Icon = iconMap[account.type];
          return (
            <div key={account.id} className="bg-white rounded-2xl shadow p-6">
              <div
                style={{ backgroundColor: account.color }}
                className="p-3 rounded-xl flex-shrink-0 flex items-center justify-center w-fit"
              >
                <Icon size={20} color="white" />
              </div>
              <div className="mt-4 font-semibold text-gray-800">
                {account.name}
              </div>
              <div
                className={`text-xl font-bold ${
                  parseFloat(account.balance) < 0
                    ? "text-rose-500"
                    : parseFloat(account.balance) > 0
                      ? "text-emerald-600"
                      : "text-gray-900"
                }`}
              >
                {account.balance}
              </div>
              <div className="text-xs text-gray-400">
                {typeLabels[account.type]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AccountsPage;
