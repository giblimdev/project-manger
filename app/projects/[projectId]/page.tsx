// app/projects/[projectId]/page.tsx

"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { ProjectList } from "@/components/models/projects/ProjectList";
import { ProjectFilters } from "@/components/models/projects/ProjectFilters";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { useProjectsStoreHydrated } from "@/hooks/useProjectsStoreHydrated";
import ProjectNav from "@/components/models/projects/ProjectNav";
import { ProjectSelected } from "@/components/ProjectSelected";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProjectsPage() {
  const {
    data: projects = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/api/projects", fetcher);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [view, setView] = useState<"grid" | "list">("grid");

  // ✅ Utilise le hook hydraté
  const { project: selectedProject } = useProjectsStoreHydrated();

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (status) {
      result = result.filter((p: any) => p.status === status);
    }
    if (search) {
      result = result.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [projects, status, search]);

  const handleRefresh = () => {
    mutate();
  };

  return (
    <main className="container py-8">
      {/* Header avec titre et boutons de vue */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Mes projets</h1>
        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
            aria-label="Vue grille"
            className="flex items-center gap-2"
          >
            <LayoutGrid size={18} />
            Grille
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            aria-label="Vue liste"
            className="flex items-center gap-2"
          >
            <ListIcon size={18} />
            Liste
          </Button>
        </div>
      </div>

      {/* Composant de filtres */}
      <ProjectFilters
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
      />

      {/* Gestion des états de chargement et d'erreur */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Chargement des projets...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-600">Erreur : {error.message}</div>
        </div>
      ) : (
        <ProjectList
          projects={filteredProjects}
          view={view}
          onRefresh={handleRefresh}
        />
      )}

      {/* Section projet sélectionné */}
      <section className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm font-medium text-blue-800">
            {selectedProject
              ? `Vous travaillez actuellement sur le projet : ${selectedProject.name}`
              : "Aucun projet sélectionné"}
          </span>
        </div>
        {selectedProject && selectedProject.description && (
          <p className="text-sm text-blue-600 mt-2 ml-5">
            {selectedProject.description}
          </p>
        )}
      </section>

      {/* Navigation et détails du projet */}
      <section className="mt-8 space-y-6">
        <ProjectNav />
        <ProjectSelected />
      </section>
    </main>
  );
}
