// components/models/ProjectList.tsx

"use client";
import React, { useState } from "react";
import { Projects, Status } from "@/lib/generated/prisma/client";
import { ProjectForm } from "@/components/models/projects/ProjectForm";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useProjectsStore } from "@/stores/useProjectStore";

// Utilitaire pour transformer un projet Prisma en valeurs compatibles ProjectForm
function normalizeProjectForForm(project: Projects) {
  return {
    name: project.name,
    description: project.description ?? "",
    status: project.status,
    image: project.image ?? "",
    priority: project.priority,
    startDate: project.startDate
      ? new Date(project.startDate).toISOString().slice(0, 10)
      : "",
    endDate: project.endDate
      ? new Date(project.endDate).toISOString().slice(0, 10)
      : "",
    teamIds: [], // À adapter selon votre logique d'équipes
  };
}

export const statusLabel: Record<Status, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "À relire",
  DONE: "Terminé",
  BLOCKED: "Bloqué",
  CANCELLED: "Annulé",
};

const statusColors: Record<Status, string> = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  REVIEW: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-800",
  BLOCKED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-500",
};

type ProjectListProps = {
  projects: Projects[] | undefined | null;
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onRefresh?: () => void;
  view?: "grid" | "list";
  onSelectProject?: (project: Projects) => void;
};

export function ProjectList({
  projects,
  total,
  page = 1,
  pageSize = 9,
  onPageChange,
  onRefresh,
  view = "grid",
  onSelectProject,
}: ProjectListProps) {
  // Sécurise projects pour éviter .map is not a function
  const safeProjects = Array.isArray(projects) ? projects : [];

  // État local pour la modale
  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState<Projects | null>(null);
  const [loading, setLoading] = useState(false);

  // Store pour le projet sélectionné
  const {
    project: selectedProject,
    setProject,
    setProjectId,
  } = useProjectsStore();

  const pageCount = total ? Math.ceil(total / pageSize) : 1;

  // Handler pour sélectionner un projet
  const handleSelectProject = (project: Projects) => {
    setProject(project);
    setProjectId(project.id);
    onSelectProject?.(project);
    console.log("✅ Projet sélectionné:", project.name);
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Êtes-vous sûr de vouloir supprimer le projet "${name}" ?\n\nCette action supprimera également toutes les données liées et ne peut pas être annulée.`
      )
    )
      return;

    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      // Si le projet supprimé était sélectionné, le désélectionner
      if (selectedProject?.id === id) {
        setProject(null);
        setProjectId(null);
      }

      console.log("✅ Projet supprimé avec succès");
      onRefresh?.();
    } catch (error) {
      console.error("❌ Erreur lors de la suppression:", error);
      alert(
        `Erreur lors de la suppression: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Projects, event: React.MouseEvent) => {
    event.stopPropagation(); // Empêche la sélection du projet
    setEditProject(project);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditProject(null);
    setShowModal(true);
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const method = editProject ? "PUT" : "POST";
      const url = editProject
        ? `/api/projects/${editProject.id}`
        : `/api/projects`;

      // ✅ CORRECTION : Nettoyage des données selon votre route API
      const cleanedData = {
        name: data.name?.trim() || "",
        description: data.description?.trim() || undefined, // undefined pour route API
        image: data.image?.trim() || undefined, // undefined pour route API
        status: data.status || "TODO",
        priority: Number(data.priority) || 1,
        startDate: data.startDate || undefined, // Format YYYY-MM-DD ou undefined
        endDate: data.endDate || undefined, // Format YYYY-MM-DD ou undefined
        teamIds: Array.isArray(data.teamIds) ? data.teamIds : [],
      };

      console.log("📤 Données envoyées:", cleanedData);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ Erreur API:", errorData);

        // Affichage détaillé des erreurs de validation
        if (errorData.details) {
          const errorMessages = Object.entries(errorData.details)
            .map(
              ([field, messages]) =>
                `${field}: ${Array.isArray(messages) ? messages.join(", ") : messages}`
            )
            .join("\n");
          throw new Error(`${errorData.error}\n\nDétails:\n${errorMessages}`);
        }

        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Résultat:", result);

      // Mettre à jour le projet sélectionné si c'est celui qui a été modifié
      if (editProject && selectedProject?.id === editProject.id) {
        setProject(result);
      }

      console.log(editProject ? "✅ Projet mis à jour" : "✅ Projet créé");
      setShowModal(false);
      setEditProject(null);
      onRefresh?.();
    } catch (error) {
      console.error("❌ Erreur lors de la soumission:", error);
      alert(
        `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Liste */}
      {safeProjects.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun projet trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par créer votre premier projet.
          </p>
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus size={18} />
            Créer un projet
          </Button>
        </div>
      ) : view === "list" ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priorité
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de création
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {safeProjects.map((project) => (
                <tr
                  key={project.id}
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedProject?.id === project.id
                      ? "bg-blue-50 border-l-4 border-l-blue-500"
                      : ""
                  }`}
                  onClick={() => handleSelectProject(project)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.name}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {project.name}
                        </div>
                        {project.description && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {project.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[project.status]}`}
                    >
                      {statusLabel[project.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.priority}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(project.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleEdit(project, e)}
                        title="Modifier"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(project.id, project.name);
                        }}
                        disabled={loading}
                        title="Supprimer"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeProjects.map((project) => (
            <div
              key={project.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group ${
                selectedProject?.id === project.id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : ""
              }`}
              onClick={() => handleSelectProject(project)}
            >
              {project.image && (
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-48 object-cover"
                />
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
                    {project.name}
                  </h3>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${statusColors[project.status]}`}
                  >
                    {statusLabel[project.status]}
                  </span>
                </div>

                {project.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Priorité: {project.priority}</span>
                  <span>{formatDate(project.createdAt)}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleEdit(project, e)}
                      title="Modifier"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id, project.name);
                      }}
                      disabled={loading}
                      title="Supprimer"
                      className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {selectedProject?.id === project.id && (
                    <div className="flex items-center text-blue-600 text-xs font-medium">
                      <Eye size={14} className="mr-1" />
                      Sélectionné
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex justify-center items-center gap-4 pt-6">
          <Button
            variant="outline"
            onClick={() => onPageChange?.(page - 1)}
            disabled={page === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Précédent
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} sur {pageCount}
          </span>
          <Button
            variant="outline"
            onClick={() => onPageChange?.(page + 1)}
            disabled={page === pageCount}
            className="flex items-center gap-2"
          >
            Suivant
            <ChevronRight size={16} />
          </Button>
        </div>
      )}

      {/* Bouton Ajouter */}
      <div className="flex justify-end mt-8">
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus size={18} />
          Ajouter un projet
        </Button>
      </div>

      {/* Modale Add/Edit */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editProject
                  ? `Modifier "${editProject.name}"`
                  : "Créer un nouveau projet"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </Button>
            </div>

            <div className="p-6">
              <ProjectForm
                initialValues={
                  editProject ? normalizeProjectForForm(editProject) : undefined
                }
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
