/*
./components/models/schemas/SchemaForm.tsx:95:24
Type error: Property 'INT' does not exist on type '{ STRING: "STRING"; INTEGER: "INTEGER"; BOOLEAN: "BOOLEAN"; DATE: "DATE"; DATETIME: "DATETIME"; FLOAT: "FLOAT"; JSON: "JSON"; }'.

  93 |   const fieldTypeOptions = [
  94 |     { value: FieldType.STRING, label: "Texte (STRING)" },
> 95 |     { value: FieldType.INT, label: "Entier (INT)" },
     |                        ^
  96 |     { value: FieldType.FLOAT, label: "Décimal (FLOAT)" },
  97 |     { value: FieldType.BOOLEAN, label: "Booléen (BOOLEAN)" },
  98 |     { value: FieldType.DATETIME, label: "Date/Heure (DATETIME)" },
Next.js build worker exited with code: 1 and signal: null
PS C:\Users\jpheu\OneDrive - jean-philippe Heurteux\Bureau\clone\project-manger>
*/


// components/models/projects/SchemaForm.tsx

"use client";

import { useForm } from "react-hook-form";
import {
  SchemaFields,
  Projects,
  FieldType,
} from "@/lib/generated/prisma/client";
import {
  Database,
  Type,
  ArrowLeft,
  Save,
  X,
  AlertCircle,
  Hash,
  Key,
  User,
  Calendar,
  Check,
} from "lucide-react";

type SchemaFormData = {
  name: string;
  fieldType: FieldType;
  isRequired: boolean;
  isUnique: boolean;
  defaultValue?: string;
  description?: string;
  comment?: string;
  order?: number;
  parentFieldId?: string;
};

