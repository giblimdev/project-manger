// stores/useProjectStore.ts

import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { Projects } from "@/lib/generated/prisma/client";

interface ProjectState {
  project: Projects | null;
  projectId: string | null;
  hasHydrated: boolean; // ✅ Pour gérer l'hydratation SSR
  setProject: (project: Projects | null) => void;
  setProjectId: (projectId: string | null) => void;
  clearProject: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
}

export const useProjectsStore = create<ProjectState>()(
  devtools(
    persist(
      (set, get) => ({
        project: null,
        projectId: null,
        hasHydrated: false,

        setProject: (project) => {
          set({
            project,
            projectId: project?.id || null,
          });
        },

        setProjectId: (projectId) => set({ projectId }),

        clearProject: () =>
          set({
            project: null,
            projectId: null,
          }),

        setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      }),
      {
        name: "selected-project-storage",
        storage: createJSONStorage(() => {
          // ✅ Vérification côté client pour éviter les erreurs SSR
          if (typeof window !== "undefined") {
            return localStorage;
          }
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }),
        partialize: (state) => ({
          project: state.project,
          projectId: state.projectId,
        }),
        onRehydrateStorage: () => (state) => {
          // ✅ Marque comme hydraté après la restauration
          state?.setHasHydrated(true);
        },
      }
    ),
    { name: "projects-store" }
  )
);
