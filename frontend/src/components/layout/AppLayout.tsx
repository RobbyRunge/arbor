import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

import Sidebar from "./Sidebar";
import { useInactivity } from "../../hooks/useInactivity";

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useInactivity();

  return (
    <div className="relative flex items-start justify-center min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-teal-100 p-4 md:p-8">
      {/* Background polygons */}
      <svg
        className="absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 420,0 180,320" fill="rgba(147,210,220,0.22)" />
        <polygon points="0,0 200,0 0,250" fill="rgba(120,195,215,0.18)" />
        <polygon points="350,0 750,0 500,280" fill="rgba(160,220,230,0.14)" />
        <polygon
          points="900,0 1440,0 1440,350 1100,180"
          fill="rgba(170,225,230,0.18)"
        />
        <polygon
          points="1200,0 1440,0 1440,200"
          fill="rgba(140,210,220,0.20)"
        />
        <polygon points="0,250 250,350 0,550" fill="rgba(100,185,205,0.16)" />
        <polygon points="0,400 400,300 300,600" fill="rgba(130,200,215,0.13)" />
        <polygon
          points="500,200 900,150 750,500"
          fill="rgba(150,215,225,0.10)"
        />
        <polygon
          points="900,300 1300,200 1440,500 1100,550"
          fill="rgba(160,220,228,0.13)"
        />
        <polygon points="0,580 320,900 0,900" fill="rgba(38,166,154,0.50)" />
        <polygon points="0,720 160,900 0,900" fill="rgba(25,140,130,0.45)" />
        <polygon points="0,550 400,750 250,900" fill="rgba(80,175,190,0.20)" />
        <polygon
          points="350,900 700,700 900,900"
          fill="rgba(140,210,220,0.18)"
        />
        <polygon
          points="1000,900 1440,650 1440,900"
          fill="rgba(147,210,220,0.25)"
        />
        <polygon
          points="1250,900 1440,780 1440,900"
          fill="rgba(120,195,210,0.20)"
        />
        <polygon
          points="1300,300 1440,200 1440,550 1200,500"
          fill="rgba(170,225,235,0.12)"
        />
      </svg>

      {/* Mobile: overlay + drawer sidebar (fixed to viewport, outside card) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 md:hidden transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* App card */}
      <div className="relative z-10 flex w-full max-w-[1400px] min-h-[calc(100vh-4rem)] rounded-2xl shadow-xl overflow-hidden">
        {/* Desktop sidebar — always in flow, never fixed */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 bg-white/90 p-4 md:p-8 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mb-4 p-2 rounded-lg text-gray-600 hover:bg-white/60 md:hidden"
          >
            <Menu size={22} />
          </button>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
