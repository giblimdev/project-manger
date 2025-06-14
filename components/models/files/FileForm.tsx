"use client";
import React, { useState, useEffect } from "react";
import { Files, FileType, Status } from "@/lib/generated/prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";

// Schéma de validation selon votre modèle Files
const fileFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis").max(255),
  extension: z.string().nullable().optional(),
  url: z.string().min(1, "L'URL est requise"),
  type: z.nativeEnum(FileType),
  description: z.string().nullable().optional(),
  fonctionnalities: z.string().nullable().optional(),
  import: z.string().nullable().optional(),
  export: z.string().nullable().optional(),
  useby: z.string().nullable().optional(),
  script: z.string().nullable().optional(),
  version: z.string().nullable().optional(),
  category: z.enum(["dossier", "file"]).default("dossier"),
  order: z.coerce.number().int().min(1).default(100),
  devorder: z.coerce.number().int().min(1).default(100),
  status: z.nativeEnum(Status).default(Status.TODO),
  parentFileId: z.string().uuid().nullable().optional(),
});

// Labels selon votre schéma
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

const categoryLabels: Record<string, string> = {
  dossier: "Dossier",
  file: "Fichier",
};

type FileFormProps = {
  initialValues?: Files | null;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
  projectId: string;
  onCancel?: () => void;
  availableFiles?: Files[];
};

