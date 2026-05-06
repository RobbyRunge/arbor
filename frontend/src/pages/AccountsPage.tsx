import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Landmark,
  PiggyBank,
  Banknote,
  CreditCard,
  TrendingUp,
  Pencil,
} from "lucide-react";

import type { Account } from "../api/accounts";
import { fetchAccounts } from "../api/accounts";
import AccountModal from "../components/accounts/AccountModal";

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
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>(
    undefined,
  );

  const { data: accounts } = useQuery({
    queryKey: ["accounts"],
    queryFn: fetchAccounts,
  });

  function openCreate() {
    setEditingAccount(undefined);
    setShowModal(true);
  }

  function openEdit(account: Account) {
    setEditingAccount(account);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingAccount(undefined);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Konten</h1>
        <button
          onClick={openCreate}
          className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700"
        >
          + Neues Konto
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts?.map((account) => {
          const Icon = iconMap[account.type];
          return (
            <div
              key={account.id}
              onClick={() => openEdit(account)}
              className="bg-white rounded-2xl shadow p-6 relative group cursor-pointer md:cursor-default transition-shadow hover:shadow-md"
            >
              {/* Edit button (desktop only) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(account);
                }}
                className="absolute top-4 right-4 text-gray-300 hover:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
              >
                <Pencil size={15} />
              </button>

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

      {/* Modal */}
      {showModal && (
        <AccountModal account={editingAccount} onClose={closeModal} />
      )}
    </div>
  );
}

export default AccountsPage;
