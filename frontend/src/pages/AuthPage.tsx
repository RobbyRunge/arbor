import { useState, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, LayoutDashboard, PiggyBank, FileDown } from "lucide-react";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

type AuthMode = "login" | "register" | "forgot-password";

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia("(min-width: 1024px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isDesktop;
}

const formVariants = {
  enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
};

const cardHeight: Record<AuthMode, number> = {
  login: 580,
  register: 680,
  "forgot-password": 460,
};

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isDesktop = useIsDesktop();
  const [direction, setDirection] = useState(0);

  const sessionReason = searchParams.get("reason");
  const sessionMessage =
    sessionReason === "inactivity"
      ? "Aus Sicherheitsgründen wurdest du nach 10 Minuten Inaktivität abgemeldet."
      : sessionReason === "session_expired"
        ? "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an."
        : null;

  const mode: AuthMode =
    location.pathname === "/register"
      ? "register"
      : location.pathname === "/forgot-password"
        ? "forgot-password"
        : "login";

  const switchTo = (next: AuthMode) => {
    setDirection(next === "login" ? -1 : 1);
    navigate(`/${next}`);
  };

  const brandingOnRight = mode === "register";

  return (
    <div className="relative flex items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-100 via-sky-50 to-teal-100 py-8 overflow-x-hidden">
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

      <motion.div
        layout
        animate={isDesktop ? { height: cardHeight[mode] } : {}}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="relative z-10 flex flex-col lg:flex-row rounded-2xl shadow-xl overflow-hidden w-[calc(100%-2rem)] max-w-sm lg:max-w-none lg:w-[900px]"
      >
        {/* Branding panel — only on desktop */}
        <motion.div
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`hidden lg:flex w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 flex-col items-center justify-center text-center px-10 ${brandingOnRight ? "order-2" : "order-1"}`}
        >
          <Leaf size={48} className="text-white" />
          <h1 className="text-4xl font-bold text-white mt-4">Arbor</h1>
          <p className="text-white/70 mt-2">
            Deine Finanzen, einfach verwaltet
          </p>
          <div className="flex flex-col gap-6 mt-12">
            <div className="flex items-center gap-3 text-white">
              <LayoutDashboard size={20} />
              <div className="text-left">
                <p className="font-semibold">Ausgaben verfolgen</p>
                <p className="text-sm text-white/60">
                  Sieh, wohin dein Geld fließt
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white">
              <PiggyBank size={20} />
              <div className="text-left">
                <p className="font-semibold">Budgets verwalten</p>
                <p className="text-sm text-white/60">
                  Behalte deine Limits im Blick
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-white">
              <FileDown size={20} />
              <div className="text-left">
                <p className="font-semibold">Berichte exportieren</p>
                <p className="text-sm text-white/60">PDF & CSV jederzeit</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form panel */}
        <motion.div
          layout
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`w-full lg:w-1/2 bg-white flex flex-col items-center justify-center pb-10 lg:py-0 overflow-hidden ${brandingOnRight ? "order-1" : "order-2"}`}
        >
          {/* Logo-Header — nur auf Mobile/Tablet */}
          <div className="flex lg:hidden w-full items-center justify-center gap-2 bg-gradient-to-br from-teal-500 to-teal-700 py-5 mb-8">
            <Leaf size={22} className="text-white" />
            <span className="text-xl font-bold text-white">Arbor</span>
          </div>
          {sessionMessage && (
            <div className="w-full px-8 mb-4">
              <div className="bg-amber-50 border border-amber-300 text-amber-800 text-sm rounded-lg px-4 py-3">
                {sessionMessage}
              </div>
            </div>
          )}
          <AnimatePresence mode="wait" custom={direction}>
            {mode === "login" && (
              <motion.div
                key="login"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <LoginForm
                  onSwitch={() => switchTo("register")}
                  onForgotPassword={() => switchTo("forgot-password")}
                />
              </motion.div>
            )}
            {mode === "register" && (
              <motion.div
                key="register"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <RegisterForm onSwitch={() => switchTo("login")} />
              </motion.div>
            )}
            {mode === "forgot-password" && (
              <motion.div
                key="forgot-password"
                custom={direction}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
              >
                <ForgotPasswordForm onSwitch={() => switchTo("login")} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AuthPage;
