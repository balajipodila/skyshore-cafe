import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

export function Button({ children, href, variant = "primary", className = "", type = "button", onClick }: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-skyx-500 px-6 py-3 text-sm sm:text-base min-h-[44px]";
  const styles = {
    primary: "bg-coral text-white shadow-soft hover:bg-coral-dark",
    ghost: "glass text-navy dark:text-white",
    outline: "border-2 border-navy/15 dark:border-white/20 text-navy dark:text-white hover:bg-white/40",
  }[variant];

  if (href) {
    return (
      <Link href={href} prefetch={true} className={`${base} ${styles} ${className}`}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={`${base} ${styles} ${className}`}>
      {children}
    </button>
  );
}
