// components/ItemSelected.tsx

import React from "react";

/**
 * Composant réutilisable pour afficher les détails d'un item sélectionné.
 * @param tableName - nom de la table (ex: "comments", "projects", etc.)
 * @param item - l'objet sélectionné à afficher (peut être null)
 */
type ItemSelectedProps = {
  tableName: string;
  item: Record<string, any> | null;
};

export function ItemSelected({ tableName, item }: ItemSelectedProps) {
  if (!item) {
    return (
      <div className="text-gray-400 italic py-4 text-center bg-blue-300">
        Aucun élément sélectionné dans{" "}
        <span className="font-semibold">{tableName}</span>.
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow max-w-xl mx-auto my-6">
      <h3 className="text-lg font-bold mb-2 capitalize">
        Détail {tableName.slice(0, -1)}
      </h3>
      <ul className="space-y-1">
        {Object.entries(item).map(([key, value]) => (
          <li key={key} className="flex">
            <span className="w-40 font-medium text-gray-600">{key} :</span>
            <span className="text-gray-800 break-all">
              {typeof value === "object" && value !== null
                ? JSON.stringify(value)
                : String(value)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
