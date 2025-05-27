// components/models/ProjectForm.tsx
"use client";
import React, { useState } from "react";
import { Status } from "@/lib/generated/prisma/client";
import { z } from "zod";

// Déclare et exporte statusLabel ici
export const statusLabel: Record<Status, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "À relire",
  DONE: "Terminé",
  BLOCKED: "Bloqué",
  CANCELLED: "Annulé",
};

const statusEnum = z.enum([
  "TODO",
  "IN_PROGRESS",
  "REVIEW",
  "DONE",
  "BLOCKED",
  "CANCELLED",
]);

const projectFormSchema = z.object({
  name: z.string().min(1, "Le nom du projet est requis"),
  description: z.string().optional(),
  image: z.string().url("URL invalide").or(z.literal("")).optional(),
  status: statusEnum.default("TODO"),
  priority: z.number().int().min(1).default(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  teamIds: z.array(z.string().uuid()).optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

type ProjectFormProps = {
  initialValues?: Partial<ProjectFormValues>;
  onSubmit: (values: ProjectFormValues) => Promise<void> | void;
  loading?: boolean;
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
    priority: initialValues?.priority || 1,
    startDate: initialValues?.startDate || "",
    endDate: initialValues?.endDate || "",
    teamIds: initialValues?.teamIds || [],
  });
  const [error, setError] = useState<string | null>(null);

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
        />
      </div>
      <div>
        <label className="block font-semibold">Description</label>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
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
        />
      </div>
      <div>
        <label className="block font-semibold">Statut</label>
        <select
          name="status"
          value={values.status}
          onChange={handleChange}
          className="border rounded px-3 py-2 w-full"
        >
          {statusEnum.options.map((s) => (
            <option key={s} value={s}>
              {statusLabel[s as Status] || s}
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
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
