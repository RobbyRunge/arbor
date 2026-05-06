import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { requestPasswordReset } from "../../api/auth";

const schema = z.object({
  email: z.string().email("Ungültige E-Mail"),
});

type ForgotPasswordData = z.infer<typeof schema>;

function ForgotPasswordForm({ onSwitch }: { onSwitch: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await requestPasswordReset(data.email);
      setSubmitted(true);
    } catch {
      setServerError("Fehler beim Senden. Bitte versuche es erneut.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-[300px] flex flex-col items-center text-center gap-4">
        <CheckCircle size={48} className="text-teal-600" />
        <h2 className="text-2xl font-bold text-gray-800">E-Mail gesendet</h2>
        <p className="text-gray-500 text-sm">
          Falls ein Konto mit dieser Adresse existiert, erhältst du in Kürze
          eine E-Mail mit einem Reset-Link.
        </p>
        <button
          type="button"
          onClick={onSwitch}
          className="mt-2 text-sm text-teal-600 hover:underline font-medium"
        >
          Zurück zum Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
      <h2 className="text-2xl font-bold text-gray-800">Passwort vergessen</h2>
      <p className="text-gray-500 mt-1 mb-6 text-sm">
        Gib deine E-Mail ein – wir schicken dir einen Reset-Link.
      </p>

      <div className="flex flex-col gap-1 mb-6">
        <label className="text-sm font-medium text-gray-700">E-Mail</label>
        <input
          {...register("email")}
          type="email"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
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
        {isLoading ? "Wird gesendet..." : "Reset-Link anfordern"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        <button
          type="button"
          onClick={onSwitch}
          className="text-teal-600 hover:underline font-medium"
        >
          Zurück zum Login
        </button>
      </p>
    </form>
  );
}

export default ForgotPasswordForm;
