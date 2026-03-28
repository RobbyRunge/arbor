import { Leaf, LayoutDashboard, PiggyBank, FileDown } from "lucide-react";

import LoginForm from "../components/auth/LoginForm";

function LoginPage() {
  return (
    <div className="relative flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-100 via-sky-50 to-teal-100 overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        {/* top-left large */}
        <polygon points="0,0 420,0 180,320" fill="rgba(147,210,220,0.22)" />
        {/* top-left small overlay */}
        <polygon points="0,0 200,0 0,250" fill="rgba(120,195,215,0.18)" />
        {/* top-center */}
        <polygon points="350,0 750,0 500,280" fill="rgba(160,220,230,0.14)" />
        {/* top-right */}
        <polygon
          points="900,0 1440,0 1440,350 1100,180"
          fill="rgba(170,225,230,0.18)"
        />
        {/* top-right accent */}
        <polygon
          points="1200,0 1440,0 1440,200"
          fill="rgba(140,210,220,0.20)"
        />
        {/* left middle */}
        <polygon points="0,250 250,350 0,550" fill="rgba(100,185,205,0.16)" />
        {/* center-left spreading */}
        <polygon points="0,400 400,300 300,600" fill="rgba(130,200,215,0.13)" />
        {/* center */}
        <polygon
          points="500,200 900,150 750,500"
          fill="rgba(150,215,225,0.10)"
        />
        {/* center-right */}
        <polygon
          points="900,300 1300,200 1440,500 1100,550"
          fill="rgba(160,220,228,0.13)"
        />
        {/* bottom-left dark — prominent */}
        <polygon points="0,580 320,900 0,900" fill="rgba(38,166,154,0.50)" />
        {/* bottom-left darker overlay */}
        <polygon points="0,720 160,900 0,900" fill="rgba(25,140,130,0.45)" />
        {/* bottom-left medium */}
        <polygon points="0,550 400,750 250,900" fill="rgba(80,175,190,0.20)" />
        {/* bottom-center */}
        <polygon
          points="350,900 700,700 900,900"
          fill="rgba(140,210,220,0.18)"
        />
        {/* bottom-right */}
        <polygon
          points="1000,900 1440,650 1440,900"
          fill="rgba(147,210,220,0.25)"
        />
        {/* bottom-right accent */}
        <polygon
          points="1250,900 1440,780 1440,900"
          fill="rgba(120,195,210,0.20)"
        />
        {/* right middle */}
        <polygon
          points="1300,300 1440,200 1440,550 1200,500"
          fill="rgba(170,225,235,0.12)"
        />
      </svg>
      <div className="relative z-10 flex rounded-2xl shadow-xl overflow-hidden w-[900px] h-[580px]">
        <div className="w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 flex flex-col items-center justify-center text-center">
          <Leaf size={48} className="text-white" />
          <h1 className="text-4xl font-bold text-white mt-4">Arbor</h1>
          <h2 className="text-white/70 mt-2">Your finances, simplified</h2>
          <div className="flex flex-col gap-6 mt-12">
            <div className="flex items-center gap-3 text-white">
              <LayoutDashboard size={20} />
              <div>
                <p className="font-semibold">Track your spending</p>
                <p className="text-sm text-white/60">
                  See where your money goes
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white">
              <PiggyBank size={20} />
              <div>
                <p className="font-semibold">Manage budgets</p>
                <p className="text-sm text-white/60">
                  Stay on top of your limits
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white">
              <FileDown size={20} />
              <div>
                <p className="font-semibold">Export reports</p>
                <p className="text-sm text-white/60">PDF & CSV at any time</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 bg-white flex items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
