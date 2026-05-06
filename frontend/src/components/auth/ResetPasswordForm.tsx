import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle } from "lucide-react";
import { confirmPasswordReset } from "../../api/auth";

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

function ResetPasswordForm({
  uidb64,
  token,
  onSwitch,
}: {
  uidb64: string;
  token: string;
  onSwitch: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ResetPasswordData) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await confirmPasswordReset({ uidb64, token, ...data });
      setSuccess(true);
    } catch (err: unknown) {
      const detail =
        (err as { response?: { data?: { token?: string } } })?.response?.data
          ?.token ??
        (
          err as {
            response?: { data?: { new_password?: string[] } };
          }
        )?.response?.data?.new_password?.[0] ??
        "Der Link ist ungültig oder abgelaufen.";
      setServerError(detail);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-[300px] flex flex-col items-center text-center gap-4">
        <CheckCircle size={48} className="text-teal-600" />
        <h2 className="text-2xl font-bold text-gray-800">Passwort geändert</h2>
        <p className="text-gray-500 text-sm">
          Dein Passwort wurde erfolgreich zurückgesetzt. Du kannst dich jetzt
          anmelden.
        </p>
        <button
          type="button"
          onClick={onSwitch}
          className="mt-2 text-sm text-teal-600 hover:underline font-medium"
        >
          Zum Login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
      <h2 className="text-2xl font-bold text-gray-800">Neues Passwort</h2>
      <p className="text-gray-500 mt-1 mb-6 text-sm">Gib dein neues Passwort ein.</p>

      <div className="flex flex-col gap-1 mb-4">
        <label className="text-sm font-medium text-gray-700">Neues Passwort</label>
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
        <label className="text-sm font-medium text-gray-700">Passwort bestätigen</label>
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
          onClick={onSwitch}
          className="text-teal-600 hover:underline font-medium"
        >
          Zurück zum Login
        </button>
      </p>
    </form>
  );
}

export default ResetPasswordForm;
