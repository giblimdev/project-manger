// components/ProjectSelected.tsx

"use client";
import React, { useState } from "react";
import { useProjectsStore } from "@/stores/useProjectStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  User,
  Flag,
  Clock,
  FolderOpen,
  Info,
  Settings,
  Image as ImageIcon,
} from "lucide-react";

// Labels de statut selon le schéma
const statusLabels = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  REVIEW: "À relire",
  DONE: "Terminé",
  BLOCKED: "Bloqué",
  CANCELLED: "Annulé",
} as const;

// Couleurs de statut
const statusColors = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  REVIEW: "bg-yellow-100 text-yellow-800",
  DONE: "bg-green-100 text-green-800",
  BLOCKED: "bg-red-100 text-red-800",
  CANCELLED: "bg-gray-100 text-gray-500",
} as const;

type ProjectSelectedProps = {
  className?: string;
  defaultExpanded?: string[];
};

export function ProjectSelected({
  className = "",
  defaultExpanded = ["general"],
}: ProjectSelectedProps) {
  // Lecture seule du store
  const { project } = useProjectsStore();

  // État pour contrôler l'accordion
  const [expandedSections, setExpandedSections] =
    useState<string[]>(defaultExpanded);

  // Formatage des dates
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Non définie";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header du projet */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <FolderOpen size={24} className="text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {project?.name || "Aucun projet"}
                </h2>
                <p className="text-sm text-gray-500">
                  ID: {project?.id || "Non défini"}
                </p>
              </div>
            </div>
            <Badge
              className={
                project
                  ? statusColors[project.status]
                  : "bg-gray-100 text-gray-800"
              }
            >
              {project ? statusLabels[project.status] : "Aucun statut"}
            </Badge>
          </div>

          {/* Accordion avec les sections du projet */}
          <Accordion
            type="multiple"
            value={expandedSections}
            onValueChange={setExpandedSections}
            className="w-full"
          >
            {/* Section Informations générales */}
            <AccordionItem value="general">
              <AccordionTrigger className="flex items-center gap-2">
                <Info size={16} />
                Informations générales
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Description
                    </h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {project?.description || "Aucune description"}
                    </p>
                  </div>

                  {/* Métadonnées de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Flag size={16} className="text-gray-400" />
                      <span className="text-gray-600">Priorité:</span>
                      <span className="font-medium">
                        {project?.priority || "Non définie"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={16} className="text-gray-400" />
                      <span className="text-gray-600">Créé le:</span>
                      <span className="font-medium">
                        {formatDate(project?.createdAt)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <User size={16} className="text-gray-400" />
                      <span className="text-gray-600">Créateur:</span>
                      <span className="font-medium">
                        {project?.creatorId || "Non défini"}
                      </span>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section Planification */}
            <AccordionItem value="planning">
              <AccordionTrigger className="flex items-center gap-2">
                <Clock size={16} />
                Planification
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-green-500" />
                    <span className="text-gray-600">Date de début:</span>
                    <span className="font-medium">
                      {formatDate(project?.startDate)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-red-500" />
                    <span className="text-gray-600">Date de fin:</span>
                    <span className="font-medium">
                      {formatDate(project?.endDate)}
                    </span>
                  </div>
                </div>

                {/* Calcul de la durée */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Durée estimée:</strong>{" "}
                    {project?.startDate && project?.endDate
                      ? Math.ceil(
                          (new Date(project.endDate).getTime() -
                            new Date(project.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) + " jours"
                      : "Non calculable"}
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section Médias */}
            <AccordionItem value="media">
              <AccordionTrigger className="flex items-center gap-2">
                <ImageIcon size={16} />
                Médias
              </AccordionTrigger>
              <AccordionContent>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">
                    Image du projet
                  </h4>
                  {project?.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full max-w-md h-48 object-cover rounded-lg border shadow-sm"
                    />
                  ) : (
                    <div className="w-full max-w-md h-48 bg-gray-100 rounded-lg border flex items-center justify-center">
                      <span className="text-gray-500">Aucune image</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section Métadonnées système */}
            <AccordionItem value="metadata">
              <AccordionTrigger className="flex items-center gap-2">
                <Settings size={16} />
                Métadonnées système
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">ID du projet:</span>
                      <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {project?.id || "Aucun ID"}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-600">
                        Dernière mise à jour:
                      </span>
                      <p className="font-medium mt-1">
                        {formatDate(project?.updatedAt)}
                      </p>
                    </div>

                    <div>
                      <span className="text-gray-600">ID du créateur:</span>
                      <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {project?.creatorId || "Aucun créateur"}
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}
