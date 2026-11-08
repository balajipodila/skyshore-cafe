"use client";
import { useEffect, useState } from "react";
import { useLocation, hydrateLocationStore } from "@/store/location";
import { nearestOutlet } from "@/lib/location";
import { DEFAULT_OUTLET_ID, getOutlet } from "@/lib/menu";
import { useToast } from "@/store/toast";

export function LocationProvider() {
  const [prompt, setPrompt] = useState(false);
  const setOutletId = useLocation((s) => s.setOutletId);
  const { add: addToast } = useToast();

  useEffect(() => {
    hydrateLocationStore();

    let dismissed: string | null = null;
    try {
      dismissed = localStorage.getItem("skyshore-loc-dismissed");
    } catch {}
    const has = (() => {
      try {
        return !!localStorage.getItem("skyshore-outlet");
      } catch {
        return false;
      }
    })();
    if (!dismissed && !has) setPrompt(true);
  }, []);

  function allow() {
    setPrompt(false);
    if (!("geolocation" in navigator)) {
      setOutletId(DEFAULT_OUTLET_ID);
      addToast(`Showing Skyshore ${getOutlet(DEFAULT_OUTLET_ID).city}`);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = nearestOutlet(pos.coords.latitude, pos.coords.longitude);
        setOutletId(nearest.id);
        addToast(`Showing Skyshore ${nearest.city}`);
        try {
          localStorage.setItem("skyshore-loc-dismissed", "1");
        } catch {}
      },
      () => {
        setOutletId(DEFAULT_OUTLET_ID);
        addToast(`Showing Skyshore ${getOutlet(DEFAULT_OUTLET_ID).city}`);
        try {
          localStorage.setItem("skyshore-loc-dismissed", "1");
        } catch {}
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  function dismiss() {
    setPrompt(false);
    setOutletId(DEFAULT_OUTLET_ID);
    addToast(`Showing Skyshore ${getOutlet(DEFAULT_OUTLET_ID).city}`);
    try {
      localStorage.setItem("skyshore-loc-dismissed", "1");
    } catch {}
  }

  if (!prompt) return null;

  return (
    <div
      role="dialog"
      aria-label="Location prompt"
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 glass rounded-full px-5 py-3 flex items-center gap-3 max-w-[92vw] animate-pop-in"
    >
      <p className="text-sm font-medium whitespace-nowrap">Allow location to see what&apos;s fresh near you</p>
      <button
        type="button"
        onClick={allow}
        className="shrink-0 rounded-full bg-coral text-white px-4 py-2 text-sm font-semibold min-h-[36px]"
      >
        Allow
      </button>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 rounded-full bg-white/70 dark:bg-white/10 px-4 py-2 text-sm font-semibold min-h-[36px]"
      >
        Not now
      </button>
    </div>
  );
}
