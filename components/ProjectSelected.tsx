// components/ProjectSelected.tsx

"use client";
import React, { useState } from "react";
import { useProjectsStore } from "@/stores/useProjectStore";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
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

// Couleurs de statut modernisées
const statusColors = {
  TODO: "bg-neutral-100 text-neutral-700 border border-neutral-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border border-blue-200",
  REVIEW: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  DONE: "bg-green-50 text-green-700 border border-green-200",
  BLOCKED: "bg-red-50 text-red-700 border border-red-200",
  CANCELLED: "bg-neutral-100 text-neutral-400 border border-neutral-200",
} as const;

type ProjectSelectedProps = {
  className?: string;
  defaultExpanded?: string[];
};

export function ProjectSelected({
  className = "",
  defaultExpanded = ["general"],
}: ProjectSelectedProps) {
  const { project } = useProjectsStore();
  const [expandedSections, setExpandedSections] =
    useState<string[]>(defaultExpanded);

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "Non définie";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Nom du fichier */}

      <Card className={className + " rounded-2xl shadow-lg border-0"}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 bg-blue-300 p-6 rounded-t-2xl">
          <div className="flex items-center gap-4">
            <FolderOpen size={28} className="text-blue-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                {project?.name || "Aucun projet"}
              </h2>
              <p className="text-sm text-gray-500 ml-6">
                {project?.description}
              </p>
            </div>
          </div>
          <Badge
            className={
              "px-4 py-2 rounded-full font-semibold text-xs transition " +
              (project && project.status
                ? statusColors[project.status]
                : "bg-neutral-100 text-neutral-700 border border-neutral-200")
            }
          >
            {project && project.status
              ? statusLabels[project.status]
              : "Aucun statut"}
          </Badge>
        </div>

        <CardContent className="p-8">
          <Accordion
            type="multiple"
            value={expandedSections}
            onValueChange={setExpandedSections}
            className="w-full"
          >
            {/* Section Informations générales */}
            <AccordionItem value="general">
              <AccordionTrigger className="flex items-center gap-2 text-base font-semibold text-gray-800 hover:text-blue-700 transition">
                <Info size={18} />
                Informations générales
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-5 pt-2">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      Description
                    </h4>
                    <p className="text-sm text-gray-600 bg-neutral-50 p-3 rounded-lg border">
                      {project?.description || "Aucune description"}
                    </p>
                  </div>
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
              <AccordionTrigger className="flex items-center gap-2 text-base font-semibold text-gray-800 hover:text-blue-700 transition">
                <Clock size={18} />
                Planification
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
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
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border">
                  <p className="text-sm text-blue-800">
                    <strong>Durée estimée :</strong>{" "}
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
              <AccordionTrigger className="flex items-center gap-2 text-base font-semibold text-gray-800 hover:text-blue-700 transition">
                <ImageIcon size={18} />
                Médias
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Image du projet
                  </h4>
                  {project?.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full max-w-md h-48 object-cover rounded-lg border shadow"
                    />
                  ) : (
                    <div className="w-full max-w-md h-48 bg-neutral-100 rounded-lg border flex items-center justify-center">
                      <span className="text-gray-400">Aucune image</span>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section Métadonnées système */}
            <AccordionItem value="metadata">
              <AccordionTrigger className="flex items-center gap-2 text-base font-semibold text-gray-800 hover:text-blue-700 transition">
                <Settings size={18} />
                Métadonnées système
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">ID du projet:</span>
                      <p className="font-mono text-xs bg-neutral-50 p-2 rounded mt-1 border">
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
                      <p className="font-mono text-xs bg-neutral-50 p-2 rounded mt-1 border">
                        {project?.creatorId || "Aucun créateur"}
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
