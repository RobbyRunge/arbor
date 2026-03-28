import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUser } from "../../api/auth";

const schema = z.object({
  email: z.string().email("Ungültige E-Mail"),
  password: z.string().min(8, "Min. 8 Zeichen"),
});

type LoginData = z.infer<typeof schema>;

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      const { access, refresh } = await loginUser(data.email, data.password);
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      navigate("/");
    } catch {
      setServerError("E-Mail oder Passwort ungültig.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-[300px]">
      <h2 className="text-2xl font-bold text-gray-800">Willkommen zurück</h2>
      <p className="text-gray-500 mt-1 mb-6">Melde dich an</p>

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

      <div className="flex flex-col gap-1 mb-6">
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

      <div className="text-right mb-6">
        <a href="" className="text-sm text-teal-600 hover:underline">
          Passwort vergessen?
        </a>
      </div>

      {serverError && (
        <p className="text-red-500 text-sm mb-4">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-semibold py-2 rounded-lg transition-colors"
      >
        {isLoading ? "Wird angemeldet..." : "Anmelden"}
      </button>

      <p className="text-center text-sm text-gray-500 mt-4">
        Noch kein Konto?{" "}
        <button
          type="button"
          onClick={onSwitch}
          className="text-teal-600 hover:underline font-medium"
        >
          Registrieren
        </button>
      </p>
    </form>
  );
}

export default LoginForm;
