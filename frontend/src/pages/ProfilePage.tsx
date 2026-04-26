import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";

import { updateProfile, changePassword } from "../api/auth";
import { useAuthStore } from "../store/authStore";

function ProfilePage() {
  const { user, updateUser } = useAuthStore();

  const [firstName, setFirstName] = useState(user?.first_name ?? "");
  const [lastName, setLastName] = useState(user?.last_name ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const profileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      updateUser({ first_name: data.first_name, last_name: data.last_name });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    },
  });

  function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    profileMutation.mutate({ first_name: firstName, last_name: lastName });
  }

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    passwordMutation.mutate({
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirm: newPasswordConfirm,
    });
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex items-center gap-3">
        <Link
          to="/settings"
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Profil</h1>
      </div>

      {/* Profile data */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Persönliche Daten
        </h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Vorname</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Nachname</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              E-Mail-Adresse
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              disabled
              className="w-full border border-gray-100 rounded-xl px-4 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {profileMutation.isSuccess && (
            <p className="text-sm text-emerald-600">Gespeichert.</p>
          )}
          {profileMutation.isError && (
            <p className="text-sm text-rose-500">Fehler beim Speichern.</p>
          )}

          <button
            type="submit"
            disabled={profileMutation.isPending}
            className="bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {profileMutation.isPending ? "Speichern..." : "Speichern"}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-4">
          Passwort ändern
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Aktuelles Passwort
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Neues Passwort
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Neues Passwort bestätigen
            </label>
            <input
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {passwordMutation.isSuccess && (
            <p className="text-sm text-emerald-600">Passwort geändert.</p>
          )}
          {passwordMutation.isError && (
            <p className="text-sm text-rose-500">
              Fehler. Prüfe dein aktuelles Passwort.
            </p>
          )}

          <button
            type="submit"
            disabled={passwordMutation.isPending}
            className="bg-teal-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {passwordMutation.isPending ? "Speichern..." : "Passwort ändern"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ProfilePage;
