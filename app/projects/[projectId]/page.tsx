// app/projects/[projectId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Status } from "@/lib/generated/prisma/client";
import { statusLabel } from "@/components/models/projects/ProjectForm";
import { Button } from "@/components/ui/button";

type Project = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  status: Status;
  priority: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
  teams?: { id: string; name: string }[];
  // Ajoute d'autres relations si besoin
};

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;
    setLoading(true);
    fetch(`/api/projects?id=${projectId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Projet introuvable");
        const data = await res.json();
        setProject(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!project) return <div className="p-8">Projet introuvable.</div>;

  return (
    <main className="container py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {project.image && (
          <img
            src={project.image}
            alt={project.name}
            className="w-full max-w-xs rounded shadow"
          />
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2 py-1 text-xs rounded bg-gray-100">
              Statut : {statusLabel[project.status]}
            </span>
            <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
              Priorité : {project.priority}
            </span>
          </div>
          <p className="mb-4 text-gray-700">{project.description}</p>
          <div className="mb-2 text-sm text-gray-500">
            Créé le : {new Date(project.createdAt).toLocaleDateString()}
            {project.startDate && (
              <> | Début : {new Date(project.startDate).toLocaleDateString()}</>
            )}
            {project.endDate && (
              <> | Fin : {new Date(project.endDate).toLocaleDateString()}</>
            )}
          </div>
          {project.teams && project.teams.length > 0 && (
            <div className="mb-2">
              <span className="font-semibold">Équipes : </span>
              {project.teams.map((team) => (
                <span
                  key={team.id}
                  className="inline-block mr-2 px-2 py-1 bg-gray-200 rounded"
                >
                  {team.name}
                </span>
              ))}
            </div>
          )}
          {/* Ajoute ici boutons d'édition, d'ajout de tâche, etc. */}
          <div className="mt-4 flex gap-2">
            <Button variant="outline">Éditer</Button>
            <Button variant="destructive">Supprimer</Button>
          </div>
        </div>
      </div>
      {/* Tu peux ajouter ici des onglets pour tâches, user stories, fichiers, etc. */}
    </main>
  );
}
