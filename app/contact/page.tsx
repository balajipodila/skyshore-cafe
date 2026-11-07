"use client";

import { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { OUTLETS } from "@/lib/data";

const OFFICIAL_EMAIL = "bobbypodila065@gmail.com";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !message) return;
    setLoading(true);

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, contact, category, message }),
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto grid gap-6 lg:grid-cols-5">
      <header className="lg:col-span-2 glass rounded-[28px] p-6 sm:p-8">
        <h1 className="font-serif text-4xl font-semibold">Contact</h1>
        <p className="mt-2 text-navy/70 dark:text-white/70">
          A person will reply — usually faster than the tide.
        </p>

        <div className="mt-6 space-y-3.5 text-sm">
          <div className="glass rounded-2xl p-3.5 border border-white/50 dark:border-white/10">
            <p className="text-xs font-bold uppercase tracking-wider text-coral">Direct Founder Mail</p>
            <a
              className="font-semibold text-base underline text-navy dark:text-white hover:text-coral transition mt-0.5 block"
              href={`mailto:${OFFICIAL_EMAIL}`}
            >
              {OFFICIAL_EMAIL}
            </a>
            <p className="text-xs text-navy/60 dark:text-white/60 mt-0.5">
              All website inquiries & franchise requests reach here.
            </p>
          </div>

          <p>
            <strong>Customer Care Hotline</strong>
            <br />
            <a className="underline" href="tel:+918912344001">+91 89123 44001</a>
          </p>
          <p>
            <strong>Events & Catering</strong>
            <br />
            <a className="underline" href={`mailto:${OFFICIAL_EMAIL}?subject=Bulk%20Order`}>
              {OFFICIAL_EMAIL}
            </a>
          </p>
        </div>

        <div className="mt-6">
          <h2 className="font-serif text-xl font-semibold">Outlet Direct Lines</h2>
          <ul className="mt-2 space-y-1.5 text-sm max-h-56 overflow-y-auto pr-1">
            {OUTLETS.slice(0, 6).map((o) => (
              <li key={o.id} className="flex justify-between bg-white/60 dark:bg-white/10 rounded-full px-3 py-1.5">
                <span>{o.city}</span>
                <a href={`tel:${o.phone}`} className="font-semibold">{o.phone}</a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="lg:col-span-3 space-y-6">
        <GlassCard>
          <h2 className="font-serif text-2xl font-semibold">Write to us</h2>
          <p className="text-xs text-navy/60 dark:text-white/60 mt-0.5">
            We&apos;ll review your inquiry and reply with instant confirmation to your contact.
          </p>

          {submitted ? (
            <div className="mt-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-5 text-center">
              <span className="size-10 rounded-full bg-emerald-500 text-white grid place-items-center text-lg mx-auto mb-2 font-bold">
                ✓
              </span>
              <h3 className="font-serif text-xl font-bold text-emerald-800 dark:text-emerald-300">
                Message Dispatched!
              </h3>
              <p className="text-sm text-navy/80 dark:text-white/80 mt-1 max-w-md mx-auto">
                Thank you, <strong>{name}</strong>. Your message was sent to{" "}
                <span className="font-semibold">{OFFICIAL_EMAIL}</span>. We&apos;ve sent a confirmation message to{" "}
                <strong>{contact}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setMessage("");
                }}
                className="mt-4 rounded-full bg-navy text-white dark:bg-white dark:text-navy px-5 py-2 text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="mt-4 grid sm:grid-cols-2 gap-3" onSubmit={handleSubmit} aria-label="Contact form">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="rounded-full bg-white/80 dark:bg-white/10 px-4 py-3 text-sm outline-none border border-navy/10 dark:border-white/15 text-navy dark:text-white placeholder:text-navy/50 dark:placeholder:text-white/50"
                aria-label="Name"
              />
              <input
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Mobile Number or Email"
                className="rounded-full bg-white/80 dark:bg-white/10 px-4 py-3 text-sm outline-none border border-navy/10 dark:border-white/15 text-navy dark:text-white placeholder:text-navy/50 dark:placeholder:text-white/50"
                aria-label="Phone or email"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="sm:col-span-2 rounded-full bg-white/80 dark:bg-white/10 px-4 py-3 text-sm outline-none border border-navy/10 dark:border-white/15 text-navy dark:text-white [&>option]:text-navy [&>option]:bg-white dark:[&>option]:text-white dark:[&>option]:bg-navy"
                aria-label="Enquiry type"
              >
                <option>General</option>
                <option>Franchise enquiry</option>
                <option>Feedback</option>
                <option>Bulk / office orders</option>
              </select>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us everything..."
                rows={4}
                className="sm:col-span-2 rounded-2xl bg-white/80 dark:bg-white/10 px-4 py-3 text-sm outline-none border border-navy/10 dark:border-white/15 text-navy dark:text-white placeholder:text-navy/50 dark:placeholder:text-white/50"
                aria-label="Message"
              />
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-2 rounded-full bg-coral text-white py-3.5 font-semibold text-sm hover:bg-coral-dark transition shadow-soft disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </GlassCard>

        <GlassCard>
          <h2 className="font-serif text-2xl font-semibold">Franchise & Coastal Partnerships</h2>
          <p className="mt-2 text-navy/75 dark:text-white/80 leading-relaxed">
            We partner with passionate individuals who love the sea and know their neighbourhood. Initial setup support, supply chain of fresh coastal roasts and dairy, and staff barista training are fully provided. Write to{" "}
            <a href={`mailto:${OFFICIAL_EMAIL}?subject=Franchise`} className="font-semibold underline">
              {OFFICIAL_EMAIL}
            </a>{" "}
            or use the form above.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
