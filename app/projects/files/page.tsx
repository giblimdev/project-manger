// app/files/page.tsx

"use client";
import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { ProjectSelected } from "@/components/ProjectSelected";
import { FileFilters } from "@/components/models/files/FileFilters";
import { FileTree } from "@/components/models/files/FileTree";
import { FileList } from "@/components/models/files/FileList";
import { Button } from "@/components/ui/button";
import { useProjectsStore } from "@/stores/useProjectStore";
import { useSession } from "@/lib/auth/auth-client";
import { LayoutGrid, List, TreePine, Info } from "lucide-react";
import { FileType, Status } from "@/lib/generated/prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FilesPage() {
  const { project: selectedProject } = useProjectsStore();
  const { data: session } = useSession();

  // États locaux pour l'interface
  const [view, setView] = useState<"grid" | "list" | "tree">("tree");
  const [typeFilter, setTypeFilter] = useState<FileType | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<Status | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Récupération des fichiers via SWR selon votre schéma
  const {
    data: files = [],
    error,
    isLoading,
    mutate,
  } = useSWR(
    selectedProject && session?.user?.id
      ? `/api/files?projectId=${selectedProject.id}`
      : null,
    fetcher
  );

  // Filtrage local des fichiers selon vos enums
  const filteredFiles = useMemo(() => {
    let result = files;

    if (typeFilter) {
      result = result.filter((file: any) => file.type === typeFilter);
    }

    if (statusFilter) {
      result = result.filter((file: any) => file.status === statusFilter);
    }

    if (searchQuery) {
      result = result.filter(
        (file: any) =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          file.fonctionnalities
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [files, typeFilter, statusFilter, searchQuery]);

  // Vérification selon votre schéma User
  if (!session?.user?.id) {
    return (
      <div className="container py-8">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Connexion requise
          </h3>
          <p className="text-gray-600">
            files/page : Vous devez être connecté pour accéder aux fichiers
            selon le modèle User
          </p>
        </div>
      </div>
    );
  }

  // Vérification selon votre schéma Projects
  if (!selectedProject) {
    return (
      <div className="container py-8">
        <ProjectSelected />
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun projet sélectionné
          </h3>
          <p className="text-gray-600">
            Sélectionnez un projet pour voir ses fichiers selon le modèle
            Projects
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="container py-8">
      {/* Affichage du projet sélectionné */}
      <div className="mb-6">
        <ProjectSelected />
      </div>

      {/* Header avec titre et boutons de vue */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Files - {selectedProject.name}
          </h1>
          <p className="text-sm text-gray-600">
            Gestion des fichiers selon le modèle Files de votre schéma Prisma
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === "tree" ? "default" : "outline"}
            onClick={() => setView("tree")}
            aria-label="Vue arbre"
            className="flex items-center gap-2"
          >
            <TreePine size={18} />
            Arbre
          </Button>
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
            <List size={18} />
            Liste
          </Button>
        </div>
      </div>

      {/* Composant de filtres selon vos enums */}
      <FileFilters
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Gestion des états de chargement et d'erreur */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="inline-flex items-center gap-2 text-gray-600">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            Chargement des fichiers selon votre modèle Files...
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <div className="text-red-600">
            Erreur lors du chargement des fichiers :{" "}
            {error.message || "Erreur inconnue"}
          </div>
          <Button onClick={() => mutate()} variant="outline" className="mt-3">
            Réessayer
          </Button>
        </div>
      ) : (
        <>
          {view === "tree" ? (
            <FileTree
              files={filteredFiles}
              onRefresh={mutate}
              projectId={selectedProject.id}
            />
          ) : (
            <FileList
              files={filteredFiles}
              view={view}
              onRefresh={mutate}
              projectId={selectedProject.id}
            />
          )}
        </>
      )}

      {/* Statistiques avec IDs selon votre schéma */}
      {!isLoading && !error && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {filteredFiles.length} fichier
              {filteredFiles.length > 1 ? "s" : ""} selon le modèle Files
              {filteredFiles.length !== files.length && ` sur ${files.length}`}
            </span>
            <span className="font-mono text-xs">
              User.id: {session.user.id} | Projects.id: {selectedProject.id}
            </span>
          </div>
        </div>
      )}
    </main>
  );
}