interface SchemaFormProps {
  projectId: string;
  project: Projects;
  schema?: SchemaFields | null;
  availableSchemas?: SchemaFields[];
  onSave: (data: SchemaFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SchemaForm({
  projectId,
  project,
  schema,
  availableSchemas = [],
  onSave,
  onCancel,
  isLoading = false,
}: SchemaFormProps) {
  const isEditing = !!schema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SchemaFormData>({
    defaultValues: {
      name: schema?.name || "",
      fieldType: schema?.fieldType || FieldType.STRING,
      isRequired: schema?.isRequired || false,
      isUnique: schema?.isUnique || false,
      defaultValue: schema?.defaultValue || "",
      description: schema?.description || "",
      comment: schema?.comment || "",
      order: schema?.order || 100,
      parentFieldId: schema?.parentFieldId || "",
    },
    mode: "onBlur",
  });

  const watchedFieldType = watch("fieldType");
  const watchedIsRequired = watch("isRequired");

  const onSubmit = async (data: SchemaFormData) => {
    await onSave({
      ...data,
      order: Number(data.order) || 100,
      defaultValue: data.defaultValue || undefined,
      description: data.description || undefined,
      comment: data.comment || undefined,
      parentFieldId: data.parentFieldId || undefined,
    });
  };

  const fieldTypeOptions = [
    { value: FieldType.STRING, label: "Texte (STRING)" },
  { value: FieldType.INTEGER, label: "Entier (INTEGER)" }, // Correction ici
    { value: FieldType.FLOAT, label: "Décimal (FLOAT)" },
    { value: FieldType.BOOLEAN, label: "Booléen (BOOLEAN)" },
    { value: FieldType.DATETIME, label: "Date/Heure (DATETIME)" },
    { value: FieldType.JSON, label: "JSON" },
    { value: FieldType.ENUM, label: "Énumération (ENUM)" },
  ];

  const groupedSchemas = availableSchemas.reduce(
    (acc, schema) => {
      const type = schema.fieldType || FieldType.STRING;
      if (!acc[type]) acc[type] = [];
      acc[type].push(schema);
      return acc;
    },
    {} as Record<FieldType, SchemaFields[]>
  );

  const fieldTypeLabels: Record<FieldType, string> = {
    [FieldType.STRING]: "Texte",
    [FieldType.INTEGER]: "Entier",
    [FieldType.FLOAT]: "Décimal",
    [FieldType.BOOLEAN]: "Booléen",
    [FieldType.DATE]: "Date",
    [FieldType.DATETIME]: "Date/Heure",
    [FieldType.JSON]: "JSON",
    [FieldType.ENUM]: "Énumération",
  };

  const getDefaultValueSuggestions = (fieldType: FieldType) => {
    switch (fieldType) {
      case FieldType.STRING:
        return ["", "N/A", "Non défini"];
      case FieldType.INTEGER:
        return ["0", "1", "-1"];
      case FieldType.FLOAT:
        return ["0.0", "1.0", "-1.0"];
      case FieldType.BOOLEAN:
        return ["true", "false"];
      case FieldType.DATETIME:
        return ["now()", "CURRENT_TIMESTAMP"];
      case FieldType.JSON:
        return ["{}", "[]", "null"];
      case FieldType.ENUM:
        return ["ACTIVE", "INACTIVE", "PENDING"];
      default:
        return [];
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Retour"
              type="button"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? "Modifier le champ" : "Nouveau champ"}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Projet: {project.name}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting || isLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4 mr-2" />
              Annuler
            </button>
            <button
              type="submit"
              form="schema-form"
              disabled={isSubmitting || isLoading}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditing ? "Mettre à jour" : "Créer"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Formulaire */}
      <form id="schema-form" onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Colonne gauche */}
          <div className="space-y-6">
            {/* Nom du champ */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Type className="w-4 h-4 inline mr-1" />
                Nom du champ <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                {...register("name", {
                  required: "Le nom du champ est requis",
                  minLength: { value: 2, message: "Minimum 2 caractères" },
                  maxLength: { value: 50, message: "Maximum 50 caractères" },
                  pattern: {
                    value: /^[a-zA-Z][a-zA-Z0-9_]*$/,
                    message:
                      "Le nom doit commencer par une lettre et ne contenir que des lettres, chiffres et underscores",
                  },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                placeholder="Ex: firstName, email, createdAt..."
                disabled={isSubmitting || isLoading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Utilisez la convention camelCase (ex: firstName, lastName)
              </p>
            </div>

            {/* Type de champ */}
            <div>
              <label
                htmlFor="fieldType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Database className="w-4 h-4 inline mr-1" />
                Type de champ <span className="text-red-500">*</span>
              </label>
              <select
                id="fieldType"
                {...register("fieldType")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                disabled={isSubmitting || isLoading}
              >
                {fieldTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Propriétés du champ */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Propriétés du champ
              </h3>
              {/* Champ requis */}
              <div className="flex items-center space-x-3">
                <input
                  id="isRequired"
                  type="checkbox"
                  {...register("isRequired")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={isSubmitting || isLoading}
                />
                <label htmlFor="isRequired" className="text-sm text-gray-700">
                  <AlertCircle className="w-4 h-4 inline mr-1 text-red-500" />
                  Champ requis
                </label>
              </div>
              {/* Champ unique */}
              <div className="flex items-center space-x-3">
                <input
                  id="isUnique"
                  type="checkbox"
                  {...register("isUnique")}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={isSubmitting || isLoading}
                />
                <label htmlFor="isUnique" className="text-sm text-gray-700">
                  <Key className="w-4 h-4 inline mr-1 text-yellow-600" />
                  Valeur unique
                </label>
              </div>
              {watchedIsRequired && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-amber-800">
                    ⚠️ Ce champ sera obligatoire dans la base de données
                  </p>
                </div>
              )}
            </div>
            {/* Ordre d'affichage */}
            <div>
              <label
                htmlFor="order"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Hash className="w-4 h-4 inline mr-1" />
                Ordre d'affichage
              </label>
              <input
                id="order"
                type="number"
                min="1"
                max="9999"
                {...register("order", {
                  valueAsNumber: true,
                  min: { value: 1, message: "L'ordre doit être supérieur à 0" },
                  max: {
                    value: 9999,
                    message: "L'ordre doit être inférieur à 10000",
                  },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${errors.order ? "border-red-500" : "border-gray-300"}`}
                placeholder="100"
                disabled={isSubmitting || isLoading}
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.order.message}
                </p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Détermine l'ordre d'affichage dans le schéma (plus petit = plus
                haut)
              </p>
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-6">
            {/* Valeur par défaut */}
            <div>
              <label
                htmlFor="defaultValue"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Valeur par défaut
              </label>
              <input
                id="defaultValue"
                type="text"
                {...register("defaultValue")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder={`Ex: ${getDefaultValueSuggestions(watchedFieldType)[0] || ""}`}
                disabled={isSubmitting || isLoading}
              />
              <div className="mt-1 text-xs text-gray-500">
                <span>
                  Suggestions pour {fieldTypeLabels[watchedFieldType]}:{" "}
                </span>
                {getDefaultValueSuggestions(watchedFieldType).map(
                  (suggestion, index) => (
                    <button
                      key={`${watchedFieldType}-${suggestion || "empty"}-${index}`}
                      type="button"
                      onClick={() => setValue("defaultValue", suggestion)}
                      className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs mr-1 mb-1 transition-colors"
                    >
                      {suggestion || "vide"}
                    </button>
                  )
                )}
              </div>
            </div>
            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                {...register("description", {
                  maxLength: { value: 999, message: "Maximum 999 caractères" },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none ${errors.description ? "border-red-500" : "border-gray-300"}`}
                placeholder="Décrivez l'utilisation et le rôle de ce champ..."
                disabled={isSubmitting || isLoading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>
            {/* Commentaire */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Commentaire technique
              </label>
              <textarea
                id="comment"
                rows={2}
                {...register("comment", {
                  maxLength: { value: 150, message: "Maximum 150 caractères" },
                })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-none ${errors.comment ? "border-red-500" : "border-gray-300"}`}
                placeholder="Notes techniques, contraintes, etc..."
                disabled={isSubmitting || isLoading}
              />
              {errors.comment && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.comment.message}
                </p>
              )}
            </div>
            {/* Champ parent */}
            <div>
              <label
                htmlFor="parentFieldId"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <Database className="w-4 h-4 inline mr-1" />
                Champ parent (optionnel)
              </label>
              <select
                id="parentFieldId"
                {...register("parentFieldId")}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                disabled={isSubmitting || isLoading}
              >
                <option value="">Aucun champ parent</option>
                {Object.entries(groupedSchemas).map(([type, schemas]) => (
                  <optgroup
                    key={type}
                    label={fieldTypeLabels[type as FieldType] || type}
                  >
                    {schemas.map((availableSchema) => (
                      <option
                        key={availableSchema.id}
                        value={availableSchema.id}
                      >
                        {availableSchema.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="mt-1 text-xs text-gray-500">
                {availableSchemas.length > 0
                  ? `${availableSchemas.length} champ(s) disponible(s)`
                  : "Aucun autre champ dans ce projet"}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Permet de créer une hiérarchie entre les champs
              </p>
            </div>
            {/* Informations du projet */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                Informations du projet
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Nom:</span>
                  <span className="font-medium text-gray-900">
                    {project.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>ID:</span>
                  <span className="font-mono text-xs">{projectId}</span>
                </div>
                {project.description && (
                  <div>
                    <span className="block">Description:</span>
                    <span className="text-gray-700 text-xs mt-1 block">
                      {project.description}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Informations du champ (en mode édition) */}
            {isEditing && schema && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-3">
                  Informations du champ
                </h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>ID:</span>
                    <span className="font-mono text-xs">{schema.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Créé le:</span>
                    <span>
                      {new Date(schema.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Modifié le:</span>
                    <span>
                      {new Date(schema.updatedAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
