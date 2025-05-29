// components/models/files/FileTreeNode.tsx

"use client";
import React from "react";
import { Files, FileType, Status } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  FileText,
  Folder,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";

type FileTreeNodeProps = {
  file: Files;
  children: Files[];
  childrenMap: Map<string, Files[]>;
  isExpanded: boolean;
  onToggle: () => void;
  onRefresh: () => void;
  level: number;
};

export function FileTreeNode({
  file,
  children,
  childrenMap,
  isExpanded,
  onToggle,
  onRefresh,
  level,
}: FileTreeNodeProps) {
  const hasChildren = children.length > 0;
  const indentSize = level * 20;

  // Handler pour supprimer un fichier
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${file.name}" ?`))
      return;

    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      onRefresh();
    } catch (error) {
      alert("Erreur lors de la suppression");
    }
  };

  // Handler pour l'édition (à implémenter selon vos besoins)
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Ouvrir un modal d'édition ou naviguer vers une page d'édition
    console.log("Éditer le fichier:", file.name);
  };

  return (
    <div className="select-none">
      {/* Nœud principal */}
      <div
        className="flex items-center py-1 px-2 hover:bg-gray-100 cursor-pointer rounded group"
        style={{ paddingLeft: `${indentSize + 8}px` }}
      >
        {/* Icône d'expansion/réduction */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="mr-2 p-0.5 hover:bg-gray-200 rounded flex-shrink-0"
            aria-label={isExpanded ? "Réduire" : "Développer"}
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-gray-600" />
            ) : (
              <ChevronRight size={14} className="text-gray-600" />
            )}
          </button>
        ) : (
          <div className="w-5 mr-2 flex-shrink-0" />
        )}

        {/* Icône du type de fichier selon votre enum FileType */}
        <span className="mr-2 flex-shrink-0 text-gray-500">
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen size={16} className="text-blue-600" />
            ) : (
              <Folder size={16} className="text-blue-600" />
            )
          ) : (
            getFileTypeIcon(file.type)
          )}
        </span>

        {/* Nom du fichier - cliquable pour voir les détails */}
        <Link
          href={`/files/${file.id}`}
          className="flex-1 text-sm font-medium text-gray-900 hover:text-blue-600 truncate"
          title={file.name}
        >
          {file.name}
        </Link>

        {/* Extension si présente */}
        {file.extension && (
          <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
            {file.extension}
          </span>
        )}

        {/* Badge du statut selon votre enum Status */}
        <Badge
          variant="outline"
          className={`ml-2 text-xs flex-shrink-0 ${getStatusColor(file.status)}`}
        >
          {getStatusLabel(file.status)}
        </Badge>

        {/* Actions (visibles au hover) */}
        <div className="ml-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Link href={`/files/${file.id}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              title="Voir les détails"
            >
              <Eye size={12} />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
            className="h-6 w-6"
            title="Modifier"
          >
            <Edit size={12} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-6 w-6 text-red-600 hover:text-red-700"
            title="Supprimer"
          >
            <Trash2 size={12} />
          </Button>
        </div>
      </div>

      {/* Enfants (si développé) selon la hiérarchie de votre schéma */}
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <FileTreeNode
              key={child.id}
              file={child}
              children={childrenMap.get(child.id) || []}
              childrenMap={childrenMap}
              isExpanded={false} // Les enfants commencent fermés
              onToggle={() => {}} // TODO: Gérer l'état d'expansion des enfants
              onRefresh={onRefresh}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Fonctions utilitaires selon votre schéma Files
function getFileTypeIcon(type: FileType): React.ReactNode {
  const iconProps = { size: 16, className: "text-gray-600" };

  switch (type) {
    case "PAGE":
      return <FileText {...iconProps} className="text-blue-600" />;
    case "COMPONENT":
      return <FileText {...iconProps} className="text-green-600" />;
    case "UTIL":
      return <FileText {...iconProps} className="text-orange-600" />;
    case "LIB":
      return <FileText {...iconProps} className="text-purple-600" />;
    case "STORE":
      return <FileText {...iconProps} className="text-red-600" />;
    case "DOCUMENT":
      return <FileText {...iconProps} className="text-gray-600" />;
    case "IMAGE":
      return <FileText {...iconProps} className="text-pink-600" />;
    case "SPREADSHEET":
      return <FileText {...iconProps} className="text-green-600" />;
    case "PRESENTATION":
      return <FileText {...iconProps} className="text-orange-600" />;
    case "ARCHIVE":
      return <FileText {...iconProps} className="text-yellow-600" />;
    case "CODE":
      return <FileText {...iconProps} className="text-blue-600" />;
    case "OTHER":
    default:
      return <FileText {...iconProps} />;
  }
}

function getStatusColor(status: Status): string {
  const colors: Record<Status, string> = {
    TODO: "border-gray-300 text-gray-700",
    IN_PROGRESS: "border-blue-300 text-blue-700",
    REVIEW: "border-yellow-300 text-yellow-700",
    DONE: "border-green-300 text-green-700",
    BLOCKED: "border-red-300 text-red-700",
    CANCELLED: "border-gray-300 text-gray-500",
  };
  return colors[status] || "border-gray-300 text-gray-700";
}

function getStatusLabel(status: Status): string {
  const labels: Record<Status, string> = {
    TODO: "À faire",
    IN_PROGRESS: "En cours",
    REVIEW: "À relire",
    DONE: "Terminé",
    BLOCKED: "Bloqué",
    CANCELLED: "Annulé",
  };
  return labels[status] || status;
}