export function FileForm({
  initialValues,
  onSubmit,
  loading,
  projectId,
  onCancel,
  availableFiles = [],
}: FileFormProps) {
  const [formData, setFormData] = useState({
    name: initialValues?.name || "",
    extension: initialValues?.extension || "",
    url: initialValues?.url || "",
    type: initialValues?.type || FileType.OTHER,
    description: initialValues?.description || "",
    fonctionnalities: initialValues?.fonctionnalities || "",
    import: initialValues?.import || "",
    export: initialValues?.export || "",
    useby: initialValues?.useby || "",
    script: initialValues?.script || "",
    version: initialValues?.version || "1.0",
    category: initialValues?.category || "dossier",
    order: initialValues?.order || 100,
    devorder: initialValues?.devorder || 100,
    status: initialValues?.status || Status.TODO,
    parentFileId: initialValues?.parentFileId || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fonction pour construire l'URL automatiquement
  const buildFileUrl = (
    parentId: string | null | undefined,
    name: string,
    extension: string,
    files: Files[]
  ): string => {
    if (!parentId) {
      return `${name}${extension ? `.${extension}` : ""}`;
    }

    const parentFile = files.find((f) => f.id === parentId);
    if (!parentFile) {
      return `${name}${extension ? `.${extension}` : ""}`;
    }

    // Construit le chemin complet du parent
    let parentPath = parentFile.url;
    let currentParentId = parentFile.parentFileId;

    while (currentParentId) {
      const nextParent = files.find((f) => f.id === currentParentId);
      if (!nextParent) break;
      parentPath = `${nextParent.url}/${parentPath}`;
      currentParentId = nextParent.parentFileId;
    }

    return `${parentPath}/${name}${extension ? `.${extension}` : ""}`;
  };

  // Met à jour l'URL quand le parent, le nom ou l'extension change
  useEffect(() => {
    const newUrl = buildFileUrl(
      formData.parentFileId,
      formData.name,
      formData.extension,
      availableFiles
    );
    setFormData((prev) => ({ ...prev, url: newUrl }));
  }, [
    formData.parentFileId,
    formData.name,
    formData.extension,
    availableFiles,
  ]);

  // Filtrer les fichiers disponibles pour éviter la sélection circulaire
  const filteredParentFiles = availableFiles.filter((file) => {
    if (initialValues && file.id === initialValues.id) return false;
    if (
      initialValues &&
      checkIfChildFile(file.id, initialValues.id, availableFiles)
    )
      return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const cleanedData = {
      ...formData,
      extension: formData.extension.trim() || null,
      url: formData.url.trim(),
      description: formData.description.trim() || null,
      fonctionnalities: formData.fonctionnalities.trim() || null,
      import: formData.import.trim() || null,
      export: formData.export.trim() || null,
      useby: formData.useby.trim() || null,
      script: formData.script.trim() || null,
      version: formData.version.trim() || null,
      parentFileId: formData.parentFileId.trim() || null,
    };

    const result = fileFormSchema.safeParse(cleanedData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        fieldErrors[field] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    await onSubmit(result.data);
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informations de base */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Informations de base</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nom du fichier */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Nom du fichier *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Button.tsx"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Extension */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Extension
              </label>
              <Input
                value={formData.extension}
                onChange={(e) => handleChange("extension", e.target.value)}
                placeholder=".tsx"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Catégorie *
              </label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Type de fichier */}
            <div>
              <label className="block text-sm font-medium mb-2">Type *</label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fileTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Version */}
            <div>
              <label className="block text-sm font-medium mb-2">Version</label>
              <Input
                value={formData.version}
                onChange={(e) => handleChange("version", e.target.value)}
                placeholder="1.0"
              />
            </div>

            {/* Fichier parent */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Fichier parent
              </label>
              <Select
                value={formData.parentFileId || "NONE"}
                onValueChange={(value) =>
                  handleChange("parentFileId", value === "NONE" ? "" : value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Aucun parent (fichier racine)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NONE">
                    Aucun parent (fichier racine)
                  </SelectItem>
                  {filteredParentFiles.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {fileTypeLabels[file.type]}
                        </span>
                        <span>{file.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* URL */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">URL *</label>
            <Input
              value={formData.url}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Chemin construit automatiquement à partir de la hiérarchie
            </p>
          </div>
        </div>

        {/* Organisation */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Organisation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ordre d'affichage */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Ordre d'affichage
              </label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => handleChange("order", Number(e.target.value))}
                min="1"
                placeholder="100"
              />
            </div>

            {/* Ordre de développement */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Ordre de développement
              </label>
              <Input
                type="number"
                value={formData.devorder}
                onChange={(e) =>
                  handleChange("devorder", Number(e.target.value))
                }
                min="1"
                placeholder="100"
              />
            </div>
          </div>
        </div>

        {/* Description et fonctionnalités */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
              placeholder="Composant Button réutilisable..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Fonctionnalités
            </label>
            <Textarea
              value={formData.fonctionnalities}
              onChange={(e) => handleChange("fonctionnalities", e.target.value)}
              rows={3}
              placeholder="Variants (primary, secondary), tailles, états disabled..."
            />
          </div>
        </div>

        {/* Dépendances */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Dépendances</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Import</label>
              <Input
                value={formData.import}
                onChange={(e) => handleChange("import", e.target.value)}
                placeholder="react, clsx, ..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Export</label>
              <Input
                value={formData.export}
                onChange={(e) => handleChange("export", e.target.value)}
                placeholder="Button, ButtonProps, ..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Utilisé par
              </label>
              <Input
                value={formData.useby}
                onChange={(e) => handleChange("useby", e.target.value)}
                placeholder="Header.tsx, Form.tsx, ..."
              />
            </div>
          </div>
        </div>

        {/* Script/Contenu */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Script/Contenu
          </label>
          <Textarea
            value={formData.script}
            onChange={(e) => handleChange("script", e.target.value)}
            rows={12}
            className="font-mono text-sm"
            placeholder="import React from 'react'..."
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Annuler
            </Button>
          )}
          <Button type="submit" disabled={loading}>
            {loading
              ? "Enregistrement..."
              : initialValues
                ? "Mettre à jour"
                : "Créer le fichier"}
          </Button>
        </div>
      </form>
    </div>
  );
}

// Fonction utilitaire pour vérifier les relations circulaires
function checkIfChildFile(
  fileId: string,
  parentId: string,
  allFiles: Files[]
): boolean {
  const findChildren = (id: string): string[] => {
    return allFiles
      .filter((file) => file.parentFileId === id)
      .map((file) => file.id);
  };

  const checkRecursive = (id: string): boolean => {
    if (id === parentId) return true;
    const children = findChildren(id);
    return children.some((childId) => checkRecursive(childId));
  };

  return checkRecursive(fileId);
}
