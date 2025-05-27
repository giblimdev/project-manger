// components/models/Projects/ProjectList.tsx
import React from "react";
import { Projects, Status } from "@/lib/generated/prisma/client";

type ProjectListProps = {
  projects: Projects[];
  view?: "grid" | "list";
  onSelectProject?: (project: Projects) => void;
};

export const statusLabel: Record<Status, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "À relire",
  DONE: "Terminé",
  BLOCKED: "Bloqué",
  CANCELLED: "Annulé",
};

export function ProjectList({
  projects,
  view = "grid",
  onSelectProject,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">Aucun projet trouvé.</div>
    );
  }

  if (view === "list") {
    return (
      <table className="min-w-full border rounded-md bg-white shadow">
        <thead>
          <tr>
            <th className="px-4 py-2">Nom</th>
            <th className="px-4 py-2">Statut</th>
            <th className="px-4 py-2">Priorité</th>
            <th className="px-4 py-2">Date de création</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="hover:bg-gray-50 cursor-pointer"
              onClick={() => onSelectProject?.(project)}
            >
              <td className="px-4 py-2 font-semibold">{project.name}</td>
              <td className="px-4 py-2">{statusLabel[project.status]}</td>
              <td className="px-4 py-2">{project.priority}</td>
              <td className="px-4 py-2">
                {new Date(project.createdAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">
                <button
                  className="text-blue-600 hover:underline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectProject?.(project);
                  }}
                >
                  Voir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Vue grille par défaut
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {projects.map((project) => (
        <div
          key={project.id}
          className="border rounded-lg p-4 bg-white shadow hover:shadow-lg transition cursor-pointer flex flex-col"
          onClick={() => onSelectProject?.(project)}
        >
          {project.image && (
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
          )}
          <h2 className="text-lg font-bold mb-1">{project.name}</h2>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
            {project.description}
          </p>
          <div className="flex items-center gap-2 mt-auto">
            <span className="px-2 py-1 text-xs rounded bg-gray-100">
              {statusLabel[project.status]}
            </span>
            <span className="ml-auto text-xs text-gray-400">
              {new Date(project.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
