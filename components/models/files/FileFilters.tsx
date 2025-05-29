// components/models/files/FileFilters.tsx

"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X, Filter } from "lucide-react";
import { FileType, Status } from "@/lib/generated/prisma/client";

type FileFiltersProps = {
  typeFilter: FileType | undefined;
  setTypeFilter: (type: FileType | undefined) => void;
  statusFilter: Status | undefined;
  setStatusFilter: (status: Status | undefined) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

// Labels selon votre schéma Prisma
const fileTypeLabels: Record<FileType, string> = {
  PAGE: "Page",
  COMPONENT: "Composant",
  UTIL: "Utilitaire",
  LIB: "Librairie",
  STORE: "Store",
  DOCUMENT: "Document",
  IMAGE: "Image",
  SPREADSHEET: "Tableur",
  PRESENTATION: "Présentation",
  ARCHIVE: "Archive",
  CODE: "Code",
  OTHER: "Autre",
};

const statusLabels: Record<Status, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "À relire",
  DONE: "Terminé",
  BLOCKED: "Bloqué",
  CANCELLED: "Annulé",
};

// Valeurs spéciales pour éviter les chaînes vides
const ALL_TYPES_VALUE = "ALL_TYPES";
const ALL_STATUS_VALUE = "ALL_STATUS";

export function FileFilters({
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
}: FileFiltersProps) {
  // Handlers pour convertir les valeurs spéciales en undefined
  const handleTypeChange = (value: string) => {
    setTypeFilter(value === ALL_TYPES_VALUE ? undefined : (value as FileType));
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === ALL_STATUS_VALUE ? undefined : (value as Status));
  };

  // Fonction pour effacer tous les filtres
  const clearAllFilters = () => {
    setTypeFilter(undefined);
    setStatusFilter(undefined);
    setSearchQuery("");
  };

  // Vérifier si des filtres sont actifs
  const hasActiveFilters = typeFilter || statusFilter || searchQuery;

  return (
    <div className="bg-white rounded-lg shadow border p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter size={16} className="text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700">
          Filtres des fichiers
        </h3>
        {hasActiveFilters && (
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            Filtres actifs
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Recherche textuelle selon votre schéma Files */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            type="text"
            placeholder="Rechercher un fichier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
            >
              <X size={12} />
            </Button>
          )}
        </div>

        {/* Filtre par type de fichier selon votre enum FileType */}
        <div>
          <Select
            value={typeFilter || ALL_TYPES_VALUE}
            onValueChange={handleTypeChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type de fichier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_TYPES_VALUE}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Tous les types
                </span>
              </SelectItem>
              {Object.entries(fileTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${getTypeColor(key as FileType)}`}
                    ></span>
                    {label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filtre par statut selon votre enum Status */}
        <div>
          <Select
            value={statusFilter || ALL_STATUS_VALUE}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_STATUS_VALUE}>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  Tous les statuts
                </span>
              </SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  <span className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${getStatusColor(key as Status)}`}
                    ></span>
                    {label}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bouton pour effacer tous les filtres */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            className="flex items-center gap-2 flex-1"
          >
            <X size={16} />
            Effacer
          </Button>
        </div>
      </div>

      {/* Indicateurs de filtres actifs */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <span className="text-xs text-gray-500">Filtres actifs :</span>

          {typeFilter && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Type: {fileTypeLabels[typeFilter]}
              <button
                onClick={() => setTypeFilter(undefined)}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {statusFilter && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Statut: {statusLabels[statusFilter]}
              <button
                onClick={() => setStatusFilter(undefined)}
                className="hover:bg-green-200 rounded-full p-0.5"
              >
                <X size={10} />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              Recherche: "{searchQuery}"
              <button
                onClick={() => setSearchQuery("")}
                className="hover:bg-purple-200 rounded-full p-0.5"
              >
                <X size={10} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Aide contextuelle */}
      <div className="mt-4 text-xs text-gray-500">
        <strong>Recherche dans :</strong> nom, description, fonctionnalités,
        import, export, useby
      </div>
    </div>
  );
}

// Fonctions utilitaires pour les couleurs selon votre schéma
function getTypeColor(type: FileType): string {
  const colors: Record<FileType, string> = {
    PAGE: "bg-blue-500",
    COMPONENT: "bg-green-500",
    UTIL: "bg-orange-500",
    LIB: "bg-purple-500",
    STORE: "bg-red-500",
    DOCUMENT: "bg-gray-500",
    IMAGE: "bg-pink-500",
    SPREADSHEET: "bg-emerald-500",
    PRESENTATION: "bg-yellow-500",
    ARCHIVE: "bg-amber-500",
    CODE: "bg-indigo-500",
    OTHER: "bg-slate-500",
  };
  return colors[type] || "bg-gray-500";
}

function getStatusColor(status: Status): string {
  const colors: Record<Status, string> = {
    TODO: "bg-gray-400",
    IN_PROGRESS: "bg-blue-500",
    REVIEW: "bg-yellow-500",
    DONE: "bg-green-500",
    BLOCKED: "bg-red-500",
    CANCELLED: "bg-gray-500",
  };
  return colors[status] || "bg-gray-400";
}
