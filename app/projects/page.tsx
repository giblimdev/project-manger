// app/projects/page.tsx

"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { ProjectList } from "@/components/models/projects/ProjectList";
import { ProjectFilters } from "@/components/models/projects/ProjectFilters";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import { useProjectsStore } from "@/stores/useProjectStore";
import { ProjectSelected } from "@/components/ProjectSelected";

// Fetcher pour SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProjectsPage() {
  // Utilise SWR pour charger les projets
  const {
    data: projects = [],
    error,
    isLoading,
    mutate,
  } = useSWR("/api/projects", fetcher);

  // État local pour la recherche, filtres et vue
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [view, setView] = useState<"grid" | "list">("grid");

  // Store pour le projet sélectionné
  const { project: selectedProject } = useProjectsStore();

  // Filtrage local
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

  // Fonction de rafraîchissement pour ProjectList
  const handleRefresh = () => {
    mutate();
  };

  return (
    <main className="container py-8">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex gap-2">
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
            aria-label="Vue grille"
          >
            <LayoutGrid size={18} />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
            aria-label="Vue liste"
          >
            <ListIcon size={18} />
          </Button>
        </div>
      </div>

      <ProjectFilters
        status={status}
        setStatus={setStatus}
        search={search}
        setSearch={setSearch}
      />

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Chargement...</div>
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

      <section>
        <div>
          <ProjectSelected />
        </div>
      </section>
    </main>
  );
}
