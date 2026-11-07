"use client";
import { useToast } from "@/store/toast";
import { AnimatePresence, motion } from "framer-motion";

export function ToastContainer() {
  const { toasts } = useToast();

  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className={`fixed bottom-5 right-5 z-[60] rounded-2xl px-5 py-3.5 font-semibold shadow-lift min-w-[280px] max-w-[400px] ${toast.type === "success" ? "bg-emerald-500 text-white" : toast.type === "error" ? "bg-red-500 text-white" : "bg-skyx-500 text-white"}`}
        >
          {toast.message}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}