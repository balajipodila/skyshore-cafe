import type { ReactNode } from "react";

export function Badge({ children, tone = "sky" }: { children: ReactNode; tone?: "sky" | "coral" | "sand" }) {
  const styles = {
    sky: "bg-skyx-100 text-skyx-700 dark:bg-white/10 dark:text-white",
    coral: "bg-coral/15 text-coral-dark dark:text-coral-soft",
    sand: "bg-sand-100 text-navy/80 dark:bg-white/10 dark:text-white",
  }[tone];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>{children}</span>;
}
