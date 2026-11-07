import type { ReactNode } from "react";

export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`glass rounded-glass p-5 sm:p-6 transition hover:-translate-y-1 hover:shadow-lift ${className}`}>
      {children}
    </div>
  );
}
