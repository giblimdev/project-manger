// components/models/features/FeatureForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Features, Projects } from "@/lib/generated/prisma/client";
import { Calendar, User, ArrowLeft, Save, X, AlertCircle } from "lucide-react";

// Type pour les données du formulaire
type FeatureFormData = {
  name: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "BLOCKED" | "CANCELLED";
  priority: number;
  order?: number;
  startDate?: string;
  endDate?: string;
  parentFeatureId?: string;
};

interface FeatureFormProps {
  projectId: string;
  project: Projects;
  feature?: Features | null;
  availableFeatures?: Features[];
  onSave: (data: FeatureFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FeatureForm({
  projectId,
  project,
  feature,
  availableFeatures = [],
  onSave,
  onCancel,
  isLoading = false,
}: FeatureFormProps) {
  const isEditing = !!feature;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FeatureFormData>({
    defaultValues: {
      name: feature?.name || "",
      description: feature?.description || "",
      status: feature?.status || "TODO",
      priority: feature?.priority || 1,
      order: feature?.order || 100,
      startDate: feature?.startDate
        ? new Date(feature.startDate).toISOString().split("T")[0]
        : "",
      endDate: feature?.endDate
        ? new Date(feature.endDate).toISOString().split("T")[0]
        : "",
      parentFeatureId: feature?.parentFeatureId || "",
    },
  });

  const watchedStartDate = watch("startDate");

  const onSubmit = async (data: FeatureFormData) => {
    try {
      // Conversion des dates
      const formattedData = {
        ...data,
        startDate: data.startDate
          ? new Date(data.startDate).toISOString()
          : undefined,
        endDate: data.endDate
          ? new Date(data.endDate).toISOString()
          : undefined,
        priority: Number(data.priority),
        order: Number(data.order),
        parentFeatureId: data.parentFeatureId || undefined,
      };

      await onSave(formattedData);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  const statusOptions = [
    { value: "TODO", label: "À faire", color: "bg-gray-100 text-gray-800" },
    {
      value: "IN_PROGRESS",
      label: "En cours",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "REVIEW",
      label: "En révision",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "DONE", label: "Terminé", color: "bg-green-100 text-green-800" },
    { value: "BLOCKED", label: "Bloqué", color: "bg-red-100 text-red-800" },
    { value: "CANCELLED", label: "Annulé", color: "bg-gray-100 text-gray-600" },
  ];

  const priorityOptions = [
    { value: 1, label: "Faible", color: "bg-green-100 text-green-800" },
    { value: 2, label: "Normale", color: "bg-yellow-100 text-yellow-800" },
    { value: 3, label: "Élevée", color: "bg-orange-100 text-orange-800" },
    { value: 4, label: "Critique", color: "bg-red-100 text-red-800" },
    { value: 5, label: "Urgente", color: "bg-red-100 text-red-800" },
  ];

  // Grouper les fonctionnalités par statut pour une meilleure UX
  const groupedFeatures = availableFeatures.reduce(
    (acc, feature) => {
      const status = feature.status || "TODO";
      if (!acc[status]) acc[status] = [];
      acc[status].push(feature);
      return acc;
    },
    {} as Record<string, Features[]>
  );

  const statusLabels = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    REVIEW: "En révision",
    DONE: "Terminé",
    BLOCKED: "Bloqué",
    CANCELLED: "Annulé",
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Retour"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing
                  ? "Modifier la fonctionnalité"
                  : "Nouvelle fonctionnalité"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Projet: {project.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </button>
            <button
              type="submit"
              form="feature-form"
              disabled={isSubmitting || isLoading}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Mettre à jour" : "Créer"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <form id="feature-form" onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="space-y-6">
            {/* Nom */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nom de la fonctionnalité <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "Le nom est requis",
                  minLength: { value: 2, message: "Minimum 2 caractères" },
                  maxLength: { value: 100, message: "Maximum 100 caractères" },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: Système d'authentification, API de paiement..."
                disabled={isSubmitting || isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description", {
                  maxLength: { value: 500, message: "Maximum 500 caractères" },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Décrivez les objectifs et les détails de cette fonctionnalité..."
                disabled={isSubmitting || isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Statut et Priorité */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Statut
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  disabled={isSubmitting || isLoading}
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Priorité
                </label>
                <select
                  id="priority"
                  {...register("priority", { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  disabled={isSubmitting || isLoading}
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ordre d'affichage */}
            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ordre d'affichage
              </label>
              <input
                id="order"
                type="number"
                min="1"
                max="9999"
                {...register("order", {
                  valueAsNumber: true,
                  min: { value: 1, message: "L'ordre doit être supérieur à 0" },
                  max: {
                    value: 9999,
                    message: "L'ordre doit être inférieur à 10000",
                  },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                  errors.order ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="100"
                disabled={isSubmitting || isLoading}
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.order.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Détermine l'ordre d'affichage dans la liste (plus petit = plus
                haut)
              </p>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date de début
                </label>
                <input
                  id="startDate"
                  type="date"
                  {...register("startDate")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                  disabled={isSubmitting || isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Date de fin
                </label>
                <input
                  id="endDate"
                  type="date"
                  {...register("endDate", {
                    validate: (value) => {
                      if (
                        value &&
                        watchedStartDate &&
                        value < watchedStartDate
                      ) {
                        return "La date de fin doit être postérieure à la date de début";
                      }
                      return true;
                    },
                  })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                    errors.endDate ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting || isLoading}
                />
                {errors.endDate && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            {/* Fonctionnalité parente */}
            <div>
              <label
                htmlFor="parentFeatureId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <User className="w-4 h-4 inline mr-1" />
                Fonctionnalité parente (optionnel)
              </label>
              <select
                id="parentFeatureId"
                {...register("parentFeatureId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                disabled={isSubmitting || isLoading}
              >
                <option value="">Aucune fonctionnalité parente</option>

                {/* Affichage groupé par statut */}
                {Object.entries(groupedFeatures).map(([status, features]) => {
                  const typedStatus = status as keyof typeof statusLabels;
                  return (
                    <optgroup
                      key={status}
                      label={statusLabels[typedStatus] || status}
                    >
                      {features.map((availableFeature) => (
                        <option
                          key={availableFeature.id}
                          value={availableFeature.id}
                        >
                          {availableFeature.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>

              <div className="mt-1 text-xs text-gray-500">
                {availableFeatures.length > 0
                  ? `${availableFeatures.length} fonctionnalité(s) disponible(s)`
                  : "Aucune autre fonctionnalité dans ce projet"}
              </div>

              <p className="mt-1 text-xs text-gray-500">
                Permet de créer une hiérarchie entre les fonctionnalités
              </p>
            </div>

            {/* Informations du projet */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Informations du projet
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Nom:</span>
                  <span className="font-medium text-gray-900">
                    {project.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono text-xs">{projectId}</span>
                </div>
                {project.description && (
                  <div>
                    <span className="block">Description:</span>
                    <span className="text-gray-700 text-xs mt-1 block">
                      {project.description}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Informations de la fonctionnalité (en mode édition) */}
            {isEditing && feature && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-3">
                  Informations de la fonctionnalité
                </h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-mono text-xs">{feature.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Créée le:</span>
                    <span>
                      {new Date(feature.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modifiée le:</span>
                    <span>
                      {new Date(feature.updatedAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
