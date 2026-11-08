"use client";
import { create } from "zustand";
import { DEFAULT_OUTLET_ID } from "@/lib/menu";

export type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

type ToastState = {
  toasts: Toast[];
  add: (message: string, type?: Toast["type"]) => void;
  remove: (id: string) => void;
};

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  add: (message, type = "success") => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  remove: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));
