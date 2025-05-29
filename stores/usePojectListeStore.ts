// lib/stores/useProjectListStore.ts

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Projects } from "@/lib/generated/prisma/client";

// Type étendu pour inclure les relations selon le schéma
type ProjectWithRelations = Projects & {
  teams?: { id: string; name: string }[];
  creator?: { id: string; name: string | null };
  _count?: {
    users: number;
    features: number;
    tasks: number;
    userStories: number;
    sprints: number;
    files: number;
    comments: number;
  };
};

interface ProjectListState {
  // État de la liste uniquement
  projects: ProjectWithRelations[];
  loading: boolean;
  error: string | null;
}

interface ProjectListActions {
  // Actions pour modifier la liste uniquement
  setProjects: (projects: ProjectWithRelations[]) => void;
  addProject: (project: ProjectWithRelations) => void;
  updateProject: (project: ProjectWithRelations) => void;
  removeProject: (projectId: string) => void;
  clearProjects: () => void;

  // Actions pour l'état de chargement et d'erreur
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type ProjectListStore = ProjectListState & ProjectListActions;

export const useProjectListStore = create<ProjectListStore>()(
  devtools(
    (set) => ({
      // État initial
      projects: [],
      loading: false,
      error: null,

      // Actions pour modifier la liste uniquement
      setProjects: (projects) => set({ projects }),

      addProject: (project) =>
        set((state) => ({
          projects: [project, ...state.projects],
        })),

      updateProject: (updatedProject) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === updatedProject.id ? updatedProject : project
          ),
        })),

      removeProject: (projectId) =>
        set((state) => ({
          projects: state.projects.filter(
            (project) => project.id !== projectId
          ),
        })),

      clearProjects: () => set({ projects: [] }),

      // Actions pour l'état de chargement et d'erreur
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    { name: "project-list-store" }
  )
);
