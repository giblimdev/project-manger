// components/models/projects/SchemaList.tsx

"use client";

import { useState, useEffect } from "react";
import {
  SchemaFields,
  Projects,
  FieldType,
} from "@/lib/generated/prisma/client";
import {
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Database,
  Type,
  Hash,
  Check,
  Calendar,
  User,
  Key,
  AlertCircle,
} from "lucide-react";
import { SchemaForm } from "./SchemaForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Type du formulaire
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

interface SchemaListProps {
  initialSchemas: SchemaFields[];
  projectId: string;
  project: Projects;
}

export function SchemaList({
  initialSchemas,
  projectId,
  project,
}: SchemaListProps) {
  const [schemas, setSchemas] = useState<SchemaFields[]>(initialSchemas);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSchema, setEditingSchema] = useState<SchemaFields | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSchemas(initialSchemas);
    setHasOrderChanged(false);
  }, [initialSchemas]);

  // Regroupe tables et champs
  const tables = schemas
    .filter((s) => !s.parentFieldId)
    .sort((a, b) => a.order - b.order);
  const fieldsByTable: Record<string, SchemaFields[]> = {};
  schemas.forEach((s) => {
    if (s.parentFieldId) {
      if (!fieldsByTable[s.parentFieldId]) fieldsByTable[s.parentFieldId] = [];
      fieldsByTable[s.parentFieldId].push(s);
    }
  });
  Object.keys(fieldsByTable).forEach((tid) => {
    fieldsByTable[tid].sort((a, b) => a.order - b.order);
  });

  // Réorganisation des tables
  const moveTable = (index: number, direction: "up" | "down") => {
    const newTables = [...tables];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newTables.length) return;
    [newTables[index], newTables[targetIndex]] = [
      newTables[targetIndex],
      newTables[index],
    ];
    newTables.forEach((table, idx) => {
      table.order = (idx + 1) * 100;
    });
    setSchemas([...newTables, ...schemas.filter((s) => s.parentFieldId)]);
    setHasOrderChanged(true);
    setError(null);
  };

  // Réorganisation des champs
  const moveField = (
    tableId: string,
    index: number,
    direction: "up" | "down"
  ) => {
    const fields = fieldsByTable[tableId] || [];
    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    [newFields[index], newFields[targetIndex]] = [
      newFields[targetIndex],
      newFields[index],
    ];
    newFields.forEach((field, idx) => {
      field.order = (idx + 1) * 100;
    });
    setSchemas([
      ...tables,
      ...Object.values({
        ...fieldsByTable,
        [tableId]: newFields,
      }).flat(),
    ]);
    setHasOrderChanged(true);
    setError(null);
  };

  // Handlers CRUD et gestion du formulaire
  const handleAddSchema = () => {
    setEditingSchema(null);
    setShowForm(true);
  };

  const handleEditSchema = (schema: SchemaFields) => {
    setEditingSchema(schema);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditingSchema(null);
    setShowForm(false);
  };




  //  onSave reçoit SchemaFormData, on adapte le state local
  const handleSchemaSaved = async (data: SchemaFormData) => {
    setIsLoading(true);
    try {
      if (editingSchema) {
        // Modification d'un champ existant
        setSchemas((prev) =>
          prev.map((s) =>
            s.id === editingSchema.id
              ? { ...s, ...data, updatedAt: new Date() }
              : s
          )
        );
      } else {
        // Création d'un nouveau champ/table
        const newSchema: SchemaFields = {
          ...data,
          id: crypto.randomUUID(),
          projectId,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as SchemaFields;
        setSchemas((prev) => [...prev, newSchema]);
      }
      setShowForm(false);
      setEditingSchema(null);
      setHasOrderChanged(true);
      setError(null);
    } catch (err) {
      setError("Erreur lors de la sauvegarde du champ.");
    } finally {
      setIsLoading(false);
    }
  };





  const handleDeleteSchema = (id: string) => {
    setSchemas((prev) => prev.filter((s) => s.id !== id));
    setHasOrderChanged(true);
  };

  // Helpers pour affichage
  const getFieldTypeIcon = (fieldType: FieldType | null) => {
    switch (fieldType) {
      case FieldType.STRING:
        return <Type className="w-3 h-3" />;
      case FieldType.INTEGER:
      case FieldType.FLOAT:
        return <Hash className="w-3 h-3" />;
      case FieldType.BOOLEAN:
        return <Check className="w-3 h-3" />;
      case FieldType.DATETIME:
        return <Calendar className="w-3 h-3" />;
      case FieldType.ENUM:
        return <User className="w-3 h-3" />;
      default:
        return <Type className="w-3 h-3" />;
    }
  };

  if (showForm) {
    return (
      <SchemaForm
        projectId={projectId}
        project={project}
        schema={editingSchema}
        availableSchemas={schemas.filter((s) => s.id !== editingSchema?.id)}
        onSave={handleSchemaSaved}
        onCancel={handleCloseForm}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Schéma du projet</h2>
        <button
          onClick={handleAddSchema}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Ajouter une table
        </button>
      </div>
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 p-2 rounded flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {error}
        </div>
      )}
      <Accordion type="multiple" className="w-full">
        {tables.map((table, tableIdx) => (
          <AccordionItem key={table.id} value={table.id}>
            {/* Header: Trigger + boutons d'action hors du trigger */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-t-lg">
              {/* Trigger : uniquement le nom de la table */}
              <AccordionTrigger className="flex-1 text-left">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <span className="font-semibold text-lg">{table.name}</span>
                  <span className="ml-2 text-xs text-gray-500">Table</span>
                </div>
              </AccordionTrigger>
              {/* Actions : EN DEHORS du trigger */}
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => moveTable(tableIdx, "up")}
                  disabled={tableIdx === 0 || isLoading}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Déplacer la table vers le haut"
                  tabIndex={-1}
                  type="button"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveTable(tableIdx, "down")}
                  disabled={tableIdx === tables.length - 1 || isLoading}
                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  title="Déplacer la table vers le bas"
                  tabIndex={-1}
                  type="button"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleEditSchema(table)}
                  disabled={isLoading}
                  className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                  title="Éditer la table"
                  tabIndex={-1}
                  type="button"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteSchema(table.id)}
                  disabled={isLoading}
                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                  title="Supprimer la table"
                  tabIndex={-1}
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <AccordionContent className="bg-white px-4 py-3 border-t">
              {(fieldsByTable[table.id] || []).length === 0 ? (
                <div className="text-gray-400 italic">Aucun champ</div>
              ) : (
                <div className="space-y-2">
                  {fieldsByTable[table.id].map((field, fieldIdx) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between border rounded p-2"
                    >
                      <div className="flex items-center space-x-2">
                        {getFieldTypeIcon(field.fieldType)}
                        <span className="font-medium">{field.name}</span>
                        <span className="text-xs text-gray-500">
                          {field.fieldType}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveField(table.id, fieldIdx, "up")}
                          disabled={fieldIdx === 0 || isLoading}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Déplacer le champ vers le haut"
                          type="button"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveField(table.id, fieldIdx, "down")}
                          disabled={
                            fieldIdx === fieldsByTable[table.id].length - 1 ||
                            isLoading
                          }
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Déplacer le champ vers le bas"
                          type="button"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditSchema(field)}
                          disabled={isLoading}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg"
                          title="Éditer le champ"
                          type="button"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchema(field.id)}
                          disabled={isLoading}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                          title="Supprimer le champ"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
