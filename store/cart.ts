"use client";
import { create } from "zustand";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  size?: string;
  image?: string;
};

type CartState = {
  items: CartItem[];
  isDrawerOpen: boolean;
  lastAddedItem: CartItem | null;
  add: (item: CartItem) => void;
  remove: (id: string, size?: string) => void;
  clear: () => void;
  setDrawerOpen: (open: boolean) => void;
  clearLastAdded: () => void;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>((set, get) => ({
  items: [],
  isDrawerOpen: false,
  lastAddedItem: null,
  add: (item) =>
    set((s) => {
      const key = (i: CartItem) => `${i.id}-${i.size ?? "base"}`;
      const existing = s.items.find((i) => key(i) === key(item));
      let newItems: CartItem[];
      if (existing) {
        newItems = s.items.map((i) =>
          key(i) === key(item) ? { ...i, qty: i.qty + item.qty } : i
        );
      } else {
        newItems = [...s.items, item];
      }
      return {
        items: newItems,
        lastAddedItem: { ...item },
      };
    }),
  remove: (id, size) =>
    set((s) => ({
      items: s.items.filter((i) => !(i.id === id && (i.size ?? "base") === (size ?? "base"))),
    })),
  clear: () => set({ items: [] }),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  clearLastAdded: () => set({ lastAddedItem: null }),
  total: () => get().items.reduce((a, i) => a + i.price * i.qty, 0),
  count: () => get().items.reduce((a, i) => a + i.qty, 0),
}));
