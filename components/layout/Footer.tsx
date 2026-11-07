import Link from "next/link";
import { LogoWordmark } from "../ui/Logo";

export function Footer() {
  return (
    <footer className="mt-24 px-3 sm:px-6 pb-6">
      <div className="glass mx-auto max-w-7xl rounded-[28px] p-6 sm:p-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <LogoWordmark />
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-navy/70 dark:text-white/70">
              A calm beachside café where the sky meets the sea. Premium, but for everyone — students, families, office crowds, and the folks who walk a little slower.
            </p>
            <p className="mt-3 text-sm">
              Call: <a className="font-semibold underline" href="tel:+918912344001">+91 89123 44001</a>
            </p>
          </div>

          <nav aria-label="Footer">
            <h3 className="font-serif text-lg font-semibold">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {[
                { href: "/menu", label: "Menu" },
                { href: "/combos", label: "Combos & Offers" },
                { href: "/recipes", label: "Recipes" },
                { href: "/outlets", label: "Outlets" },
                { href: "/feedback", label: "Reviews" },
                { href: "/account", label: "Account" },
              ].map((l) => (
                <li key={l.href}>
                  <Link className="hover:underline" href={l.href}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="font-serif text-lg font-semibold">Visit us</h3>
            <p className="mt-3 text-sm leading-relaxed">
              12 Beach Road, Visakhapatnam
              <br />
              Open daily 8 AM – 10 PM
              <br />
              FSSAI 10000000001234
            </p>
            <Link href="/contact" className="inline-flex mt-3 rounded-full bg-navy text-white dark:bg-white dark:text-navy px-5 py-2 text-sm font-semibold">
              Talk to us
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-navy/10 dark:border-white/10 pt-5 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-navy/60 dark:text-white/60">
          <p>© {new Date().getFullYear()} Skyshore Café. Fiction for demo purposes.</p>
          <p>Images via Unsplash. See README for attribution.</p>
        </div>
      </div>
    </footer>
  );
}
