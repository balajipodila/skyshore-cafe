"use client";
import { create } from "zustand";
import { DEFAULT_OUTLET_ID } from "@/lib/menu";

type LocationState = {
  outletId: string;
  setOutletId: (id: string) => void;
};

const STORAGE_KEY = "skyshore-outlet";

function initialOutlet(): string {
  if (typeof window === "undefined") return DEFAULT_OUTLET_ID;
  try {
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_OUTLET_ID;
  } catch {
    return DEFAULT_OUTLET_ID;
  }
}

export const useLocation = create<LocationState>((set) => ({
  outletId: initialOutlet(),
  setOutletId: (id) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {}
    set({ outletId: id });
  },
}));
