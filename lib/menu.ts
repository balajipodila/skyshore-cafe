import menu from "@/data/menu.json";
import outlets from "@/data/outlets.json";
import type { MenuItem } from "./types";

export const ALL_MENU: MenuItem[] = menu as MenuItem[];

export type Outlet = (typeof outlets)[number] & {
  lat: number;
  lng: number;
  localItemIds: string[];
};

export const OUTLETS: Outlet[] = outlets as Outlet[];
export const DEFAULT_OUTLET_ID = "vizag-beach-road";

export function getOutlet(id: string | null | undefined): Outlet {
  return OUTLETS.find((o) => o.id === id) ?? OUTLETS.find((o) => o.id === DEFAULT_OUTLET_ID)!;
}

// Items that are marked as "local-only" in ANY outlet (union of all localItemIds) are NOT core.
// Core = items NOT appearing in any outlet's localItemIds. Each outlet sees its own core + its own locals only.
const LOCAL_UNION = new Set(OUTLETS.flatMap((o) => o.localItemIds ?? []));

/** CORE items (available everywhere) + that outlet's LOCAL items ONLY. */
export function menuForOutlet(outletId: string): MenuItem[] {
  const outlet = getOutlet(outletId);
  const byId = new Map(ALL_MENU.map((m) => [m.id, m]));
  const out: MenuItem[] = [];
  const seen = new Set<string>();

  // 1. This outlet's local items
  for (const id of outlet.localItemIds ?? []) {
    const item = byId.get(id);
    if (item && !seen.has(item.id)) {
      out.push(item);
      seen.add(item.id);
    }
  }
  // 2. Core items (NOT in any outlet's local union)
  for (const item of ALL_MENU) {
    if (LOCAL_UNION.has(item.id)) continue; // skip other cities' locals
    if (!seen.has(item.id)) {
      out.push(item);
      seen.add(item.id);
    }
  }
  if (process.env.NODE_ENV === "development") {
    console.log("[menu] outlet", outletId, "items", out.length);
  }
  return out;
}

export function localIdsForOutlet(outletId: string): Set<string> {
  return new Set(getOutlet(outletId).localItemIds ?? []);
}
