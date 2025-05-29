// components/models/files/FileList.tsx

"use client";
import React, { useState } from "react";
import { Files, FileType, Status } from "@/lib/generated/prisma/client";
import { FileCard } from "./FileCard";
import { FileForm } from "./FileForm";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

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

  // ✅ DIAGNOSTIC : Logs pour identifier le problème
  console.log("🔍 FileList - Props reçues:", {
    filesLength: files?.length,
    view,
    projectId,
    filesType: typeof files,
    isArray: Array.isArray(files),
  });

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

  // Handler pour supprimer un fichier selon votre schéma
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

  // Handler pour soumettre le formulaire selon votre modèle Files
  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      // Nettoyage des données selon votre schéma Files
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

  // ✅ Sécurisation des données selon votre schéma
  const safeFiles = Array.isArray(files) ? files : [];

  return (
    <div className="space-y-6">
      {/* ✅ BOUTON PRINCIPAL - TOUJOURS VISIBLE */}
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

      {/* ✅ DIAGNOSTIC : Bouton de test visible */}
      <div className="bg-yellow-100 p-3 border border-yellow-400 rounded">
        <p className="text-sm">
          🔍 Debug: {safeFiles.length} fichiers | Vue: {view} | Projet:{" "}
          {projectId}
        </p>
        <Button
          onClick={() => alert("Test bouton fonctionne!")}
          size="sm"
          variant="outline"
          className="mt-2"
        >
          Test Bouton
        </Button>
      </div>

      {/* Affichage des fichiers selon votre schéma */}
      {safeFiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">📁</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun fichier trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Commencez par créer votre premier fichier selon votre schéma Files
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
            /* Vue liste avec tableau selon votre modèle Files */
            <div className="bg-white rounded-lg shadow border overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fichier
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
                </tbody>
              </table>
            </div>
          ) : (
            /* Vue grille avec cartes selon votre schéma */
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

      {/* Statistiques selon votre modèle Files */}
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

      {/* ✅ Modale de création/modification selon votre schéma Files */}
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
                availableFiles={safeFiles} // ✅ Pour la hiérarchie FileHierarchy
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
