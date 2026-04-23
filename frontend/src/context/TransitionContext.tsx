import { createContext, useContext, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

interface TransitionContextValue {
  navigateWithTransition: (to: string, beforeNavigate?: () => Promise<void>) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigateWithTransition: () => {},
});

const FADE_IN_MS = 300;

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const busyRef = useRef(false);

  const navigateWithTransition = useCallback(
    (to: string, beforeNavigate?: () => Promise<void>) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setVisible(true);

      setTimeout(async () => {
        if (beforeNavigate) await beforeNavigate();
        navigate(to);
        setVisible(false);
        busyRef.current = false;
      }, FADE_IN_MS + 120);
    },
    [navigate],
  );

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="page-transition"
            className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_IN_MS / 1000, ease: "easeInOut" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center gap-3"
            >
              <Leaf size={48} className="text-white" />
              <span className="text-3xl font-bold text-white tracking-tight">
                Arbor
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

export function useTransitionNavigate() {
  return useContext(TransitionContext).navigateWithTransition;
}
