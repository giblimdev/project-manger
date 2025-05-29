// components/models/files/FileCard.tsx

"use client";
import React from "react";
import { Files, FileType, Status } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  FileCode,
  Image,
  Archive,
  File,
  FileText,
  Database,
  Package,
  Presentation,
  Sheet,
  Folder,
} from "lucide-react";

// ✅ CORRECTION : Fonction getFileIcon définie
const getFileIcon = (type: FileType) => {
  switch (type) {
    case "PAGE":
      return FileCode;
    case "COMPONENT":
      return FileCode;
    case "UTIL":
      return FileText;
    case "LIB":
      return Package;
    case "STORE":
      return Database;
    case "DOCUMENT":
      return FileText;
    case "IMAGE":
      return Image;
    case "SPREADSHEET":
      return Sheet;
    case "PRESENTATION":
      return Presentation;
    case "ARCHIVE":
      return Archive;
    case "CODE":
      return FileCode;
    case "OTHER":
    default:
      return File;
  }
};

// ✅ CORRECTION : Labels de statut selon le schéma
const statusColors: Record<Status, string> = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  REVIEW: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-800",
  BLOCKED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-500",
};

const statusLabels: Record<Status, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "À relire",
  DONE: "Terminé",
  BLOCKED: "Bloqué",
  CANCELLED: "Annulé",
};

type FileCardProps = {
  file: Files;
  view: "grid" | "list";
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isSelected?: boolean;
};

export function FileCard({
  file,
  view,
  onClick,
  onEdit,
  onDelete,
  isSelected = false,
}: FileCardProps) {
  const IconComponent = getFileIcon(file.type);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la sélection
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la sélection
    onDelete();
  };

  if (view === "list") {
    return (
      <tr
        className={`hover:bg-gray-50 cursor-pointer transition-colors ${
          isSelected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
        }`}
        onClick={onClick}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <IconComponent size={20} className="text-gray-600" />
            <div>
              <div className="font-medium text-gray-900">{file.name}</div>
              {file.description && (
                <div className="text-sm text-gray-500 truncate max-w-xs">
                  {file.description}
                </div>
              )}
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="text-sm text-gray-900">{file.type}</span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[file.status]}`}
          >
            {statusLabels[file.status]}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {file.version || "1.0"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {file.order}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditClick}
              title="Modifier"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              title="Supprimer"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer group ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : ""
      }`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <IconComponent size={24} className="text-gray-600" />
            <div>
              <h3 className="font-medium text-gray-900 truncate">
                {file.name}
              </h3>
              <p className="text-sm text-gray-500">{file.type}</p>
            </div>
          </div>
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[file.status]}`}
          >
            {statusLabels[file.status]}
          </span>
        </div>

        {file.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {file.description}
          </p>
        )}

        {file.fonctionnalities && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Fonctionnalités :</p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {file.fonctionnalities}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>v{file.version || "1.0"}</span>
          <span>Ordre: {file.order}</span>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditClick}
              title="Modifier"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteClick}
              title="Supprimer"
              className="text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          {isSelected && (
            <div className="text-xs text-blue-600 font-medium">
              ✓ Sélectionné
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
