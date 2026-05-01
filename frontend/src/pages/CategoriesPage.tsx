import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";

import type { Category } from "../api/categories";
import { fetchCategories } from "../api/categories";
import CategoryModal from "../components/categories/CategoryModal";

function CategoriesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | undefined>(
    undefined,
  );

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  function openCreate() {
    setEditingCategory(undefined);
    setShowModal(true);
  }

  function openEdit(category: Category) {
    setEditingCategory(category);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditingCategory(undefined);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kategorien</h1>
        <button
          onClick={openCreate}
          className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-700"
        >
          Neue Kategorie
        </button>
      </div>

      {/* Category List */}
      {(["expense", "income"] as const).map((type) => {
        const group = categories?.filter((c) => c.type === type) ?? [];
        if (group.length === 0) return null;
        return (
          <div key={type}>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {type === "expense" ? "Ausgaben" : "Einnahmen"}
            </h2>
            <div className="space-y-2">
              {group.map((category) => (
                <div
                  key={category.id}
                  onClick={() => openEdit(category)}
                  className="flex items-center justify-between bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      style={{ backgroundColor: category.color }}
                      className="w-4 h-4 rounded-full flex-shrink-0"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {category.name}
                    </span>
                  </div>
                  <Pencil
                    size={15}
                    className="text-gray-300 group-hover:text-gray-500 transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Category Modal */}
      {showModal && (
        <CategoryModal category={editingCategory} onClose={closeModal} />
      )}
    </div>
  );
}

export default CategoriesPage;
