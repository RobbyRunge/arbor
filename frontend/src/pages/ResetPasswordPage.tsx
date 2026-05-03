import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Leaf, CheckCircle } from "lucide-react";
import { confirmPasswordReset } from "../api/auth";

const schema = z
  .object({
    new_password: z.string().min(8, "Min. 8 Zeichen"),
    new_password_confirm: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirm, {
    message: "Passwörter stimmen nicht überein",
    path: ["new_password_confirm"],
  });

type ResetPasswordData = z.infer<typeof schema>;

function ResetPasswordPage() {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ResetPasswordData) => {
    if (!uidb64 || !token) return;
    setIsLoading(true);
    setServerError(null);
    try {
      await confirmPasswordReset({ uidb64, token, ...data });
      setSuccess(true);
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { token?: string; new_password?: string[] } } })
          ?.response?.data?.token ??
        (err as { response?: { data?: { new_password?: string[] } } })
          ?.response?.data?.new_password?.[0] ??
        "Der Link ist ungültig oder abgelaufen.";
      setServerError(detail);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-br from-blue-100 via-sky-50 to-teal-100 py-8 overflow-x-hidden">
      <svg
        className="absolute inset-0 w-full h-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <polygon points="0,0 420,0 180,320" fill="rgba(147,210,220,0.22)" />
        <polygon points="0,0 200,0 0,250" fill="rgba(120,195,215,0.18)" />
        <polygon points="350,0 750,0 500,280" fill="rgba(160,220,230,0.14)" />
        <polygon points="900,0 1440,0 1440,350 1100,180" fill="rgba(170,225,230,0.18)" />
        <polygon points="1200,0 1440,0 1440,200" fill="rgba(140,210,220,0.20)" />
        <polygon points="0,250 250,350 0,550" fill="rgba(100,185,205,0.16)" />
        <polygon points="0,400 400,300 300,600" fill="rgba(130,200,215,0.13)" />
        <polygon points="500,200 900,150 750,500" fill="rgba(150,215,225,0.10)" />
        <polygon points="900,300 1300,200 1440,500 1100,550" fill="rgba(160,220,228,0.13)" />
        <polygon points="0,580 320,900 0,900" fill="rgba(38,166,154,0.50)" />
        <polygon points="0,720 160,900 0,900" fill="rgba(25,140,130,0.45)" />
        <polygon points="0,550 400,750 250,900" fill="rgba(80,175,190,0.20)" />
        <polygon points="350,900 700,700 900,900" fill="rgba(140,210,220,0.18)" />
        <polygon points="1000,900 1440,650 1440,900" fill="rgba(147,210,220,0.25)" />
        <polygon points="1250,900 1440,780 1440,900" fill="rgba(120,195,210,0.20)" />
        <polygon points="1300,300 1440,200 1440,550 1200,500" fill="rgba(170,225,235,0.12)" />
      </svg>

      <div className="relative z-10 w-[calc(100%-2rem)] max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex w-full items-center justify-center gap-2 bg-gradient-to-br from-teal-500 to-teal-700 py-5">
          <Leaf size={22} className="text-white" />
          <span className="text-xl font-bold text-white">Arbor</span>
        </div>

        <div className="flex justify-center py-10 px-8">
          {success ? (
            <div className="w-[300px] flex flex-col items-center text-center gap-4">
              <CheckCircle size={48} className="text-teal-600" />
              <h2 className="text-2xl font-bold text-gray-800">Passwort geändert</h2>
              <p className="text-gray-500 text-sm">
                Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt anmelden.
              </p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mt-2 text-sm text-teal-600 hover:underline font-medium"
              >
                Zum Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
              <h2 className="text-2xl font-bold text-gray-800">Neues Passwort</h2>
              <p className="text-gray-500 mt-1 mb-6 text-sm">
                Gib dein neues Passwort ein.
              </p>

              <div className="flex flex-col gap-1 mb-4">
                <label className="text-sm font-medium text-gray-700">
                  Neues Passwort
                </label>
                <input
                  {...register("new_password")}
                  type="password"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                />
                {errors.new_password && (
                  <p className="text-red-500 text-sm">{errors.new_password.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1 mb-6">
                <label className="text-sm font-medium text-gray-700">
                  Passwort bestätigen
                </label>
                <input
                  {...register("new_password_confirm")}
                  type="password"
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
                />
                {errors.new_password_confirm && (
                  <p className="text-red-500 text-sm">
                    {errors.new_password_confirm.message}
                  </p>
                )}
              </div>

              {serverError && (
                <p className="text-red-500 text-sm mb-4">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {isLoading ? "Wird gespeichert..." : "Passwort speichern"}
              </button>

              <p className="text-center text-sm text-gray-500 mt-4">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-teal-600 hover:underline font-medium"
                >
                  Zurück zum Login
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-6 flex items-center gap-3 text-xs text-slate-500/80">
        <span>© 2026 Arbor</span>
        <span className="text-slate-400/60">·</span>
        <Link to="/legal-notice" className="hover:text-teal-600 transition-colors duration-150">
          Impressum
        </Link>
        <span className="text-slate-400/60">·</span>
        <Link to="/privacy-policy" className="hover:text-teal-600 transition-colors duration-150">
          Datenschutz
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
