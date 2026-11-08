"use client";
import { create } from "zustand";

export type Order = {
  id: string;
  items: Array<{ id: string; name: string; price: number; qty: number; size?: string; image?: string }>;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  mode: "pickup" | "delivery";
  name: string;
  phone: string;
  email?: string;
  city?: string;
  pincode?: string;
  address?: string;
  paymentMethod: string;
  outletName: string;
  createdAt: string;
  statusIndex: number; // 0-4 → track steps
};

type OrderState = {
  activeOrder: Order | null;
  setOrder: (order: Order) => void;
  updateStatus: (idx: number) => void;
  clear: () => void;
};

export const useOrder = create<OrderState>((set) => ({
  activeOrder: null,
  setOrder: (order) => set({ activeOrder: { ...order } }),
  updateStatus: (idx) => set((s) => (s.activeOrder ? { activeOrder: { ...s.activeOrder, statusIndex: idx } } : s)),
  clear: () => set({ activeOrder: null }),
}));
