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

// Schéma de validation Zod
const projectFormSchema = z.object({
  name: z.string().min(1, "Le nom du projet est requis"),
  description: z.string().optional(),
  image: z.string().url("URL invalide").or(z.literal("")).optional(),
  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED", "CANCELLED"])
    .default("TODO"),
  priority: z.coerce.number().int().min(1).default(1),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .or(z.literal(""))
    .optional(),
  endDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .or(z.literal(""))
    .optional(),
  teamIds: z.array(z.string().uuid()).optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type ProjectFormProps = {
  initialValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
  loading?: boolean; // <-- Correction ici
  teamsOptions?: { id: string; name: string }[];
};

export function ProjectForm({
  initialValues,
  onSubmit,
  loading = false,
  teamsOptions = [],
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    image: initialValues?.image || "",
    status: initialValues?.status || "TODO",
    priority: initialValues?.priority ?? 1,
    startDate: initialValues?.startDate || "",
    endDate: initialValues?.endDate || "",
    teamIds: initialValues?.teamIds || [],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialValues) {
      setValues({
        name: initialValues.name || "",
        description: initialValues.description || "",
        image: initialValues.image || "",
        status: initialValues.status || "TODO",
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
    setError(null);
    const parse = projectFormSchema.safeParse(values);
    if (!parse.success) {
      setError(parse.error.errors[0]?.message || "Erreur de validation");
      return;
    }
    await onSubmit(parse.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div>
        <label className="block font-semibold">Nom du projet *</label>
        <input
          name="name"
          value={values.name}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold">Image (URL)</label>
        <input
          name="image"
          value={values.image}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          placeholder="https://..."
          type="url"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold">Statut</label>
        <select
          name="status"
          value={values.status}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        >
          {Object.entries(statusLabel).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold">Priorité</label>
        <input
          name="priority"
          type="number"
          min={1}
          value={values.priority}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold">Date de début</label>
        <input
          name="startDate"
          type="date"
          value={values.startDate}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block font-semibold">Date de fin</label>
        <input
          name="endDate"
          type="date"
          value={values.endDate}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
          disabled={loading}
        />
      </div>
      {teamsOptions.length > 0 && (
        <div>
          <label className="block font-semibold">Équipes</label>
          <select
            name="teamIds"
            multiple
            value={values.teamIds}
            onChange={handleTeamChange}
            className="border rounded px-3 py-2 w-full"
            disabled={loading}
          >
            {teamsOptions.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
      >
        {loading
          ? "Enregistrement..."
          : initialValues
            ? "Mettre à jour"
            : "Créer"}
      </button>
    </form>
  );
}
