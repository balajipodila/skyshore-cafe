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
  signup: (name: string, email: string, phone?: string) => void;
  logout: () => void;
};

const STORAGE_KEY = "skyshore_user";

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const useAuth = create<AuthState>((set) => {
  const initialUser = getInitialUser();
  return {
    user: initialUser,
    isAuthenticated: !!initialUser,
    login: (email, name) => {
      const u: User = {
        id: "usr-" + Date.now(),
        name: name || (email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1)),
        email,
        phone: "+91 98765 43210",
        points: 340,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } catch {}
      set({ user: u, isAuthenticated: true });
    },
    signup: (name, email, phone) => {
      const u: User = {
        id: "usr-" + Date.now(),
        name,
        email,
        phone: phone || "+91 98765 43210",
        points: 100, // Welcome points
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      } catch {}
      set({ user: u, isAuthenticated: true });
    },
    logout: () => {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
      set({ user: null, isAuthenticated: false });
    },
  };
});
