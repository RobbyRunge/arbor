import { useNavigate } from "react-router-dom";
import { User, Tag, Bell } from "lucide-react";

const sections = [
  {
    to: "/settings/profile",
    icon: User,
    color: "#0d9488", // teal-600
    title: "Profil",
    description: "Name und Passwort",
  },
  {
    to: "/settings/categories",
    icon: Tag,
    color: "#6366f1", // indigo
    title: "Kategorien",
    description: "Eigene Kategorien verwalten",
  },
  {
    to: "/settings/notifications",
    icon: Bell,
    color: "#f59e0b", // amber
    title: "Benachrichtigungen",
    description: "Budget-Warnungen & Hinweise",
  },
];

function SettingsPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Einstellungen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(({ to, icon: Icon, color, title, description }) => (
          <div
            key={to}
            onClick={() => navigate(to)}
            className="bg-white rounded-2xl shadow p-6 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div
              style={{ backgroundColor: color }}
              className="p-3 rounded-xl w-fit"
            >
              <Icon size={20} color="white" />
            </div>
            <div className="mt-4 font-semibold text-gray-800">{title}</div>
            <div className="text-sm text-gray-400">{description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SettingsPage;
