// components/models/projects/ProjectFilters.tsx
import React from "react";
import { Status } from "@/lib/generated/prisma/client";

type ProjectFiltersProps = {
  status?: string;
  setStatus: (status: string | undefined) => void;
  search: string;
  setSearch: (search: string) => void;
};

const statusOptions: { label: string; value: Status | "" }[] = [
  { label: "Tous", value: "" },
  { label: "À faire", value: "TODO" },
  { label: "En cours", value: "IN_PROGRESS" },
  { label: "À relire", value: "REVIEW" },
  { label: "Terminé", value: "DONE" },
  { label: "Bloqué", value: "BLOCKED" },
  { label: "Annulé", value: "CANCELLED" },
];

export function ProjectFilters({
  status,
  setStatus,
  search,
  setSearch,
}: ProjectFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
      {/* Recherche */}
      <input
        type="search"
        placeholder="Rechercher un projet..."
        className="border rounded px-3 py-2 w-full md:w-64"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Statut */}
      <select
        className="border rounded px-3 py-2"
        value={status || ""}
        onChange={(e) => setStatus(e.target.value || undefined)}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
