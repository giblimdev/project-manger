// app/schemas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useProjectsStore } from "@/stores/useProjectStore";
import { SchemaList } from "@/components/models/schemas/SchemaList";
import { SchemaFields } from "@/lib/generated/prisma/client";

export default function SchemasPage() {
  const [schemas, setSchemas] = useState<SchemaFields[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupération du projet depuis le store
  const { project, projectId, hasHydrated } = useProjectsStore();

  useEffect(() => {
    // Attendre l'hydratation pour éviter les erreurs SSR
    if (!hasHydrated) return;

    async function fetchSchemas() {
      if (!projectId) { 
        setSchemas([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Appel API avec projectId en paramètre
        const response = await fetch(
          `/api/schemas?projectId=${encodeURIComponent(projectId)}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Erreur ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();

        // Extraction des données depuis la structure de réponse API
        const schemasData = result.success ? result.data : result;
        setSchemas(Array.isArray(schemasData) ? schemasData : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des schemas:", err);
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
        setSchemas([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSchemas();
  }, [projectId, hasHydrated]);

  // Fonction pour rafraîchir les schemas après une modification
  const refreshSchemas = async () => {
    if (!projectId) return;

    try {
      const response = await fetch(
        `/api/schemas?projectId=${encodeURIComponent(projectId)}`
      );

      if (response.ok) {
        const result = await response.json();
        const schemasData = result.success ? result.data : result;
        setSchemas(Array.isArray(schemasData) ? schemasData : []);
      }
    } catch (err) {
      console.error("Erreur lors du rafraîchissement:", err);
    }
  };

  // Attendre l'hydratation
  if (!hasHydrated) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  // Vérification de la sélection du projet
  if (!project || !projectId) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Aucun projet sélectionné</h1>
          <p className="text-gray-600">
            Veuillez sélectionner un projet pour voir ses schémas.
          </p>
        </div>
      </div>
    );
  }

  // Rendu principal - délégation complète à SchemaList
  return (
    <div className="container mx-auto py-6">
      {/* Section d'affichage du projet en cours */}
      <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          Projet en cours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Nom du projet</p>
            <p className="font-medium text-gray-900">{project.name}</p>
          </div>
          {project.description && (
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="font-medium text-gray-900">{project.description}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">ID du projet</p>
            <p className="font-mono text-sm text-gray-700">{projectId}</p>
          </div>
          {project.createdAt && (
            <div>
              <p className="text-sm text-gray-600">Créé le</p>
              <p className="font-medium text-gray-900">
                {new Date(project.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* États de chargement et d'erreur uniquement pour le chargement initial */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4">Chargement des schémas...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-bold mb-4 text-red-600">Erreur</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      ) : (
        // Délégation complète à SchemaList - c'est lui qui gère tout
        <SchemaList
          initialSchemas={schemas}
          projectId={projectId}
          project={project}
        />
      )}
    </div>
  );
}
