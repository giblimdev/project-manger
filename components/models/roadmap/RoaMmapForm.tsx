import React, { useState, useEffect } from "react";
import { RoadMap } from "@/lib/generated/prisma/client";

interface RoadMapFormProps {
  roadmap?: RoadMap;
  themas: string[];
  onCancel: () => void;
  onSuccess: () => void;
}

type RoadMapFormState = Omit<RoadMap, "id" | "createdAt" | "updatedAt">;

const defaultForm: RoadMapFormState = {
  title: "",
  description: "",
  phase: "",
  estimatedDays: 1,
  progress: 0,
  ordre: 100, // <-- Ajouté pour correspondre au modèle Prisma
  deliverables: "",
  technologies: "",
  dependencies: "",
  priority: "Moyenne",
  startDate: null,
  endDate: null,
  projectId: "",
  creatorId: null,
};

function dateToInput(d?: Date | null) {
  return d ? new Date(d).toISOString().slice(0, 10) : "";
}

function inputToDate(value: string): Date | null {
  return value ? new Date(value) : null;
}

export default function RoadMapForm({
  roadmap,
  themas,
  onCancel,
  onSuccess,
}: RoadMapFormProps) {
  const [form, setForm] = useState<RoadMapFormState>(
    roadmap
      ? {
          ...roadmap,
          startDate: roadmap.startDate ? new Date(roadmap.startDate) : null,
          endDate: roadmap.endDate ? new Date(roadmap.endDate) : null,
        }
      : defaultForm
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (roadmap) {
      setForm({
        ...roadmap,
        startDate: roadmap.startDate ? new Date(roadmap.startDate) : null,
        endDate: roadmap.endDate ? new Date(roadmap.endDate) : null,
      });
    } else {
      setForm(defaultForm);
    }
  }, [roadmap]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      setForm((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    } else if (type === "date") {
      setForm((prev) => ({
        ...prev,
        [name]: inputToDate(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = roadmap ? "PUT" : "POST";
    const url = roadmap ? `/api/roadmap/${roadmap.id}` : `/api/roadmap`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la sauvegarde de la feuille de route");
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const Required = () => <span className="text-red-500 ml-1">*</span>;

  return (
    <form
      className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto border border-gray-200"
      onSubmit={handleSubmit}
      aria-label={
        roadmap ? "Modifier la feuille de route" : "Créer une feuille de route"
      }
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        {roadmap
          ? "Modifier la feuille de route"
          : "Créer une feuille de route"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block font-semibold mb-1">
            Titre <Required />
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
            autoFocus
            placeholder="Titre de la feuille de route"
          />
        </div>

        <div>
          <label htmlFor="phase" className="block font-semibold mb-1">
            Phase <Required />
          </label>
          <select
            id="phase"
            name="phase"
            value={form.phase}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-blue-400 transition"
          >
            <option value="">-- Sélectionner --</option>
            {themas.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="estimatedDays" className="block font-semibold mb-1">
            Jours estimés <Required />
          </label>
          <input
            id="estimatedDays"
            type="number"
            name="estimatedDays"
            value={form.estimatedDays}
            min={1}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block font-semibold mb-1">
            Priorité <Required />
          </label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-blue-400 transition"
          >
            <option value="Haute">Haute</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>
        </div>

        <div>
          <label htmlFor="ordre" className="block font-semibold mb-1">
            Ordre <Required />
          </label>
          <input
            id="ordre"
            type="number"
            name="ordre"
            value={form.ordre}
            min={1}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
            placeholder="Ordre d'affichage"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block font-semibold mb-1">
            Début
          </label>
          <input
            id="startDate"
            type="date"
            name="startDate"
            value={dateToInput(form.startDate)}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block font-semibold mb-1">
            Fin
          </label>
          <input
            id="endDate"
            type="date"
            name="endDate"
            value={dateToInput(form.endDate)}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="description" className="block font-semibold mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
          placeholder="Description détaillée..."
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="progress" className="block font-semibold mb-1">
            Progression (%)
          </label>
          <input
            id="progress"
            type="number"
            name="progress"
            value={form.progress}
            min={0}
            max={100}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
          />
        </div>
        <div>
          <label htmlFor="deliverables" className="block font-semibold mb-1">
            Livrables
          </label>
          <input
            id="deliverables"
            type="text"
            name="deliverables"
            value={form.deliverables}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
            placeholder="Livrables attendus"
          />
        </div>
        <div>
          <label htmlFor="technologies" className="block font-semibold mb-1">
            Technologies
          </label>
          <input
            id="technologies"
            type="text"
            name="technologies"
            value={form.technologies}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
            placeholder="Techno utilisées"
          />
        </div>
        <div>
          <label htmlFor="dependencies" className="block font-semibold mb-1">
            Dépendances
          </label>
          <input
            id="dependencies"
            type="text"
            name="dependencies"
            value={form.dependencies}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
            placeholder="Dépendances éventuelles"
          />
        </div>
      </div>

      {!roadmap && (
        <div className="mt-6">
          <label htmlFor="projectId" className="block font-semibold mb-1">
            Projet <Required />
          </label>
          <input
            id="projectId"
            type="text"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-blue-400 transition"
            placeholder="ID du projet"
          />
        </div>
      )}

      {error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}

      <div className="flex justify-end gap-2 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg border border-gray-300 transition"
          disabled={loading}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold shadow transition"
          disabled={loading}
        >
          {loading ? "Enregistrement..." : roadmap ? "Enregistrer" : "Créer"}
        </button>
      </div>
    </form>
  );
}
