// stores/useCommentsStore.ts

import { create } from "zustand";

type Comment = {
  id: string;
  title: string;
  content: string;
  thema?: string;
  createdAt: string;
  authorId: string;
  // Ajoutez d'autres champs selon votre modèle
};

type UseCommentsStore = {
  comment: Comment | null;
  setComment: (comment: Comment | null) => void;
  clearComment: () => void;
};

export const useCommentsStore = create<UseCommentsStore>((set) => ({
  comment: null,
  setComment: (comment) => set({ comment }),
  clearComment: () => set({ comment: null }),
}));
