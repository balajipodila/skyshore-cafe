"use client";
import { create } from "zustand";
import { DEFAULT_OUTLET_ID } from "@/lib/menu";

type LocationState = {
  outletId: string;
  setOutletId: (id: string) => void;
};

const STORAGE_KEY = "skyshore-outlet";

function getStoredOutlet(): string {
  if (typeof window === "undefined") return DEFAULT_OUTLET_ID;
  try {
    return window.localStorage.getItem(STORAGE_KEY) || DEFAULT_OUTLET_ID;
  } catch {
    return DEFAULT_OUTLET_ID;
  }
}

// Always start with the default on both server and client to prevent hydration mismatch.
// The correct local outlet is loaded in a useEffect after mount (LocationProvider).
export const useLocation = create<LocationState>((set) => ({
  outletId: DEFAULT_OUTLET_ID,
  setOutletId: (id) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {}
    set({ outletId: id });
  },
}));

// Expose helper for hydration after mount
export function hydrateLocationStore() {
  const stored = getStoredOutlet();
  if (stored) {
    useLocation.setState({ outletId: stored });
  }
}
