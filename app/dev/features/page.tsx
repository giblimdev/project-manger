"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Folder,
  File,
  Database,
  Shield,
  Users,
  BarChart3,
  MessageSquare,
  FileText,
  Settings,
  Globe,
  Code,
  Layout,
  Zap,
} from "lucide-react";

export default function ArchitecturePage() {
  const [selectedCategory, setSelectedCategory] = useState("auth");

  const pageStructure = {
    auth: {
      title: "Authentification & Sécurité",
      icon: Shield,
      color: "bg-red-50 border-red-200",
      pages: [
        {
          path: "app/auth/login/page.tsx",
          role: "Page de connexion utilisateur",
          description:
            "Interface de connexion avec email/mot de passe et connexions sociales",
          features: [
            "Formulaire de connexion",
            "Validation Better Auth",
            "Redirection après connexion",
          ],
          prismaModels: ["User", "Session", "Account"],
        },
        {
          path: "app/auth/register/page.tsx",
          role: "Page d'inscription utilisateur",
          description:
            "Création de nouveaux comptes utilisateur avec vérification email",
          features: [
            "Formulaire d'inscription",
            "Validation des données",
            "Envoi email de vérification",
          ],
          prismaModels: ["User", "Verification"],
        },
        {
          path: "app/auth/verify-email/page.tsx",
          role: "Vérification d'adresse email",
          description: "Validation des tokens de vérification email",
          features: [
            "Validation token",
            "Activation compte",
            "Feedback utilisateur",
          ],
          prismaModels: ["User", "Verification"],
        },
        {
          path: "app/auth/forgot-password/page.tsx",
          role: "Réinitialisation mot de passe",
          description:
            "Demande et traitement de réinitialisation de mot de passe",
          features: [
            "Formulaire email",
            "Génération token",
            "Envoi email reset",
          ],
          prismaModels: ["User", "Verification"],
        },
      ],
    },
    dashboard: {
      title: "Tableau de Bord",
      icon: BarChart3,
      color: "bg-blue-50 border-blue-200",
      pages: [
        {
          path: "app/dashboard/page.tsx",
          role: "Tableau de bord principal",
          description:
            "Vue d'ensemble des projets, tâches et activités utilisateur",
          features: [
            "Statistiques globales",
            "Projets récents",
            "Tâches assignées",
            "Activité équipe",
          ],
          prismaModels: ["Project", "Task", "User", "ActivityLog"],
        },
        {
          path: "app/dashboard/layout.tsx",
          role: "Layout du dashboard",
          description: "Navigation latérale et structure commune du dashboard",
          features: [
            "Sidebar navigation",
            "Breadcrumbs",
            "User menu",
            "Notifications",
          ],
          prismaModels: ["User", "Project", "Team"],
        },
      ],
    },
    projects: {
      title: "Gestion des Projets",
      icon: Folder,
      color: "bg-green-50 border-green-200",
      pages: [
        {
          path: "app/projects/page.tsx",
          role: "Liste des projets",
          description:
            "Vue d'ensemble de tous les projets avec filtres et recherche",
          features: [
            "Liste projets",
            "Filtres par statut",
            "Recherche",
            "Tri par priorité",
          ],
          prismaModels: ["Project", "User", "Team"],
        },
        {
          path: "app/projects/create/page.tsx",
          role: "Création de projet",
          description: "Formulaire de création de nouveau projet",
          features: [
            "Formulaire projet",
            "Assignation équipes",
            "Définition objectifs",
            "Upload image",
          ],
          prismaModels: ["Project", "Team", "User"],
        },
        {
          path: "app/projects/[projectId]/page.tsx",
          role: "Détails du projet",
          description: "Vue détaillée d'un projet avec toutes ses informations",
          features: [
            "Informations projet",
            "Progression",
            "Équipes assignées",
            "Statistiques",
          ],
          prismaModels: ["Project", "Feature", "UserStory", "Task", "Sprint"],
        },
        {
          path: "app/projects/[projectId]/features/page.tsx",
          role: "Gestion des features",
          description: "Liste et gestion des fonctionnalités du projet",
          features: [
            "Liste features",
            "Hiérarchie parent-enfant",
            "Statuts",
            "Assignations",
          ],
          prismaModels: ["Feature", "Project", "User"],
        },
        {
          path: "app/projects/[projectId]/tasks/page.tsx",
          role: "Vue Kanban des tâches",
          description: "Interface Kanban pour la gestion des tâches",
          features: [
            "Colonnes par statut",
            "Drag & drop",
            "Filtres",
            "Assignations",
          ],
          prismaModels: ["Task", "UserStory", "Feature", "User"],
        },
        {
          path: "app/projects/[projectId]/sprints/page.tsx",
          role: "Gestion des sprints",
          description: "Planification et suivi des sprints agiles",
          features: [
            "Création sprints",
            "Planification",
            "Burndown charts",
            "Retrospectives",
          ],
          prismaModels: ["Sprint", "Project", "Task"],
        },
        {
          path: "app/projects/[projectId]/schema/page.tsx",
          role: "Schémas personnalisés",
          description: "Gestion des schémas de données dynamiques du projet",
          features: [
            "Création schémas",
            "Hiérarchie Schema→Table→Champ",
            "Types de données",
            "Validation",
          ],
          prismaModels: ["ProjectSchema", "SchemaField"],
        },
      ],
    },
    teams: {
      title: "Gestion des Équipes",
      icon: Users,
      color: "bg-purple-50 border-purple-200",
      pages: [
        {
          path: "app/teams/page.tsx",
          role: "Liste des équipes",
          description: "Vue d'ensemble de toutes les équipes et leurs types",
          features: [
            "Liste équipes",
            "Types (organisation/service/projet)",
            "Membres",
            "Projets assignés",
          ],
          prismaModels: ["Team", "User", "Project"],
        },
        {
          path: "app/teams/create/page.tsx",
          role: "Création d'équipe",
          description: "Formulaire de création de nouvelle équipe",
          features: [
            "Formulaire équipe",
            "Sélection type",
            "Invitation membres",
            "Définition privilèges",
          ],
          prismaModels: ["Team", "User"],
        },
        {
          path: "app/teams/[teamId]/page.tsx",
          role: "Détails de l'équipe",
          description: "Vue détaillée d'une équipe avec ses membres et projets",
          features: [
            "Informations équipe",
            "Liste membres",
            "Projets",
            "Statistiques",
          ],
          prismaModels: ["Team", "User", "Project"],
        },
        {
          path: "app/teams/[teamId]/members/page.tsx",
          role: "Gestion des membres",
          description: "Administration des membres de l'équipe",
          features: [
            "Ajout/suppression membres",
            "Gestion rôles",
            "Invitations",
            "Permissions",
          ],
          prismaModels: ["Team", "User"],
        },
      ],
    },
    collaboration: {
      title: "Collaboration",
      icon: MessageSquare,
      color: "bg-yellow-50 border-yellow-200",
      pages: [
        {
          path: "app/projects/[projectId]/comments/page.tsx",
          role: "Système de commentaires",
          description:
            "Interface de commentaires hiérarchiques sur tous les éléments",
          features: [
            "Commentaires hiérarchiques",
            "Mentions utilisateurs",
            "Notifications",
            "Historique",
          ],
          prismaModels: ["Comment", "User", "Project", "Task", "Feature"],
        },
        {
          path: "app/projects/[projectId]/files/page.tsx",
          role: "Gestion de fichiers",
          description:
            "Upload et organisation hiérarchique des fichiers projet",
          features: [
            "Upload fichiers",
            "Organisation hiérarchique",
            "Types multiples",
            "Prévisualisation",
          ],
          prismaModels: ["File", "Project", "User"],
        },
        {
          path: "app/profile/time-tracking/page.tsx",
          role: "Suivi du temps",
          description:
            "Enregistrement et consultation du temps passé sur les tâches",
          features: [
            "Timer tâches",
            "Historique temps",
            "Rapports",
            "Statistiques",
          ],
          prismaModels: ["TimeLog", "Task", "User"],
        },
      ],
    },
    admin: {
      title: "Administration",
      icon: Settings,
      color: "bg-gray-50 border-gray-200",
      pages: [
        {
          path: "app/admin/page.tsx",
          role: "Dashboard administrateur",
          description: "Vue d'ensemble pour les administrateurs système",
          features: [
            "Statistiques globales",
            "Gestion utilisateurs",
            "Monitoring",
            "Configuration",
          ],
          prismaModels: ["User", "Project", "Team", "ActivityLog"],
        },
        {
          path: "app/admin/users/page.tsx",
          role: "Gestion des utilisateurs",
          description: "Administration complète des comptes utilisateur",
          features: [
            "Liste utilisateurs",
            "Gestion rôles",
            "Activation/désactivation",
            "Statistiques",
          ],
          prismaModels: ["User", "Session", "Account"],
        },
        {
          path: "app/admin/activity-logs/page.tsx",
          role: "Logs d'activité",
          description: "Consultation des journaux d'audit système",
          features: ["Logs système", "Filtres avancés", "Export", "Recherche"],
          prismaModels: ["ActivityLog", "User"],
        },
      ],
    },
    roadmap: {
      title: "Roadmap",
      icon: Zap,
      color: "bg-indigo-50 border-indigo-200",
      pages: [
        {
          path: "app/roadmap/page.tsx",
          role: "Vue générale roadmap",
          description:
            "Affichage de la roadmap de développement avec progression",
          features: [
            "Timeline développement",
            "Phases",
            "Progression",
            "Dépendances",
          ],
          prismaModels: ["RoadMap", "Project"],
        },
        {
          path: "app/roadmap/create/page.tsx",
          role: "Création élément roadmap",
          description: "Ajout de nouveaux éléments à la roadmap",
          features: [
            "Formulaire roadmap",
            "Estimation temps",
            "Technologies",
            "Livrables",
          ],
          prismaModels: ["RoadMap", "Project", "User"],
        },
      ],
    },
  };

  const apiRoutes = [
    {
      path: "app/api/auth/login/route.ts",
      role: "API de connexion",
      methods: ["POST"],
      description: "Authentification utilisateur avec Better Auth",
    },
    {
      path: "app/api/projects/route.ts",
      role: "API projets",
      methods: ["GET", "POST"],
      description: "CRUD des projets",
    },
    {
      path: "app/api/projects/[projectId]/route.ts",
      role: "API projet spécifique",
      methods: ["GET", "PUT", "DELETE"],
      description: "Gestion d'un projet spécifique",
    },
    {
      path: "app/api/teams/route.ts",
      role: "API équipes",
      methods: ["GET", "POST"],
      description: "CRUD des équipes",
    },
    {
      path: "app/api/tasks/route.ts",
      role: "API tâches",
      methods: ["GET", "POST"],
      description: "CRUD des tâches",
    },
    {
      path: "app/api/files/upload/route.ts",
      role: "API upload fichiers",
      methods: ["POST"],
      description: "Upload sécurisé de fichiers",
    },
  ];

  const supportFiles = [
    {
      path: "lib/prisma.ts",
      role: "Client Prisma",
      description:
        "Instance singleton du client Prisma pour la base de données",
    },
    {
      path: "lib/auth/config.ts",
      role: "Configuration Better Auth",
      description: "Configuration de l'authentification et des sessions",
    },
    {
      path: "lib/services/email-service.ts",
      role: "Service email",
      description: "Gestion des emails avec Resend/Nodemailer",
    },
    {
      path: "lib/utils/date-service.ts",
      role: "Service de dates",
      description: "Utilitaires pour la gestion des dates avec date-fns",
    },
    {
      path: "components/ui/",
      role: "Composants UI",
      description: "Composants réutilisables (Button, Card, Modal, etc.)",
    },
    {
      path: "components/layout/",
      role: "Composants layout",
      description:
        "Header, Footer, Sidebar et autres composants de mise en page",
    },
  ];

  const getIcon = (iconName: string) => {
    const icons = {
      Shield,
      Users,
      Folder,
      BarChart3,
      MessageSquare,
      Settings,
      Zap,
      File,
      Code,
      Layout,
      Globe,
      Database,
      FileText,
    };
    const Icon = icons[iconName as keyof typeof icons] || File;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Architecture de l'Application
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Structure complète de votre application de gestion de projets agile
          avec Next.js 15+, Prisma et votre schéma de base de données
          personnalisé
        </p>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pages">Pages & Routes</TabsTrigger>
          <TabsTrigger value="api">API Routes</TabsTrigger>
          <TabsTrigger value="structure">Structure Fichiers</TabsTrigger>
          <TabsTrigger value="prisma">Modèles Prisma</TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-6">
          {/* Category Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.entries(pageStructure).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    selectedCategory === key
                      ? category.color + " border-current"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{category.title}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Category Pages */}
          <div className="grid gap-4">
            {pageStructure[
              selectedCategory as keyof typeof pageStructure
            ]?.pages.map((page, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Code className="w-5 h-5 text-blue-600" />
                        <span>{page.path}</span>
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{page.role}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {page.features.length} fonctionnalités
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{page.description}</p>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm">
                      Fonctionnalités principales :
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                      {page.features.map((feature, idx) => (
                        <div
                          key={idx}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 text-sm">
                      Modèles Prisma utilisés :
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {page.prismaModels.map((model, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">API Routes</h2>
          {apiRoutes.map((route, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-blue-600">{route.path}</span>
                  <div className="flex gap-1">
                    {route.methods.map((method) => (
                      <Badge key={method} variant="outline" className="text-xs">
                        {method}
                      </Badge>
                    ))}
                  </div>
                </CardTitle>
                <p className="text-sm text-gray-600">{route.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{route.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            Structure des Fichiers Support
          </h2>
          {supportFiles.map((file, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span>{file.path}</span>
                </CardTitle>
                <p className="text-sm text-gray-600">{file.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{file.description}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="prisma" className="space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            Intégration avec votre Schéma Prisma
          </h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-purple-600" />
                <span>Modèles Principaux</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: "User",
                    usage: "Authentification, profils, assignations",
                  },
                  { name: "Project", usage: "Gestion projets, roadmap" },
                  {
                    name: "Team",
                    usage: "Organisation équipes, collaboration",
                  },
                  { name: "Task", usage: "Gestion tâches, Kanban, suivi" },
                  { name: "Feature", usage: "Fonctionnalités, hiérarchie" },
                  {
                    name: "UserStory",
                    usage: "User stories, méthodologie agile",
                  },
                  { name: "Sprint", usage: "Sprints, planification agile" },
                  { name: "Comment", usage: "Collaboration, discussions" },
                  { name: "File", usage: "Gestion documents, uploads" },
                  { name: "TimeLog", usage: "Suivi temps, rapports" },
                  { name: "ActivityLog", usage: "Audit, traçabilité" },
                  {
                    name: "ProjectSchema",
                    usage: "Schémas dynamiques, flexibilité",
                  },
                ].map((model, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-purple-700">
                      {model.name}
                    </h4>
                    <p className="text-sm text-gray-600">{model.usage}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
