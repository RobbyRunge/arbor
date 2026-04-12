import { useNavigate } from "react-router-dom";
import { Leaf, ArrowLeft } from "lucide-react";

function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-100 via-sky-50 to-teal-100 py-12 px-4">
      <svg
        className="absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 420,0 180,320" fill="rgba(147,210,220,0.22)" />
        <polygon points="0,580 320,900 0,900" fill="rgba(38,166,154,0.50)" />
        <polygon points="0,720 160,900 0,900" fill="rgba(25,140,130,0.45)" />
        <polygon
          points="1000,900 1440,650 1440,900"
          fill="rgba(147,210,220,0.25)"
        />
        <polygon
          points="900,0 1440,0 1440,350 1100,180"
          fill="rgba(170,225,230,0.18)"
        />
      </svg>

      <div className="relative z-10 w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-6 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-teal-600">
            <Leaf size={20} />
            <span className="font-bold text-base tracking-tight">Arbor</span>
          </div>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <h1 className="text-base font-semibold text-slate-700 w-full sm:w-auto">
            Datenschutzerklärung
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
          <section>
            <h2 className="font-semibold text-slate-800 mb-1">
              1. Verantwortlicher
            </h2>
            <p>
              Verantwortlich für die Datenverarbeitung auf dieser Website ist
              Max Mustermann, Musterstraße 1, 12345 Musterstadt
              (kontakt@arbor.dev).
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1">
              2. Erhobene Daten
            </h2>
            <p>
              Bei der Registrierung werden E-Mail-Adresse und Passwort
              (verschlüsselt) gespeichert. Finanzdaten (Konten, Transaktionen,
              Budgets) werden ausschließlich deinem Konto zugeordnet und nicht
              an Dritte weitergegeben.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1">3. Cookies</h2>
            <p>
              Arbor verwendet ausschließlich technisch notwendige
              httpOnly-Cookies zur Sitzungsverwaltung (JWT). Es werden keine
              Tracking- oder Marketing-Cookies eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1">
              4. Deine Rechte
            </h2>
            <p>
              Du hast jederzeit das Recht auf Auskunft, Berichtigung und
              Löschung deiner gespeicherten Daten. Wende dich dafür an
              kontakt@arbor.dev.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-slate-800 mb-1">5. Hinweis</h2>
            <p className="text-slate-500">
              Dies ist ein privates Showcase-Projekt ohne kommerziellen Betrieb.
            </p>
          </section>
        </div>

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mt-8 flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Zurück
        </button>
      </div>

      <p className="relative z-10 mt-5 text-xs text-slate-500/70">
        © 2026 Arbor
      </p>
    </div>
  );
}

export default PrivacyPolicyPage;
