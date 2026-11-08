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

// Precompute core once — avoids scanning ALL_MENU on every call
const CORE_ITEMS: MenuItem[] = ALL_MENU.filter((m) => !LOCAL_UNION.has(m.id));
const BY_ID = new Map(ALL_MENU.map((m) => [m.id, m]));

// Module-level cache: menu data is static, so cache per outletId
const _cache = new Map<string, MenuItem[]>();

/** CORE items (available everywhere) + that outlet's LOCAL items ONLY. */
export function menuForOutlet(outletId: string): MenuItem[] {
  if (_cache.has(outletId)) return _cache.get(outletId)!;

  const outlet = getOutlet(outletId);
  const out: MenuItem[] = [];
  const seen = new Set<string>();

  // 1. This outlet's local items
  for (const id of outlet.localItemIds ?? []) {
    const item = BY_ID.get(id);
    if (item && !seen.has(item.id)) {
      out.push(item);
      seen.add(item.id);
    }
  }
  // 2. Core items
  for (const item of CORE_ITEMS) {
    if (!seen.has(item.id)) {
      out.push(item);
      seen.add(item.id);
    }
  }

  _cache.set(outletId, out);
  return out;
}

export function localIdsForOutlet(outletId: string): Set<string> {
  return new Set(getOutlet(outletId).localItemIds ?? []);
}
