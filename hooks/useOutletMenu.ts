"use client";
import { useMemo } from "react";
import { useLocation } from "@/store/location";
import { menuForOutlet, localIdsForOutlet, getOutlet } from "@/lib/menu";

/**
 * Shared hook — returns the selected outlet's menu (core + own locals).
 * Uses useMemo so the result is stable across re-renders.
 */
export function useOutletMenu() {
  const outletId = useLocation((s) => s.outletId);
  return useMemo(() => {
    const menu = menuForOutlet(outletId);
    if (process.env.NODE_ENV === "development") {
      console.log("[menu] outlet", outletId, "items", menu.length);
    }
    return menu;
  }, [outletId]);
}

export function useOutlet() {
  const outletId = useLocation((s) => s.outletId);
  return getOutlet(outletId);
}

export function useLocalIds() {
  const outletId = useLocation((s) => s.outletId);
  return useMemo(() => localIdsForOutlet(outletId), [outletId]);
}
