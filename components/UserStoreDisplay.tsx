// components/UserStoreDisplay.tsx
"use client";

import { useUserStore } from "@/stores/useUserStore";

export default function UserStoreDisplay() {
  const { data, isLoading, error } = useUserStore();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
        📦 Informations du Store
      </h2>

      {/* État de chargement */}
      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Chargement...</p>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">❌ Erreur: {error}</p>
        </div>
      )}

      {/* Données utilisateur */}
      {data?.user ? (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-800 text-sm font-medium mb-2">
              ✅ Utilisateur connecté
            </p>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-xs">{data.user.id}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Nom:</span>
                <span className="font-medium">{data.user.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{data.user.email}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Vérifié:</span>
                <span
                  className={
                    data.user.emailVerified
                      ? "text-green-600"
                      : "text-orange-600"
                  }
                >
                  {data.user.emailVerified ? "✅ Oui" : "⏳ Non"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Créé le:</span>
                <span className="text-xs">
                  {data.user.createdAt.toLocaleDateString("fr-FR")}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Modifié le:</span>
                <span className="text-xs">
                  {data.user.updatedAt.toLocaleDateString("fr-FR")}
                </span>
              </div>

              {data.user.image && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avatar:</span>
                  <img
                    src={data.user.image}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-gray-600 text-sm text-center">
            📭 Aucune donnée utilisateur dans le store
          </p>
        </div>
      )}

      {/* État du store */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium text-gray-700">État</div>
            <div
              className={`mt-1 ${isLoading ? "text-yellow-600" : "text-green-600"}`}
            >
              {isLoading ? "Chargement" : "Prêt"}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Données</div>
            <div
              className={`mt-1 ${data ? "text-green-600" : "text-gray-500"}`}
            >
              {data ? "Présentes" : "Vides"}
            </div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Erreurs</div>
            <div
              className={`mt-1 ${error ? "text-red-600" : "text-green-600"}`}
            >
              {error ? "Oui" : "Non"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
