"use client";
import { useToast } from "@/store/toast";

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <div className="fixed bottom-5 right-5 z-[60] space-y-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-2xl px-5 py-3.5 font-semibold shadow-lift min-w-[280px] max-w-[400px] animate-slide-up ${
            toast.type === "success"
              ? "bg-emerald-500 text-white"
              : toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-skyx-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
