// app/projects/page.tsx
"use client";

import { useState, useMemo } from "react";
import useSWR, { mutate } from "swr";
import { useProjectsStore } from "@/stores/useProjectsStore";
import { ProjectList } from "@/components/models/projects/ProjectList";
import { ProjectFilters } from "@/components/models/projects/ProjectFilters";
import { ProjectForm } from "@/components/models/projects/ProjectForm";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-Modal";
import { LayoutGrid, List as ListIcon, Plus } from "lucide-react";

// Fonction pour nettoyer les données avant POST
function cleanProjectData(data: any) {
  return Object.fromEntries(
    Object.entries(data).filter(
      ([, v]) =>
        v !== undefined &&
        v !== null &&
        (typeof v !== "string" || v.trim() !== "") &&
        (!Array.isArray(v) || v.length > 0)
    )
  );
}

// Fetcher pour SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProjectsPage() {
  // Utilise SWR pour charger les projets
  const {
    data: projects = [],
    error,
    isLoading,
  } = useSWR("/api/projects", fetcher);

  // Store pour le projet sélectionné
  const { setProject, setProjectId } = useProjectsStore();

  // État local pour la recherche, filtres et vue
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [view, setView] = useState<"grid" | "list">("grid");

  // Modale de création de projet
  const modal = useModal();

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

  // Handler création projet (ouvre la modale)
  const onCreateProject = () => modal.open();

  // Handler soumission du formulaire avec rafraîchissement SWR
  const handleProjectSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanProjectData(data)),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du projet");
      }

      // Ferme la modale
      modal.close();

      // Rafraîchit les données via SWR
      mutate("/api/projects");
    } catch (error) {
      console.error("Erreur:", error);
      // Gestion d'erreur ici (toast, notification, etc.)
    }
  };

  return (
    <main className="container py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Mes projets</h1>
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
        <div>Chargement...</div>
      ) : error ? (
        <div className="text-red-500">Erreur : {error.message}</div>
      ) : (
        <ProjectList
          projects={filteredProjects}
          view={view}
          onSelectProject={(project) => {
            setProject(project);
            setProjectId(project.id);
          }}
        />
      )}

      {/* Bouton d'ajout en bas à droite */}
      <div className="flex justify-end mt-8">
        <Button onClick={onCreateProject} className="flex items-center gap-2">
          <Plus size={18} />
          Nouveau projet
        </Button>
      </div>

      {/* Modale de création de projet */}
      {modal.isOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={modal.onBackdropClick}
        >
          <div
            ref={modal.dialogRef}
            tabIndex={-1}
            className="bg-white p-6 rounded-lg shadow-lg min-w-[320px] max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Créer un projet</h2>
            <ProjectForm onSubmit={handleProjectSubmit} />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={modal.close}>
                Annuler
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
