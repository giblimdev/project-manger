// components/models/features/FeatureList.tsx
"use client";

import { useState, useEffect } from "react";
import { Features, Projects } from "@/lib/generated/prisma/client";
import {
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  Calendar,
  User,
  Hash,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { FeatureForm } from "./FeatureForm";

interface FeatureListProps {
  initialFeatures: Features[];
  projectId: string;
  project: Projects;
}

export function FeatureList({
  initialFeatures,
  projectId,
  project,
}: FeatureListProps) {
  const [features, setFeatures] = useState<Features[]>(initialFeatures);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Features | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mettre à jour les features quand les props changent
  useEffect(() => {
    setFeatures(initialFeatures);
    setHasOrderChanged(false);
  }, [initialFeatures]);

  const handleAddFeature = () => {
    setEditingFeature(null);
    setShowForm(true);
    setError(null);
  };

  const handleEditFeature = (feature: Features) => {
    setEditingFeature(feature);
    setShowForm(true);
    setError(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingFeature(null);
    setError(null);
  };

  // Gestion complète des opérations CRUD
  const handleFeatureSaved = async (featureData: any) => {
    try {
      setIsLoading(true);
      setError(null);

      if (editingFeature) {
        // PUT - Mise à jour d'une feature existante
        const response = await fetch("/api/features", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: editingFeature.id,
            ...featureData,
            projectId: projectId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Erreur ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();

        if (result.success && result.data) {
          setFeatures(
            features.map((f) => (f.id === editingFeature.id ? result.data : f))
          );
        } else {
          throw new Error(result.error || "Réponse API invalide");
        }
      } else {
        // POST - Ajout d'une nouvelle feature
        const response = await fetch("/api/features", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...featureData,
            projectId: projectId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `Erreur ${response.status}: ${response.statusText}`
          );
        }

        const result = await response.json();

        if (result.success && result.data) {
          setFeatures([...features, result.data]);
        } else {
          throw new Error(result.error || "Réponse API invalide");
        }
      }

      handleCloseForm();
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la feature:", error);
      setError(
        error instanceof Error ? error.message : "Erreur lors de la sauvegarde"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE - Suppression d'une feature
  const handleDeleteFeature = async (featureId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette fonctionnalité ?")) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/features?id=${encodeURIComponent(featureId)}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Erreur ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (result.success) {
        setFeatures(features.filter((f) => f.id !== featureId));
      } else {
        throw new Error(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError(
        error instanceof Error ? error.message : "Erreur lors de la suppression"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Réorganisation des features
  const moveFeature = (index: number, direction: "up" | "down") => {
    const newFeatures = [...features];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newFeatures.length) return;

    // Échanger les positions
    [newFeatures[index], newFeatures[targetIndex]] = [
      newFeatures[targetIndex],
      newFeatures[index],
    ];

    // Recalculer l'ordre pour chaque feature
    newFeatures.forEach((feature, idx) => {
      feature.order = (idx + 1) * 100;
    });

    setFeatures(newFeatures);
    setHasOrderChanged(true);
    setError(null);
  };

  // Sauvegarde de l'ordre via route dédiée
  const saveOrder = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const updates = features.map((feature, index) => ({
        id: feature.id,
        order: (index + 1) * 100,
      }));

      const response = await fetch("/api/features/order", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          updates,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Erreur ${response.status}: ${response.statusText}`
        );
      }

      const result = await response.json();

      if (result.success) {
        setHasOrderChanged(false);
        if (result.data) {
          setFeatures(result.data);
        }
      } else {
        throw new Error(result.error || "Erreur lors de la sauvegarde");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de l'ordre:", error);
      setError(
        error instanceof Error ? error.message : "Erreur lors de la sauvegarde"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOrderChange = () => {
    setFeatures(initialFeatures);
    setHasOrderChanged(false);
    setError(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "DONE":
        return "bg-green-100 text-green-800";
      case "BLOCKED":
        return "bg-red-100 text-red-800";
      case "CANCELLED":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return "bg-red-100 text-red-800";
    if (priority >= 3) return "bg-orange-100 text-orange-800";
    if (priority >= 2) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  // Affichage du formulaire
  if (showForm) {
    return (
      <FeatureForm
        projectId={projectId}
        project={project}
        feature={editingFeature}
        availableFeatures={features.filter((f) => f.id !== editingFeature?.id)}
        onSave={handleFeatureSaved}
        onCancel={handleCloseForm}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec bouton d'ajout */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Fonctionnalités ({features.length})
          </h2>
          <p className="text-sm text-gray-600">
            Gérez les fonctionnalités de votre projet
          </p>
        </div>
        <button
          onClick={handleAddFeature}
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Plus className="w-5 h-5 mr-2" />
          )}
          Ajouter une fonctionnalité
        </button>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Erreur</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Barre de sauvegarde de l'ordre */}
      {hasOrderChanged && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-amber-400 rounded-full mr-3"></div>
              <p className="text-sm font-medium text-amber-800">
                L'ordre des fonctionnalités a été modifié
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={saveOrder}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-1" />
                )}
                {isLoading ? "Sauvegarde..." : "Sauvegarder"}
              </button>
              <button
                onClick={cancelOrderChange}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-1.5 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 disabled:opacity-50 transition-colors duration-200"
              >
                <X className="w-4 h-4 mr-1" />
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Liste des fonctionnalités */}
      {features.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune fonctionnalité
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par ajouter votre première fonctionnalité à ce projet.
          </p>
          <button
            onClick={handleAddFeature}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ajouter une fonctionnalité
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
            >
              <div className="flex items-start justify-between">
                {/* Contenu de la fonctionnalité */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {feature.name}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <Hash className="w-3 h-3 mr-1" />
                        {feature.order}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}
                      >
                        {feature.status}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(feature.priority)}`}
                      >
                        P{feature.priority}
                      </span>
                    </div>
                  </div>

                  {feature.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {feature.description}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Hash className="w-3 h-3 mr-1" />
                      {feature.id.slice(0, 8)}...
                    </span>
                    {feature.createdAt && (
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(feature.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    )}
                    {feature.creatorId && (
                      <span className="flex items-center">
                        <User className="w-3 h-3 mr-1" />
                        Créateur
                      </span>
                    )}
                    {feature.startDate && (
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Début:{" "}
                        {new Date(feature.startDate).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                    )}
                    {feature.endDate && (
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Fin:{" "}
                        {new Date(feature.endDate).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {feature.parentFeatureId && (
                      <span className="flex items-center">
                        <Hash className="w-3 h-3 mr-1" />
                        Sous-feature
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {/* Flèches de réorganisation */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveFeature(index, "up")}
                      disabled={index === 0 || isLoading}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                      title="Déplacer vers le haut"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFeature(index, "down")}
                      disabled={index === features.length - 1 || isLoading}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200"
                      title="Déplacer vers le bas"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditFeature(feature)}
                      disabled={isLoading}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Éditer"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteFeature(feature.id)}
                      disabled={isLoading}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
