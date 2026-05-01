import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Trash2 } from "lucide-react";

import type { Category, CategoryPayload } from "../../api/categories";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/categories";

interface Props {
  category?: Category;
  onClose: () => void;
}

const PRESET_COLORS = [
  "#0d9488",
  "#6366f1",
  "#f43f5e",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#64748b",
  "#84cc16",
];

function CategoryModal({ category, onClose }: Props) {
  const isEdit = !!category;
  const queryClient = useQueryClient();

  const [name, setName] = useState(category?.name ?? "");
  const [type, setType] = useState<Category["type"]>(
    category?.type ?? "expense",
  );
  const [color, setColor] = useState(category?.color ?? PRESET_COLORS[0]);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const createMutation = useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: () =>
      setError("Fehler beim Erstellen. Bitte prüfe deine Eingaben."),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: CategoryPayload) =>
      updateCategory(category!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: () =>
      setError("Fehler beim Speichern. Bitte prüfe deine Eingaben."),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCategory(category!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      onClose();
    },
    onError: () => setError("Fehler beim Löschen."),
  });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Bitte einen Namen eingeben.");
      return;
    }

    const payload: CategoryPayload = {
      name: name.trim(),
      icon: "",
      color,
      type,
    };

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-800">
            {isEdit ? "Kategorie bearbeiten" : "Neue Kategorie"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="z.B. Lebensmittel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Typ
            </label>
            <div className="flex rounded-xl overflow-hidden border border-gray-200">
              {(["expense", "income"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 text-sm font-medium transition-colors ${
                    type === t
                      ? "bg-teal-600 text-white"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {t === "expense" ? "Ausgabe" : "Einnahme"}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">
              Farbe
            </label>
            <div className="flex flex-wrap gap-2 items-center">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                >
                  {color === c && (
                    <span className="text-white text-xs font-bold">✓</span>
                  )}
                </button>
              ))}

              {/* Custom color */}
              <label
                className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 overflow-hidden relative"
                title="Eigene Farbe"
              >
                <span className="text-gray-400 text-xs select-none">+</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
              </label>
            </div>

            {/* Preview */}
            <div className="mt-2 flex items-center gap-2">
              <div
                style={{ backgroundColor: color }}
                className="w-5 h-5 rounded-full flex-shrink-0"
              />
              <span className="text-xs text-gray-400">{color}</span>
            </div>
          </div>

          {error && <p className="text-xs text-rose-500">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 rounded-xl py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-teal-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-teal-700 disabled:opacity-60"
            >
              {isPending ? "Speichern…" : "Speichern"}
            </button>
          </div>

          {/* Delete (edit mode only) */}
          {isEdit && (
            <div className="pt-1 border-t border-gray-100">
              {!confirmDelete ? (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-2 text-rose-500 text-sm hover:text-rose-700 mt-3"
                >
                  <Trash2 size={15} />
                  Kategorie löschen
                </button>
              ) : (
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sicher löschen?</span>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate()}
                    disabled={isPending}
                    className="text-sm text-white bg-rose-500 px-3 py-1 rounded-lg hover:bg-rose-600 disabled:opacity-60"
                  >
                    Ja, löschen
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Abbrechen
                  </button>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;
