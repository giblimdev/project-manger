// components/models/ProjectForm.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Status } from "@/lib/generated/prisma/client";
import { z } from "zod";

// Labels de statut (exporté pour réutilisation)
export const statusLabel: Record<Status, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "À relire",
  DONE: "Terminé",
  BLOCKED: "Bloqué",
  CANCELLED: "Annulé",
};

// Schéma de validation Zod corrigé selon le schéma Prisma
const projectFormSchema = z
  .object({
    name: z
      .string()
      .min(1, "Le nom du projet est requis")
      .max(255, "Nom trop long"),
    description: z.string().optional(),
    image: z.string().url("URL invalide").optional().or(z.literal("")),
    status: z.nativeEnum(Status).default(Status.TODO),
    priority: z.coerce.number().int().min(1).max(10).default(1),
    startDate: z
      .string()
      .optional()
      .transform((val) => (val && val !== "" ? new Date(val) : undefined)),
    endDate: z
      .string()
      .optional()
      .transform((val) => (val && val !== "" ? new Date(val) : undefined)),
    teamIds: z.array(z.string().uuid()).optional().default([]),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    {
      message: "La date de fin doit être postérieure à la date de début",
      path: ["endDate"],
    }
  );

type ProjectFormValues = z.infer<typeof projectFormSchema>;

// Type pour les valeurs du formulaire (avant transformation)
type ProjectFormInputs = {
  name: string;
  description?: string;
  image?: string;
  status: Status;
  priority: number;
  startDate?: string;
  endDate?: string;
  teamIds?: string[];
};

type ProjectFormProps = {
  initialValues?: Partial<ProjectFormInputs>;
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
  loading?: boolean;
  teamsOptions?: { id: string; name: string }[];
  mode?: "create" | "edit"; // Nouveau prop pour différencier création/édition
};

export function ProjectForm({
  initialValues,
  onSubmit,
  loading = false,
  teamsOptions = [],
  mode = "create",
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormInputs>({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    image: initialValues?.image || "",
    status: initialValues?.status || Status.TODO,
    priority: initialValues?.priority ?? 1,
    startDate: initialValues?.startDate || "",
    endDate: initialValues?.endDate || "",
    teamIds: initialValues?.teamIds || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name || "",
        description: initialValues.description || "",
        image: initialValues.image || "",
        status: initialValues.status || Status.TODO,
        priority: initialValues.priority ?? 1,
        startDate: initialValues.startDate || "",
        endDate: initialValues.endDate || "",
        teamIds: initialValues.teamIds || [],
      });
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Nettoyer l'erreur pour ce champ
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    setValues((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions).map(
      (opt) => opt.value
    );
    setValues((prev) => ({
      ...prev,
      teamIds: selected,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const parseResult = projectFormSchema.safeParse(values);

      if (!parseResult.success) {
        const fieldErrors: Record<string, string> = {};
        parseResult.error.errors.forEach((error) => {
          const field = error.path[0] as string;
          fieldErrors[field] = error.message;
        });
        setErrors(fieldErrors);
        return;
      }

      await onSubmit(parseResult.data);
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      setErrors({
        submit:
          error instanceof Error
            ? error.message
            : "Erreur lors de la soumission",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = loading || isSubmitting;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nom du projet */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nom du projet *
          </label>
          <input
            name="name"
            value={values.name}
            onChange={handleChange}
            required
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isDisabled}
            placeholder="Entrez le nom du projet"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={values.description}
            onChange={handleChange}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isDisabled}
            placeholder="Décrivez votre projet..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        {/* Image URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Image (URL)
          </label>
          <input
            name="image"
            type="url"
            value={values.image}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.image ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isDisabled}
            placeholder="https://exemple.com/image.jpg"
          />
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
        </div>

        {/* Statut */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Statut
          </label>
          <select
            name="status"
            value={values.status}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.status ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isDisabled}
          >
            {Object.entries(statusLabel).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">{errors.status}</p>
          )}
        </div>

        {/* Priorité */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Priorité (1-10)
          </label>
          <input
            name="priority"
            type="number"
            min={1}
            max={10}
            value={values.priority}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.priority ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isDisabled}
          />
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
          )}
        </div>

        {/* Date de début */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date de début
          </label>
          <input
            name="startDate"
            type="date"
            value={values.startDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.startDate ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isDisabled}
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
          )}
        </div>

        {/* Date de fin */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Date de fin
          </label>
          <input
            name="endDate"
            type="date"
            value={values.endDate}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.endDate ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isDisabled}
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
          )}
        </div>

        {/* Équipes (si disponibles) */}
        {teamsOptions.length > 0 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Équipes assignées
            </label>
            <select
              name="teamIds"
              multiple
              value={values.teamIds}
              onChange={handleTeamChange}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.teamIds ? "border-red-500" : "border-gray-300"
              }`}
              disabled={isDisabled}
              size={Math.min(teamsOptions.length, 5)}
            >
              {teamsOptions.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Maintenez Ctrl (ou Cmd) pour sélectionner plusieurs équipes
            </p>
            {errors.teamIds && (
              <p className="mt-1 text-sm text-red-600">{errors.teamIds}</p>
            )}
          </div>
        )}
      </div>

      {/* Erreur générale */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      {/* Boutons d'action */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <button
          type="submit"
          disabled={isDisabled}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          }`}
        >
          {isSubmitting
            ? "Enregistrement..."
            : mode === "edit"
              ? "Mettre à jour"
              : "Créer le projet"}
        </button>
      </div>
    </form>
  );
}
