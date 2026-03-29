import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerUser, loginUser } from "../../api/auth";

const schema = z
  .object({
    first_name: z.string().min(1, "Pflichtfeld"),
    last_name: z.string().min(1, "Pflichtfeld"),
    email: z.string().email("Ungültige E-Mail"),
    password: z.string().min(8, "Min. 8 Zeichen"),
    password_confirm: z.string(),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwörter stimmen nicht überein",
    path: ["password_confirm"],
  });

type RegisterData = z.infer<typeof schema>;

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await registerUser(data);
      await loginUser(data.email, data.password);
      navigate("/");
    } catch (err: any) {
      const fieldErrors = err?.response?.data;
      if (fieldErrors && typeof fieldErrors === "object") {
        (
          ["first_name", "last_name", "password", "password_confirm"] as const
        ).forEach((field) => {
          if (fieldErrors[field]) {
            setError(field, { message: fieldErrors[field][0] });
          }
        });
        if (fieldErrors.email || fieldErrors.non_field_errors) {
          setServerError(
            "Etwas ist schiefgelaufen. Bitte überprüfe deine Angaben.",
          );
        }
      } else {
        setServerError("Etwas ist schiefgelaufen. Bitte versuche es erneut.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
      <h2 className="text-2xl font-bold text-gray-800">Konto erstellen</h2>
      <p className="text-gray-500 mt-1 mb-6">
        Starte mit deiner Finanzverwaltung
      </p>

      <div className="flex gap-3 mb-4">
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <label className="text-sm font-medium text-gray-700">Vorname</label>
          <input
            {...register("first_name")}
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm">{errors.first_name.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <label className="text-sm font-medium text-gray-700">Nachname</label>
          <input
            {...register("last_name")}
            type="text"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-4">
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

      <div className="flex flex-col gap-1 mb-4">
        <label className="text-sm font-medium text-gray-700">Passwort</label>
        <input
          {...register("password")}
          type="password"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1 mb-6">
        <label className="text-sm font-medium text-gray-700">
          Passwort bestätigen
        </label>
        <input
          {...register("password_confirm")}
          type="password"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500 w-full"
        />
        {errors.password_confirm && (
          <p className="text-red-500 text-sm">
            {errors.password_confirm.message}
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
        {isLoading ? "Wird erstellt..." : "Konto erstellen"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Bereits ein Konto?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-teal-600 hover:underline font-medium"
        >
          Anmelden
        </button>
      </p>
    </form>
  );
}

export default RegisterForm;
