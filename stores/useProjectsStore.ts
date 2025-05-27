// stores/useProjectsStore.ts
import { create } from "zustand";
import { Projects } from "@/lib/generated/prisma/client";

interface ProjectState {
  project: Projects | null;
  projectId: string | null;
  setProject: (project: Projects) => void;
  setProjectId: (projectId: string) => void;
  clearProject: () => void;
}

export const useProjectsStore = create<ProjectState>((set) => ({
  project: null,
  projectId: null,
  setProject: (project) => set({ project }),
  setProjectId: (projectId) => set({ projectId }),
  clearProject: () => set({ project: null, projectId: null }),
}));
