import { NavLink } from "react-router-dom";
import {
  Leaf,
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  X,
} from "lucide-react";

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <aside className="w-64 h-full bg-white shadow-lg flex flex-col p-6">
      <div className="flex items-center justify-between mb-10 py-2 px-3">
        <div className="flex items-center gap-2 text-teal-600">
          <Leaf size={24} />
          <span className="text-xl font-bold">Arbor</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        )}
      </div>
      <nav className="flex flex-col gap-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 py-2 px-3 rounded-lg ${
              isActive
                ? "bg-teal-50 text-teal-600 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2 px-3 rounded-lg ${
              isActive
                ? "bg-teal-50 text-teal-600 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`
          }
        >
          <ArrowLeftRight size={20} />
          Transaktionen
        </NavLink>
        <NavLink
          to="/accounts"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2 px-3 rounded-lg ${
              isActive
                ? "bg-teal-50 text-teal-600 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`
          }
        >
          <Wallet size={20} />
          Konten
        </NavLink>
        <NavLink
          to="/budgets"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2 px-3 rounded-lg ${
              isActive
                ? "bg-teal-50 text-teal-600 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`
          }
        >
          <PiggyBank size={20} />
          Budgets
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;
