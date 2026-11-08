"use client";
import { create } from "zustand";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  points: number;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (email, name) => {
    const derivedName = name || (email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1).toLowerCase());
    set({
      user: {
        id: "usr-" + Math.random().toString(36).slice(2, 10),
        name: derivedName,
        email,
        points: 100, // Welcome bonus (demo)
      },
      isAuthenticated: true,
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
}));
