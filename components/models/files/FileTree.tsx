// components/models/files/FileTree.tsx

"use client";
import React, { useState, useMemo } from "react";
import { Files } from "@/lib/generated/prisma/client";
import { FileTreeNode } from "./FileTreeNode";
import { FileForm } from "./FileForm";
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus, ChevronRight, ChevronDown, X } from "lucide-react";

type FileTreeProps = {
  files: Files[];
  onRefresh: () => void;
  projectId: string;
};

export function FileTree({ files, onRefresh, projectId }: FileTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<Files | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editFile, setEditFile] = useState<Files | null>(null);
  const [loading, setLoading] = useState(false);

  // Sécuriser files avant le useMemo
  const safeFiles = Array.isArray(files) ? files : [];

  // Construction de l'arbre hiérarchique selon votre schéma Files
  const fileTree = useMemo(() => {
    // Fichiers racines (sans parent selon votre modèle Files)
    const rootFiles = safeFiles.filter((file) => !file.parentFileId);
    const childrenMap = new Map<string, Files[]>();

    // Construction de la map des enfants selon la relation FileHierarchy
    safeFiles.forEach((file) => {
      if (file.parentFileId) {
        if (!childrenMap.has(file.parentFileId)) {
          childrenMap.set(file.parentFileId, []);
        }
        childrenMap.get(file.parentFileId)!.push(file);
      }
    });

    // Tri selon les champs order et devorder de votre schéma
    rootFiles.sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order;
      return a.devorder - b.devorder;
    });

    // Tri des enfants également
    childrenMap.forEach((children) => {
      children.sort((a, b) => {
        if (a.order !== b.order) return a.order - b.order;
        return a.devorder - b.devorder;
      });
    });

    return { rootFiles, childrenMap };
  }, [safeFiles]);

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const handleFileSelect = (file: Files) => {
    setSelectedFile(file);
  };

  // ✅ AJOUT : Handler pour créer un nouveau fichier
  const handleCreate = () => {
    console.log("🔥 Bouton Nouveau fichier cliqué (FileTree)");
    setEditFile(null);
    setShowModal(true);
  };

  // ✅ AJOUT : Handler pour modifier un fichier existant
  const handleEdit = (file: Files) => {
    console.log("✏️ Édition du fichier:", file.name);
    setEditFile(file);
    setShowModal(true);
  };

  // ✅ AJOUT : Handler pour supprimer un fichier selon votre schéma
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

  // ✅ AJOUT : Handler pour soumettre le formulaire selon votre modèle Files
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

  // Fonction récursive pour rendre l'arbre
  const renderTreeNode = (file: Files, level: number = 0): React.ReactNode => {
    const children = fileTree.childrenMap.get(file.id) || [];
    const hasChildren = children.length > 0;
    const isExpanded = expandedNodes.has(file.id);
    const isSelected = selectedFile?.id === file.id;

    return (
      <div key={file.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded group ${
            isSelected ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => handleFileSelect(file)}
        >
          {/* Icône d'expansion pour les fichiers avec enfants */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(file.id);
              }}
              className="mr-1 p-0.5 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <div className="w-5 mr-1" />
          )}

          {/* Icône du type de fichier selon votre enum FileType */}
          <span className="mr-2 text-gray-500">
            {getFileTypeIcon(file.type)}
          </span>

          {/* Nom du fichier */}
          <span className="flex-1 text-sm font-medium text-gray-900 truncate">
            {file.name}
          </span>

          {/* Badge du statut selon votre enum Status */}
          <span
            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(file.status)}`}
          >
            {getStatusLabel(file.status)}
          </span>

          {/* ✅ AJOUT : Actions au hover (comme dans FileTreeNode) */}
          <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(file);
              }}
              className="h-6 w-6"
              title="Modifier"
            >
              <Plus size={12} />
            </Button>
          </div>
        </div>

        {/* Enfants (si expanded) */}
        {hasChildren && isExpanded && (
          <div>{children.map((child) => renderTreeNode(child, level + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* ✅ AJOUT : BOUTON PRINCIPAL - COMME DANS FILELIST */}
      <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div>
          <h3 className="font-medium text-blue-900">
            Gestion des fichiers (Vue Arbre)
          </h3>
          <p className="text-sm text-blue-600">
            {safeFiles.length} fichier{safeFiles.length > 1 ? "s" : ""} selon
            votre schéma Files
            {selectedFile && (
              <span className="ml-4">Sélectionné : {selectedFile.name}</span>
            )}
          </p>
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

      {/* Header avec statistiques et actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Hiérarchie selon votre relation FileHierarchy
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              setExpandedNodes(new Set(safeFiles.map((f) => f.id)))
            }
            variant="outline"
            size="sm"
          >
            Tout développer
          </Button>
          <Button
            onClick={() => setExpandedNodes(new Set())}
            variant="outline"
            size="sm"
          >
            Tout réduire
          </Button>
        </div>
      </div>

      {/* Arbre des fichiers */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-4">
          {fileTree.rootFiles.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📁</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {safeFiles.length === 0
                  ? "Aucun fichier dans ce projet"
                  : "Aucun fichier racine trouvé"}
              </h3>
              <p className="text-gray-600 mb-4">
                Commencez par créer votre premier fichier selon votre schéma
                Files
              </p>
              {/* ✅ AJOUT : Bouton dans l'état vide */}
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
            <div className="space-y-1">
              {fileTree.rootFiles.map((file) => renderTreeNode(file, 0))}
            </div>
          )}
        </div>
      </div>

      {/* Légende */}
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
        <strong>Hiérarchie :</strong> Les fichiers sont organisés selon le champ{" "}
        <code>parentFileId</code> de votre schéma.
        <br />
        <strong>Tri :</strong> Par <code>order</code> (affichage) puis{" "}
        <code>devorder</code> (développement).
      </div>

      {/* ✅ AJOUT : Modale de création/modification selon votre schéma Files */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {editFile
                  ? `Modifier "${editFile.name}"`
                  : "Nouveau fichier (Vue Arbre)"}
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

// Fonctions utilitaires selon votre schéma
function getFileTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    PAGE: "📄",
    COMPONENT: "🧩",
    UTIL: "🔧",
    LIB: "📚",
    STORE: "🗄️",
    DOCUMENT: "📝",
    IMAGE: "🖼️",
    SPREADSHEET: "📊",
    PRESENTATION: "📽️",
    ARCHIVE: "📦",
    CODE: "💻",
    OTHER: "📄",
  };
  return icons[type] || "📄";
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    TODO: "bg-gray-100 text-gray-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    REVIEW: "bg-yellow-100 text-yellow-800",
    DONE: "bg-green-100 text-green-800",
    BLOCKED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-500",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    REVIEW: "À relire",
    DONE: "Terminé",
    BLOCKED: "Bloqué",
    CANCELLED: "Annulé",
  };
  return labels[status] || status;
}
