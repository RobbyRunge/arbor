import { NavLink } from "react-router-dom";
import {
  Leaf,
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  PiggyBank,
  Settings,
  X,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useTransitionNavigate } from "../../context/TransitionContext";

function Sidebar({ onClose }: { onClose?: () => void }) {
  const logout = useAuthStore((s) => s.logout);
  const navigateWithTransition = useTransitionNavigate();

  const handleLogout = () => {
    navigateWithTransition("/login", logout);
  };

  return (
    <aside className="w-64 h-full bg-white shadow-lg flex flex-col p-6">
      <div className="flex items-center justify-between mb-10 py-2 px-3">
        <div className="flex items-center gap-2 text-teal-600">
          <Leaf size={24} />
          <span className="text-xl font-bold">Arbor</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>
      <nav className="flex flex-col gap-1">
        <NavLink
          onClick={onClose}
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
          onClick={onClose}
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
          onClick={onClose}
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
          onClick={onClose}
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
      <div className="mt-auto">
        <NavLink
          onClick={onClose}
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 py-2 px-3 rounded-lg ${
              isActive
                ? "bg-teal-50 text-teal-600 font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`
          }
        >
          <Settings size={20} />
          Einstellungen
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-2 px-3 rounded-lg w-full hover:bg-red-50 transition-colors group"
        >
          <LogOut size={20} className="text-red-500" />
          <span className="text-gray-500 group-hover:text-red-500 transition-colors">
            Abmelden
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
