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

/** CORE items (available everywhere) + that outlet's LOCAL items. */
export function menuForOutlet(outletId: string): MenuItem[] {
  const outlet = getOutlet(outletId);
  const byId = new Map(ALL_MENU.map((m) => [m.id, m]));
  const out: MenuItem[] = [];
  const seen = new Set<string>();
  // local first so "Only at {city}" items surface, then core
  for (const id of outlet.localItemIds ?? []) {
    const item = byId.get(id);
    if (item && !seen.has(item.id)) {
      out.push(item);
      seen.add(item.id);
    }
  }
  for (const item of ALL_MENU) {
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
