import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Leaf, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { verifyEmail } from "../api/auth";

function VerifyEmailPage() {
    const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

useEffect(() => {
    verifyEmail(uidb64!, token!)
    .then(() => setStatus("success"))
    .catch(() => setStatus("error"));
}, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-100 via-sky-50 to-teal-100 py-8 overflow-x-hidden">
      <div className="relative z-10 w-[calc(100%-2rem)] max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex w-full items-center justify-center gap-2 bg-gradient-to-br from-teal-500 to-teal-700 py-5">
          <Leaf size={22} className="text-white" />
          <span className="text-xl font-bold text-white">Arbor</span>
        </div>

        <div className="flex justify-center py-10 px-8">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <Loader2 size={48} className="text-teal-600 animate-spin" />
              <p className="text-gray-500 text-sm">E-Mail wird verifiziert...</p>
            </div>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircle size={48} className="text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-800">E-Mail bestätigt</h2>
              <p className="text-gray-500 text-sm">Deine E-Mail-Adresse wurde erfolgreich verifiziert.</p>
              <Link to="/login" className="mt-2 text-sm text-teal-600 hover:underline font-medium">
                Zum Login
              </Link>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center gap-4 text-center">
              <XCircle size={48} className="text-red-500" />
              <h2 className="text-2xl font-bold text-gray-800">Link ungültig</h2>
              <p className="text-gray-500 text-sm">Der Verifizierungs-Link ist ungültig oder abgelaufen.</p>
              <Link to="/login" className="mt-2 text-sm text-teal-600 hover:underline font-medium">
                Zum Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-3 text-xs text-slate-500/80">
        <span>© 2026 Arbor</span>
        <span className="text-slate-400/60">·</span>
        <Link to="/legal-notice" className="hover:text-teal-600 transition-colors duration-150">Impressum</Link>
        <span className="text-slate-400/60">·</span>
        <Link to="/privacy-policy" className="hover:text-teal-600 transition-colors duration-150">Datenschutz</Link>
      </div>
    </div>
  );
}

export default VerifyEmailPage;
