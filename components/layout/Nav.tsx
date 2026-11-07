"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LogoWordmark } from "../ui/Logo";
import { useCart } from "@/store/cart";
import { CartDrawer } from "../cart/CartDrawer";
import { useLocation } from "@/store/location";
import { useAuth } from "@/store/auth";
import { OUTLETS, getOutlet } from "@/lib/menu";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/combos", label: "Combos" },
  { href: "/recipes", label: "Recipes" },
  { href: "/outlets", label: "Outlets" },
  { href: "/about", label: "About" },
  { href: "/feedback", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const count = useCart((s) => s.count());
  const isDrawerOpen = useCart((s) => s.isDrawerOpen);
  const setDrawerOpen = useCart((s) => s.setDrawerOpen);
  const outletId = useLocation((s) => s.outletId);
  const setOutletId = useLocation((s) => s.setOutletId);
  const outlet = getOutlet(outletId);
  const user = useAuth((s) => s.user);
  const isAuthenticated = useAuth((s) => s.isAuthenticated);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 px-3 sm:px-6 pt-3">
        <nav
          aria-label="Primary"
          className="glass mx-auto flex max-w-7xl items-center justify-between gap-2.5 sm:gap-3 rounded-full px-3.5 sm:px-6 py-2.5 shadow-soft border border-white/70 dark:border-white/15 backdrop-blur-xl"
        >
          <Link href="/" prefetch={true} className="shrink-0" aria-label="Skyshore home">
            <LogoWordmark />
          </Link>

          <ul className="hidden lg:flex items-center gap-0.5 text-sm font-medium">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    prefetch={true}
                    className={`rounded-full px-3.5 py-2 transition duration-150 ${
                      active
                        ? "bg-navy text-white dark:bg-white dark:text-navy font-semibold shadow-sm"
                        : "text-navy/80 dark:text-white/80 hover:bg-white/60 dark:hover:bg-white/15"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <label className="sr-only" htmlFor="outlet-switcher">Choose outlet</label>
            <select
              id="outlet-switcher"
              value={outletId}
              onChange={(e) => setOutletId(e.target.value)}
              className="hidden sm:block rounded-full bg-white/70 dark:bg-white/10 px-3 py-2 text-xs sm:text-sm font-semibold min-h-[40px] max-w-[145px] outline-none border border-navy/10 dark:border-white/15 cursor-pointer text-navy dark:text-white [&>option]:text-navy [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-navy"
              aria-label={`Outlet — currently Skyshore ${outlet.city}`}
            >
              {OUTLETS.map((o) => (
                <option key={o.id} value={o.id}>
                  Skyshore {o.city}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              className="rounded-full p-2 glass min-w-[38px] min-h-[38px] grid place-items-center hover:scale-105 transition"
            >
              <span aria-hidden>{dark ? "☀" : "🌙"}</span>
            </button>

            {isAuthenticated && user ? (
              <Link
                href="/account"
                prefetch={true}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full glass px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy dark:text-white hover:bg-white/60 dark:hover:bg-white/15 transition min-h-[40px]"
                aria-label="My Account"
              >
                <span className="size-5 rounded-full bg-skyx-500 text-white text-[10px] grid place-items-center font-bold">
                  {user.name.charAt(0)}
                </span>
                <span className="truncate max-w-[75px]">{user.name.split(" ")[0]}</span>
              </Link>
            ) : (
              <Link
                href="/login"
                prefetch={true}
                className="hidden sm:inline-flex items-center rounded-full glass px-3.5 py-2 text-xs sm:text-sm font-semibold text-navy dark:text-white hover:bg-white/60 dark:hover:bg-white/15 transition min-h-[40px]"
              >
                Sign In
              </Link>
            )}

            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="relative rounded-full bg-navy text-white dark:bg-white dark:text-navy px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold min-h-[40px] hover:bg-coral hover:text-white dark:hover:bg-coral dark:hover:text-white transition shadow-sm"
              aria-label={`Open cart, ${count} items`}
            >
              Cart
              {count > 0 && (
                <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-coral text-[11px] font-bold text-white shadow">
                  {count}
                </span>
              )}
            </button>

            <button
              type="button"
              className="lg:hidden glass rounded-full px-3.5 py-2 text-xs sm:text-sm font-semibold min-h-[40px]"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-label="Menu"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden glass mx-auto mt-2 max-w-7xl rounded-3xl p-3 shadow-lift border border-white/60 dark:border-white/15 animate-slide-up">
            <ul className="grid gap-1 text-sm font-medium">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    prefetch={true}
                    onClick={() => setOpen(false)}
                    className={`block rounded-2xl px-3.5 py-2.5 transition ${
                      pathname === l.href
                        ? "bg-navy text-white dark:bg-white dark:text-navy font-semibold"
                        : "hover:bg-white/60 dark:hover:bg-white/10"
                    }`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2 border-t border-navy/10 dark:border-white/10 flex gap-2">
                <Link
                  href={isAuthenticated ? "/account" : "/login"}
                  prefetch={true}
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center rounded-2xl py-2.5 bg-white/70 dark:bg-white/10 font-semibold"
                >
                  {isAuthenticated ? "My Account" : "Sign In / Register"}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      <CartDrawer open={isDrawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
