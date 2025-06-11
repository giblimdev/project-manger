// components/models/files/FileList.tsx

"use client";
import React, { useState } from "react";
import { Files, FileType, Status } from "@/lib/generated/prisma/client";
import { FileCard } from "./FileCard";
import { FileForm } from "./FileForm";
import { Button } from "@/components/ui/button";
import { Plus, X, MoveUp, MoveDown } from "lucide-react";

type FileListProps = {
  files: Files[];
  view: "grid" | "list";
  onRefresh: () => void;
  projectId: string;
};

export function FileList({ files, view, onRefresh, projectId }: FileListProps) {
  const [showModal, setShowModal] = useState(false);
  const [editFile, setEditFile] = useState<Files | null>(null);
  const [selectedFile, setSelectedFile] = useState<Files | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState<string | null>(null);

  // ✅ Fonction mise à jour pour utiliser la nouvelle route API
  const handleOrderChange = async (
    fileId: string,
    newOrder: number,
    orderType: "order" | "devorder"
  ) => {
    setOrderLoading(fileId);
    try {
      const response = await fetch(`/api/files/${fileId}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [orderType]: newOrder,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const result = await response.json();
      console.log(`✅ ${result.message} - ${orderType}: ${newOrder}`);

      // Rafraîchir la liste pour voir les changements
      onRefresh();
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert(
        `Erreur lors de la mise à jour de l'ordre: ${
          error instanceof Error ? error.message : "Erreur inconnue"
        }`
      );
    } finally {
      setOrderLoading(null);
    }
  };

  // ✅ Fonctions pour incrémenter/décrémenter l'ordre
  const handleMoveUp = (file: Files, orderType: "order" | "devorder") => {
    const currentOrder = orderType === "order" ? file.order : file.devorder;
    const newOrder = Math.max(1, currentOrder - 1); // Minimum 1
    handleOrderChange(file.id, newOrder, orderType);
  };

  const handleMoveDown = (file: Files, orderType: "order" | "devorder") => {
    const currentOrder = orderType === "order" ? file.order : file.devorder;
    const newOrder = currentOrder + 1;
    handleOrderChange(file.id, newOrder, orderType);
  };

  // Handler pour créer un nouveau fichier
  const handleCreate = () => {
    console.log("🔥 Bouton Nouveau fichier cliqué");
    setEditFile(null);
    setShowModal(true);
  };

  // Handler pour modifier un fichier existant
  const handleEdit = (file: Files) => {
    console.log("✏️ Édition du fichier:", file.name);
    setEditFile(file);
    setShowModal(true);
  };

  // Handler pour supprimer un fichier
  const handleDelete = async (fileId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?"))
      return;

    setLoading(true);
    try {
      const response = await fetch(`/api/files/${fileId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      onRefresh();
    } catch (error) {
      alert("Erreur lors de la suppression");
    } finally {
      setLoading(false);
    }
  };

  // Handler pour soumettre le formulaire
  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const cleanedData = {
        name: data.name.trim(),
        extension: data.extension?.trim() || null,
        url: data.url.trim(),
        type: data.type,
        description: data.description?.trim() || null,
        fonctionnalities: data.fonctionnalities?.trim() || null,
        import: data.import?.trim() || null,
        export: data.export?.trim() || null,
        useby: data.useby?.trim() || null,
        script: data.script?.trim() || null,
        version: data.version?.trim() || null,
        category: data.category || "dossier",
        order: Number(data.order) || 100,
        devorder: Number(data.devorder) || 100,
        status: data.status || "TODO",
        parentFileId: data.parentFileId || null,
        projectId,
      };

      const method = editFile ? "PUT" : "POST";
      const url = editFile ? `/api/files/${editFile.id}` : `/api/files`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      console.log("✅ Fichier", editFile ? "mis à jour" : "créé");
      setShowModal(false);
      setEditFile(null);
      onRefresh();
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert(
        `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: Files) => {
    setSelectedFile(file);
  };

  const safeFiles = Array.isArray(files) ? files : [];

  return (
    <div className="space-y-6">
      {/* BOUTON PRINCIPAL */}
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div>
          <h3 className="font-medium text-blue-900">Gestion des fichiers</h3>
          {selectedFile && (
            <div className="text-sm text-blue-600">
              Fichier sélectionné : {selectedFile.name}
            </div>
          )}
        </div>
        <Button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          disabled={loading}
        >
          <Plus size={18} />
          Nouveau fichier
        </Button>
      </div>

      {/* Affichage des fichiers */}
      {safeFiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun fichier trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par créer votre premier fichier
          </p>
          <Button
            onClick={handleCreate}
            className="flex items-center gap-2"
            disabled={loading}
          >
            <Plus size={18} />
            Créer le premier fichier
          </Button>
        </div>
      ) : (
        <>
          {view === "list" ? (
            /* Vue liste avec tableau */
            <div className="bg-white rounded-lg shadow border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Path
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fichier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Catégorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Version
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ordre
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {safeFiles.map((file) => (
                    <tr
                      key={file.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedFile?.id === file.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleFileSelect(file)}
                    >
                      {/* CELLULE PATH */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700 max-w-xs truncate">
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                              title={file.url}
                            >
                              {file.url}
                            </a>
                          </code>
                        </div>
                      </td>

                      {/* CELLULE FICHIER */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {file.extension || "📄"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {file.name}
                            </div>
                            {file.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {file.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* CELLULE CATÉGORIE */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            file.category === "dossier"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {file.category === "dossier"
                            ? "📁 Dossier"
                            : "📄 Fichier"}
                        </span>
                      </td>

                      {/* CELLULE TYPE */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          {file.type}
                        </span>
                      </td>

                      {/* CELLULE STATUT */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            file.status === "DONE"
                              ? "bg-green-100 text-green-800"
                              : file.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-800"
                                : file.status === "BLOCKED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {file.status}
                        </span>
                      </td>

                      {/* CELLULE VERSION */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {file.version || "N/A"}
                      </td>

                      {/* ✅ CELLULE ORDRE AVEC ICÔNES UP/DOWN - MISE À JOUR */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-2">
                          {/* Ordre d'affichage */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 w-8">
                              Aff:
                            </span>
                            <span className="w-8 text-center">
                              {file.order}
                            </span>
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveUp(file, "order");
                                }}
                                disabled={orderLoading === file.id}
                                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 disabled:opacity-50 transition-colors"
                                title="Diminuer l'ordre d'affichage"
                              >
                                <MoveUp size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveDown(file, "order");
                                }}
                                disabled={orderLoading === file.id}
                                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 disabled:opacity-50 transition-colors"
                                title="Augmenter l'ordre d'affichage"
                              >
                                <MoveDown size={12} />
                              </button>
                            </div>
                          </div>

                          {/* Ordre de développement */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600 w-8">
                              Dev:
                            </span>
                            <span className="w-8 text-center">
                              {file.devorder}
                            </span>
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveUp(file, "devorder");
                                }}
                                disabled={orderLoading === file.id}
                                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-green-600 disabled:opacity-50 transition-colors"
                                title="Diminuer l'ordre de développement"
                              >
                                <MoveUp size={12} />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveDown(file, "devorder");
                                }}
                                disabled={orderLoading === file.id}
                                className="p-1 hover:bg-gray-100 rounded text-gray-600 hover:text-green-600 disabled:opacity-50 transition-colors"
                                title="Augmenter l'ordre de développement"
                              >
                                <MoveDown size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* CELLULE ACTIONS */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(file);
                            }}
                            className="text-blue-600 hover:text-blue-900 text-xs bg-blue-50 px-2 py-1 rounded transition-colors"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(file.id);
                            }}
                            className="text-red-600 hover:text-red-900 text-xs bg-red-50 px-2 py-1 rounded transition-colors"
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Vue grille avec cartes */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {safeFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  view={view}
                  onClick={() => handleFileSelect(file)}
                  onEdit={() => handleEdit(file)}
                  onDelete={() => handleDelete(file.id)}
                  isSelected={selectedFile?.id === file.id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Statistiques */}
      {safeFiles.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              {safeFiles.length} fichier{safeFiles.length > 1 ? "s" : ""} au
              total
            </span>
            <span>Vue: {view === "grid" ? "Grille" : "Liste"}</span>
          </div>
        </div>
      )}

      {/* Modale de création/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editFile ? `Modifier "${editFile.name}"` : "Nouveau fichier"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="p-6">
              <FileForm
                initialValues={editFile}
                onSubmit={handleSubmit}
                loading={loading}
                projectId={projectId}
                onCancel={() => setShowModal(false)}
                availableFiles={safeFiles}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
