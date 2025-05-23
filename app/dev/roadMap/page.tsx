"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  Calendar,
  Users,
  Database,
  Shield,
  FileText,
  MessageSquare,
  BarChart3,
  Rocket,
} from "lucide-react";
import roadmapData from "@/data/roadmapData";

export default function DevelopmentRoadmapPage() {
  const [tasks, setTasks] = useState(roadmapData);

  const updateProgress = (taskId: string, newProgress: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, progress: newProgress } : task
      )
    );
  };

  const getStatusColor = (progress: number) => {
    if (progress === 0) return "bg-gray-200";
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    if (progress < 100) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStatusText = (progress: number) => {
    if (progress === 0) return "Non commencé";
    if (progress < 100) return "En cours";
    return "Terminé";
  };

  const totalDuration = tasks.reduce(
    (sum, task) => sum + task.estimatedDays,
    0
  );
  const completedTasks = tasks.filter((task) => task.progress === 100).length;
  const overallProgress =
    tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length;

  const getPhaseIcon = (phase: string) => {
    const icons = {
      Setup: Database,
      Authentication: Shield,
      Core: Users,
      Agile: BarChart3,
      Collaboration: MessageSquare,
      Files: FileText,
      Advanced: Database,
      Quality: CheckCircle,
      Deployment: Rocket,
    };
    const Icon = icons[phase as keyof typeof icons] || Clock;
    return <Icon className="w-5 h-5" />;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Roadmap de Développement - Application de Gestion de Projets
        </h1>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto">
          Développement complet d'une plateforme de gestion de projets agile
          avec Next.js 15+, Prisma et toutes les fonctionnalités avancées
          définies dans le schéma
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Durée totale</p>
                <p className="text-2xl font-bold">{totalDuration} jours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Tâches terminées</p>
                <p className="text-2xl font-bold">
                  {completedTasks}/{tasks.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Progression globale</p>
                <p className="text-2xl font-bold">
                  {Math.round(overallProgress)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Estimation</p>
                <p className="text-2xl font-bold">
                  {Math.round(totalDuration / 5)} semaines
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Global Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Progression Globale du Projet</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={overallProgress} className="w-full h-3 mb-2" />
          <p className="text-sm text-gray-600">
            {Math.round(overallProgress)}% complété - {completedTasks} tâches
            terminées sur {tasks.length}
          </p>
        </CardContent>
      </Card>

      {/* Tasks Timeline */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">Phases de Développement</h2>

        {tasks.map((task, index) => (
          <Card key={task.id} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                    {getPhaseIcon(task.phase)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant="outline" className="text-xs">
                        Phase {index + 1}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {task.phase}
                      </Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {task.estimatedDays} jours
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <Badge
                    variant={
                      task.progress === 100
                        ? "default"
                        : task.progress > 0
                        ? "secondary"
                        : "outline"
                    }
                    className="mb-2"
                  >
                    {getStatusText(task.progress)}
                  </Badge>
                  <p className="text-2xl font-bold text-gray-900">
                    {task.progress}%
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-600">{task.description}</p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression</span>
                  <span>{task.progress}%</span>
                </div>
                <Progress value={task.progress} className="w-full h-2" />
              </div>

              {/* Deliverables */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">
                  Livrables principaux :
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {task.deliverables.map((deliverable, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{deliverable}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div>
                <h4 className="font-semibold mb-2 text-sm">
                  Technologies utilisées :
                </h4>
                <div className="flex flex-wrap gap-1">
                  {task.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dependencies */}
              {task.dependencies.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-sm">Dépendances :</h4>
                  <div className="flex flex-wrap gap-1">
                    {task.dependencies.map((dep, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        Phase {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex space-x-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    updateProgress(task.id, Math.min(100, task.progress + 25))
                  }
                  disabled={task.progress === 100}
                >
                  +25% Progression
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateProgress(task.id, 100)}
                  disabled={task.progress === 100}
                >
                  Marquer terminé
                </Button>
              </div>
            </CardContent>

            {/* Progress indicator line */}
            <div
              className={`absolute left-0 top-0 w-1 h-full ${getStatusColor(
                task.progress
              )}`}
            ></div>
          </Card>
        ))}
      </div>

      {/* Timeline Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Résumé de la Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Phase 1-3</h3>
              <p className="text-sm text-blue-700">Fondations (30 jours)</p>
              <p className="text-xs text-blue-600">
                Setup, Auth, Core Features
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-900">Phase 4-7</h3>
              <p className="text-sm text-green-700">
                Fonctionnalités (55 jours)
              </p>
              <p className="text-xs text-green-600">
                Agile, Collaboration, Files, Advanced
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-900">Phase 8-10</h3>
              <p className="text-sm text-purple-700">Finalisation (27 jours)</p>
              <p className="text-xs text-purple-600">
                Testing, Optimization, Deployment
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
