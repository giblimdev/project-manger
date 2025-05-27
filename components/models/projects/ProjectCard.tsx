// components/models/ProjectCard.tsx
import React from "react";
import { Projects, Status } from "@/lib/generated/prisma/client";

// Optionnel : label de statut pour affichage humain
const statusLabel: Record<Status, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "À relire",
  DONE: "Terminé",
  BLOCKED: "Bloqué",
  CANCELLED: "Annulé",
};

type ProjectCardProps = {
  project: Projects;
  onClick?: (project: Projects) => void;
  selected?: boolean;
};

export function ProjectCard({ project, onClick, selected }: ProjectCardProps) {
  return (
    <div
      className={`border rounded-lg p-4 bg-white shadow hover:shadow-lg transition cursor-pointer flex flex-col ${
        selected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => onClick?.(project)}
      tabIndex={0}
      aria-selected={selected}
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
        <span
          className={`px-2 py-1 text-xs rounded ${
            project.status === "DONE"
              ? "bg-green-100 text-green-700"
              : project.status === "IN_PROGRESS"
                ? "bg-blue-100 text-blue-700"
                : project.status === "BLOCKED"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
          }`}
        >
          {statusLabel[project.status]}
        </span>
        <span className="ml-auto text-xs text-gray-400">
          {new Date(project.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
