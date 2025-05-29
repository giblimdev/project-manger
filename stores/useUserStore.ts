// stores/useUserStore.ts
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
}

interface SessionData {
  user: User;
}

interface UserStore {
  data: SessionData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (userData: User) => void;
  updateUser: (updates: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  // État initial
  data: null,
  isLoading: false,
  error: null,

  // Actions
  setUser: (userData: User) => {
    set({
      data: { user: userData },
      error: null,
      isLoading: false,
    });
  },

  updateUser: (updates: Partial<User>) => {
    const currentData = get().data;
    if (currentData) {
      set({
        data: {
          user: {
            ...currentData.user,
            ...updates,
            updatedAt: new Date(),
          },
        },
      });
    }
  },

  clearUser: () => {
    set({
      data: null,
      error: null,
      isLoading: false,
    });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error, isLoading: false });
  },

  reset: () => {
    set({
      data: null,
      isLoading: false,
      error: null,
    });
  },
}));
