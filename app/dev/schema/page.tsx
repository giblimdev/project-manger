import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DatabaseSchemaPage() {
  const tables = [
    {
      name: "User",
      description: "Gestion des utilisateurs et authentification",
      fields: [
        {
          name: "id",
          type: "String",
          key: "PK",
          required: true,
          unique: false,
        },
        { name: "name", type: "String", nullable: true, unique: false },
        { name: "email", type: "String", unique: true, nullable: true },
        {
          name: "emailVerified",
          type: "Boolean",
          default: "false",
          unique: false,
        },
        { name: "image", type: "String", nullable: true, unique: false },
        { name: "role", type: "Role", default: "USER", unique: false },
        {
          name: "lang",
          type: "String",
          default: "en",
          nullable: true,
          unique: false,
        },
        {
          name: "createdAt",
          type: "DateTime",
          default: "now()",
          unique: false,
        },
        { name: "updatedAt", type: "DateTime", auto: true, unique: false },
      ],
      relations: [
        "sessions (1:N)",
        "accounts (1:N)",
        "verifications (1:N)",
        "projects (N:N)",
        "createdProjects (1:N)",
        "createdFeatures (1:N)",
        "createdUserStories (1:N)",
        "assignedTasks (1:N)",
        "authoredComments (1:N)",
        "timeLogs (1:N)",
        "activityLogs (1:N)",
        "uploadedFiles (1:N)",
        "createdTeams (1:N)",
        "memberTeams (N:N)",
      ],
    },
    {
      name: "Team",
      description:
        "Organisation en équipes (organisation, service, équipe projet)",
      fields: [
        {
          name: "id",
          type: "String",
          key: "PK",
          required: true,
          unique: false,
        },
        { name: "name", type: "String", required: true, unique: false },
        { name: "description", type: "String", nullable: true, unique: false },
        { name: "image", type: "String", nullable: true, unique: false },
        { name: "privileges", type: "String", nullable: true, unique: false },
        { name: "teamType", type: "String", required: true, unique: false },
        { name: "creatorId", type: "String", nullable: true, unique: false },
        {
          name: "createdAt",
          type: "DateTime",
          default: "now()",
          unique: false,
        },
        { name: "updatedAt", type: "DateTime", auto: true, unique: false },
      ],
      relations: [
        "creator (N:1 User)",
        "members (N:N User)",
        "projects (N:N Project)",
      ],
    },
    {
      name: "Project",
      description: "Projets avec statuts et priorités",
      fields: [
        {
          name: "id",
          type: "String",
          key: "PK",
          required: true,
          unique: false,
        },
        { name: "name", type: "String", required: true, unique: false },
        { name: "description", type: "String", nullable: true, unique: false },
        { name: "image", type: "String", nullable: true, unique: false },
        { name: "status", type: "Status", default: "TODO", unique: false },
        { name: "priority", type: "Int", default: "1", unique: false },
        { name: "startDate", type: "DateTime", nullable: true, unique: false },
        { name: "endDate", type: "DateTime", nullable: true, unique: false },
        { name: "creatorId", type: "String", nullable: true, unique: false },
        {
          name: "createdAt",
          type: "DateTime",
          default: "now()",
          unique: false,
        },
        { name: "updatedAt", type: "DateTime", auto: true, unique: false },
      ],
      relations: [
        "creator (N:1 User)",
        "users (N:N User)",
        "teams (N:N Team)",
        "features (1:N)",
        "userStories (1:N)",
        "sprints (1:N)",
        "files (1:N)",
        "comments (1:N)",
        "projectSchemas (1:N)",
      ],
    },
    {
      name: "Feature",
      description: "Fonctionnalités avec hiérarchie parent-enfant",
      fields: [
        {
          name: "id",
          type: "String",
          key: "PK",
          required: true,
          unique: false,
        },
        { name: "name", type: "String", required: true, unique: false },
        { name: "description", type: "String", nullable: true, unique: false },
        { name: "status", type: "Status", default: "TODO", unique: false },
        { name: "priority", type: "Int", default: "1", unique: false },
        { name: "startDate", type: "DateTime", nullable: true, unique: false },
        { name: "endDate", type: "DateTime", nullable: true, unique: false },
        { name: "projectId", type: "String", required: true, unique: false },
        { name: "creatorId", type: "String", required: true, unique: false },
        {
          name: "parentFeatureId",
          type: "String",
          nullable: true,
          unique: false,
        },
      ],
      relations: [
        "project (N:1 Project)",
        "creator (N:1 User)",
        "parentFeature (N:1 Feature)",
        "childFeatures (1:N Feature)",
        "tasks (1:N)",
        "comments (1:N)",
      ],
    },
    {
      name: "UserStory",
      description: "User stories avec hiérarchie et objectifs",
      fields: [
        {
          name: "id",
          type: "String",
          key: "PK",
          required: true,
          unique: false,
        },
        { name: "title", type: "String", required: true, unique: false },
        { name: "goal", type: "String", nullable: true, unique: false },
        { name: "name", type: "String", required: true, unique: false },
        { name: "description", type: "String", nullable: true, unique: false },
        { name: "status", type: "Status", default: "TODO", unique: false },
        { name: "priority", type: "Int", default: "1", unique: false },
        { name: "projectId", type: "String", required: true, unique: false },
        { name: "creatorId", type: "String", required: true, unique: false },
        {
          name: "parentUserStoryId",
          type: "String",
          nullable: true,
          unique: false,
        },
      ],
      relations: [
        "project (N:1 Project)",
        "creator (N:1 User)",
        "parentUserStory (N:1 UserStory)",
        "childUserStories (1:N UserStory)",
        "tasks (1:N)",
        "comments (1:N)",
      ],
    },
    {
      name: "Sprint",
      description:
        "Sprints avec statuts (PLANNED, ACTIVE, COMPLETED, CANCELLED)",
      fields: [
        {
          name: "id",
          type: "String",
          key: "PK",
          required: true,
          unique: false,
        },
        { name: "name", type: "String", required: true, unique: false },
        { name: "startDate", type: "DateTime", required: true, unique: false },
        { name: "endDate", type: "DateTime", required: true, unique: false },
        {
          name: "status",
          type: "SprintStatus",
          default: "PLANNED",
          unique: false,
        },
        { name: "projectId", type: "String", required: true, unique: false },
      ],
      relations: ["project (N:1 Project)"],
    },
    {
      name: "Task",
      description: "Tâches assignables avec hiérarchie",
      fields: [
        {
          name: "id",
          type: "String",
          key: "PK",
          required: true,
          unique: false,
        },
        { name: "title", type: "String", required: true, unique: false },
        { name: "description", type: "String", nullable: true, unique: false },
        { name: "status", type: "Status", default: "TODO", unique: false },
        { name: "priority", type: "Int", default: "1", unique: false },
        { name: "dueDate", type: "DateTime", nullable: true, unique: false },
        { name: "assigneeId", type: "String", nullable: true, unique: false },
        { name: "storyId", type: "String", required: true, unique: false },
        { name: "featureId", type: "String", nullable: true, unique: false },
        { name: "parentTaskId", type: "String", nullable: true, unique: false },
      ],
      relations: [
        "assignee (N:1 User)",
        "story (N:1 UserStory)",
        "feature (N:1 Feature)",
        "parentTask (N:1 Task)",
        "childTasks (1:N Task)",
        "timeLogs (1:N)",
        "comments (1:N)",
      ],
    },
  ];

  const enums = [
    {
      name: "Role",
      values: ["USER", "READER", "AUTHOR", "DEV", "ADMIN"],
      description: "Rôles utilisateur",
    },
    {
      name: "Status",
      values: ["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED", "CANCELLED"],
      description: "Statuts des éléments",
    },
    {
      name: "FileType",
      values: [
        "PAGE",
        "COMPONENT",
        "UTIL",
        "LIB",
        "STORE",
        "DOCUMENT",
        "IMAGE",
        "SPREADSHEET",
        "PRESENTATION",
        "ARCHIVE",
        "CODE",
        "OTHER",
      ],
      description: "Types de fichiers",
    },
    {
      name: "SprintStatus",
      values: ["PLANNED", "ACTIVE", "COMPLETED", "CANCELLED"],
      description: "Statuts des sprints",
    },
    {
      name: "FieldType",
      values: [
        "STRING",
        "INTEGER",
        "BOOLEAN",
        "DATE",
        "DATETIME",
        "FLOAT",
        "JSON",
        "TEXT",
        "UUID",
      ],
      description: "Types de champs pour les schémas dynamiques",
    },
  ];

  const supportTables = [
    {
      name: "Session",
      description: "Sessions utilisateur sécurisées",
      purpose: "Authentification",
    },
    {
      name: "Account",
      description: "Comptes liés aux fournisseurs d'authentification",
      purpose: "Authentification",
    },
    {
      name: "Verification",
      description: "Vérifications par email",
      purpose: "Authentification",
    },
    {
      name: "TimeLog",
      description: "Suivi du temps passé sur les tâches",
      purpose: "Gestion du temps",
    },
    {
      name: "Comment",
      description: "Commentaires hiérarchiques sur tous les éléments",
      purpose: "Collaboration",
    },
    {
      name: "File",
      description: "Gestion de fichiers avec hiérarchie",
      purpose: "Documentation",
    },
    {
      name: "ActivityLog",
      description: "Journal d'activité pour l'audit",
      purpose: "Traçabilité",
    },
    {
      name: "ProjectSchema",
      description: "Schémas de base de données personnalisés",
      purpose: "Flexibilité",
    },
    {
      name: "SchemaField",
      description:
        "Champs des schémas avec hiérarchie (Schema > Table > Champ)",
      purpose: "Flexibilité",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Schéma de Base de Données - Système de Gestion de Projets
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Plateforme complète de gestion de projets avec méthodologie agile,
          collaboration d'équipes, suivi du temps et schémas de données
          personnalisables
        </p>
      </div>

      <Tabs defaultValue="core" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="core">Tables Principales</TabsTrigger>
          <TabsTrigger value="support">Tables Support</TabsTrigger>
          <TabsTrigger value="enums">Énumérations</TabsTrigger>
          <TabsTrigger value="relations">Relations</TabsTrigger>
        </TabsList>

        <TabsContent value="core" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <Card key={table.name} className="h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-blue-600">{table.name}</span>
                    <Badge variant="outline">
                      {table.fields.length} champs
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600">{table.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Champs :</h4>
                    <div className="space-y-1">
                      {table.fields.map((field) => (
                        <div
                          key={field.name}
                          className="flex justify-between items-center text-sm"
                        >
                          <span
                            className={`${
                              field.key === "PK"
                                ? "font-bold text-blue-600"
                                : ""
                            }`}
                          >
                            {field.name}
                          </span>
                          <div className="flex gap-1">
                            <Badge variant="secondary" className="text-xs">
                              {field.type}
                            </Badge>
                            {field.key && (
                              <Badge variant="default" className="text-xs">
                                {field.key}
                              </Badge>
                            )}
                            {field.unique === true && (
                              <Badge variant="outline" className="text-xs">
                                UNIQUE
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Relations :</h4>
                    <div className="space-y-1">
                      {table.relations.map((relation, idx) => (
                        <div
                          key={idx}
                          className="text-xs text-gray-600 bg-gray-50 p-1 rounded"
                        >
                          {relation}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {supportTables.map((table) => (
              <Card key={table.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="text-green-600">{table.name}</span>
                    <Badge variant="outline">{table.purpose}</Badge>
                  </CardTitle>
                  <p className="text-sm text-gray-600">{table.description}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enums" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {enums.map((enumItem) => (
              <Card key={enumItem.name}>
                <CardHeader>
                  <CardTitle className="text-purple-600">
                    {enumItem.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    {enumItem.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {enumItem.values.map((value) => (
                      <Badge
                        key={value}
                        variant="secondary"
                        className="text-xs"
                      >
                        {value}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="relations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Architecture des Relations</CardTitle>
              <p className="text-gray-600">
                Vue d'ensemble des relations entre les entités principales
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">
                    Relations Hiérarchiques
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>Feature → Feature</strong>
                      <br />
                      Auto-relation parent-enfant pour organiser les
                      fonctionnalités
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>UserStory → UserStory</strong>
                      <br />
                      Auto-relation pour décomposer les user stories
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>Task → Task</strong>
                      <br />
                      Auto-relation pour sous-tâches
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>Comment → Comment</strong>
                      <br />
                      Auto-relation pour discussions hiérarchiques
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>File → File</strong>
                      <br />
                      Auto-relation pour organisation des fichiers
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <strong>SchemaField → SchemaField</strong>
                      <br />
                      Hiérarchie Schema → Table → Champ
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">
                    Relations Many-to-Many
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-green-50 rounded">
                      <strong>User ↔ Project</strong>
                      <br />
                      Utilisateurs assignés aux projets
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <strong>User ↔ Team</strong>
                      <br />
                      Membres des équipes
                    </div>
                    <div className="p-3 bg-green-50 rounded">
                      <strong>Team ↔ Project</strong>
                      <br />
                      Équipes collaborant sur les projets
                    </div>
                  </div>

                  <h3 className="font-semibold text-lg mt-4">
                    Relations Polymorphes
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-3 bg-yellow-50 rounded">
                      <strong>Comment</strong>
                      <br />
                      Peut être attaché à Project, Feature, UserStory ou Task
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">
                  Flux de Données Principal
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>User</strong> → crée des <strong>Teams</strong> → qui
                  travaillent sur des <strong>Projects</strong> → contenant des{" "}
                  <strong>Features</strong> → décomposées en{" "}
                  <strong>UserStories</strong> → implémentées via des{" "}
                  <strong>Tasks</strong> → suivies dans des{" "}
                  <strong>Sprints</strong> → avec <strong>TimeLog</strong> et{" "}
                  <strong>Comments</strong> pour la collaboration
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
