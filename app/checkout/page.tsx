"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/cart";
import { useOrder } from "@/store/order";
import { useLocation } from "@/store/location";
import { getOutlet } from "@/lib/menu";
import { formatINR } from "@/lib/data";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const total = useCart((s) => s.total());
  const clearCart = useCart((s) => s.clear);
  const setOrder = useOrder((s) => s.setOrder);
  const outletId = useLocation((s) => s.outletId);
  const outlet = getOutlet(outletId);

  const [mode, setMode] = useState<"pickup" | "delivery">("pickup");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(outlet.city);
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [payMethod, setPayMethod] = useState("UPI");
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
  const pincodeRegex = /^\d{6}$/;
  const cityPincodeOk = city.trim() && pincodeRegex.test(pincode.trim());

  const discount = applied === "WAVE10" ? Math.round(total * 0.1) : applied === "FIRSTSIP" ? 100 : 0;
  const deliveryFee = mode === "pickup" ? 0 : total - discount >= 299 ? 0 : 29;
  const payable = Math.max(0, total - discount + deliveryFee);

  function applyCoupon() {
    const code = coupon.trim().toUpperCase();
    if (code === "WAVE10" || code === "FIRSTSIP") setApplied(code);
    else setApplied(null);
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!phoneRegex.test(phone.replace(/\s/g, ""))) errs.phone = "Enter a valid 10-digit mobile (e.g. 9876543210)";
    if (mode === "delivery") {
      if (!city.trim()) errs.city = "City is required";
      if (!pincodeRegex.test(pincode.trim())) errs.pincode = "Enter a 6-digit pincode";
      if (!address.trim()) errs.address = "Address is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!validate()) return;

    setSubmitting(true);
    const orderId = `SS-${Date.now().toString().slice(-4)}`;
    const order = {
      id: orderId,
      items,
      subtotal: total,
      discount,
      deliveryFee,
      total: payable,
      mode,
      name,
      phone,
      email: email || undefined,
      city: mode === "delivery" ? city : undefined,
      pincode: mode === "delivery" ? pincode : undefined,
      address: mode === "delivery" ? address : undefined,
      paymentMethod: payMethod,
      outletName: `${outlet.city} (${outlet.area})`,
      createdAt: new Date().toISOString(),
      statusIndex: 0,
    };

    try {
      const res = await fetch("/api/order/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          customerName: name,
          customerPhone: phone,
          customerEmail: email || "customer@example.com",
          mode,
          address,
          city,
          pincode,
          items,
          subtotal: total,
          discount,
          deliveryFee,
          total: payable,
          paymentMethod: payMethod,
          outletName: `${outlet.city} (${outlet.area})`,
          createdAt: order.createdAt,
        }),
      });
      const notifyData = await res.json();
      try {
        localStorage.setItem("skyshore_active_order", JSON.stringify({ ...order, notifications: notifyData }));
      } catch {}
    } catch {
      try {
        localStorage.setItem("skyshore_active_order", JSON.stringify(order));
      } catch {}
    }

    setOrder(order);
    clearCart();
    setSubmitting(false);
    router.push("/order/track");
  }

  return (
    <div className="mx-3 sm:mx-6 max-w-6xl lg:mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest font-semibold text-coral">Direct Delivery & Pickup · Skyshore {outlet.city}</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold mt-1">Checkout</h1>
        </div>
        <p className="text-xs text-navy/60 dark:text-white/60">Receipts to <strong>bobbypodila065@gmail.com</strong></p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid gap-6 lg:grid-cols-5" noValidate>
        <div className="lg:col-span-3 space-y-5">
          <section className="glass rounded-[26px] p-5 sm:p-6 shadow-soft" aria-labelledby="mode">
            <h2 id="mode" className="font-serif text-xl font-semibold mb-3">1. Choose Order Mode</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {(["pickup", "delivery"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition min-h-[48px] ${mode === m ? "bg-navy text-white dark:bg-white dark:text-navy shadow-sm" : "bg-white/70 dark:bg-white/10 hover:bg-white"}`}
                  aria-pressed={mode === m}
                >
                  {m === "pickup" ? "Coastal Pickup" : "Doorstep Delivery"}
                </button>
              ))}
            </div>

            {mode === "pickup" && (
              <div className="mt-4 rounded-2xl bg-white/60 dark:bg-white/5 p-3.5 border border-navy/10 dark:border-white/10 text-sm">
                <p className="font-semibold">Pickup: Skyshore {outlet.city} ({outlet.area})</p>
                <p className="text-xs text-navy/70 dark:text-white/70 mt-0.5">{outlet.address}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1.5">☕ Hot & fresh in 12–18 mins</p>
              </div>
            )}
          </section>

          <section className="glass rounded-[26px] p-5 sm:p-6 shadow-soft" aria-labelledby="contact-info">
            <h2 id="contact-info" className="font-serif text-xl font-semibold">2. Contact & Delivery Details</h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" htmlFor="name">Full Name *</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setErrors((re) => ({ ...re, name: "" })); }}
                  placeholder="e.g. Balaji Podila"
                  className={`w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border ${errors.name ? "border-red-400" : "border-navy/15 dark:border-white/15"} text-navy dark:text-white focus:border-skyx-500`}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                />
                {errors.name && <p id="name-error" className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" htmlFor="phone">Mobile (SMS & WhatsApp) *</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((re) => ({ ...re, phone: "" })); }}
                  placeholder="+91 98765 43210"
                  className={`w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border ${errors.phone ? "border-red-400" : "border-navy/15 dark:border-white/15"} text-navy dark:text-white focus:border-skyx-500`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
                {errors.phone && <p id="phone-error" className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1" htmlFor="email">Email (invoice)</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border border-navy/15 dark:border-white/15 text-navy dark:text-white focus:border-skyx-500" />
              </div>

              {mode === "delivery" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1" htmlFor="city">City *</label>
                    <input id="city" value={city} onChange={(e) => { setCity(e.target.value); setErrors((re) => ({ ...re, city: "" })); }} placeholder="City" className={`w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border ${errors.city ? "border-red-400" : "border-navy/15 dark:border-white/15"} text-navy dark:text-white focus:border-skyx-500`} aria-invalid={!!errors.city} aria-describedby={errors.city ? "city-error" : undefined} />
                    {errors.city && <p id="city-error" className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1" htmlFor="pincode">Pincode *</label>
                    <input id="pincode" value={pincode} onChange={(e) => { setPincode(e.target.value.replace(/\D/g, "").slice(0, 6)); setErrors((re) => ({ ...re, pincode: "" })); }} placeholder="e.g. 530001" inputMode="numeric" className={`w-full rounded-full bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border ${errors.pincode ? "border-red-400" : "border-navy/15 dark:border-white/15"} text-navy dark:text-white focus:border-skyx-500`} aria-invalid={!!errors.pincode} aria-describedby={errors.pincode ? "pincode-error" : cityPincodeOk ? "pincode-ok" : undefined} />
                    {errors.pincode && <p id="pincode-error" className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                    {!errors.pincode && cityPincodeOk && <p id="pincode-ok" className="text-xs text-emerald-600 mt-1">✓ Delivering to {city} {pincode}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-1" htmlFor="address">Delivery Address *</label>
                    <textarea id="address" rows={2} value={address} onChange={(e) => { setAddress(e.target.value); setErrors((re) => ({ ...re, address: "" })); }} placeholder="Door no., street, landmark..." className={`w-full rounded-2xl bg-white/80 dark:bg-white/10 px-4 py-2.5 text-sm outline-none border ${errors.address ? "border-red-400" : "border-navy/15 dark:border-white/15"} text-navy dark:text-white focus:border-skyx-500`} aria-invalid={!!errors.address} aria-describedby={errors.address ? "address-error" : undefined} />
                    {errors.address && <p id="address-error" className="text-xs text-red-500 mt-1">{errors.address}</p>}
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="glass rounded-[26px] p-5 sm:p-6 shadow-soft" aria-labelledby="pay">
            <h2 id="pay" className="font-serif text-xl font-semibold mb-3">3. Payment Method</h2>
            <div className="grid gap-2">
              {[
                { id: "UPI", label: "UPI", sub: "Google Pay, PhonePe, Paytm" },
                { id: "Card", label: "Card", sub: "Credit / Debit" },
                { id: "COD", label: "Cash on Delivery", sub: "Pay on arrival" },
              ].map((p) => (
                <label key={p.id} className={`flex items-center justify-between rounded-2xl p-3.5 text-sm cursor-pointer border transition ${payMethod === p.id ? "bg-white dark:bg-white/20 border-skyx-500" : "bg-white/60 dark:bg-white/5 border-transparent"}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="pay" value={p.id} checked={payMethod === p.id} onChange={() => setPayMethod(p.id)} className="size-4 text-skyx-600" />
                    <div>
                      <p className="font-semibold">{p.label}</p>
                      <p className="text-xs text-navy/60 dark:text-white/60">{p.sub}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-xs text-navy/60 mt-2">Mock payment UI only — no real charge.</p>
          </section>
        </div>

        <aside className="lg:col-span-2 space-y-5">
          <div className="glass rounded-[26px] p-5 sm:p-6 shadow-soft sticky top-28">
            <h2 className="font-serif text-xl font-semibold">Order summary</h2>
            {items.length === 0 ? (
              <p className="mt-3 text-sm">Empty basket. <Link href="/menu" className="underline font-semibold text-coral">Browse menu</Link>.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-sm max-h-56 overflow-y-auto pr-1">
                {items.map((i) => (
                  <li key={`${i.id}-${i.size ?? "base"}`} className="flex justify-between gap-3 text-xs sm:text-sm">
                    <span className="truncate">{i.name} {i.size ? `(${i.size}) ` : ""}× {i.qty}</span>
                    <span className="font-semibold whitespace-nowrap">{formatINR(i.price * i.qty)}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-4 flex gap-2">
              <input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="Coupon (try WAVE10)" className="flex-1 min-w-0 rounded-full bg-white/80 dark:bg-white/10 px-3.5 py-2 text-sm outline-none border border-navy/15 dark:border-white/15" aria-label="Coupon code" />
              <button type="button" onClick={applyCoupon} className="rounded-full bg-navy text-white dark:bg-white dark:text-navy px-4 py-2 text-xs font-semibold">Apply</button>
            </div>
            {applied && <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">✓ Applied {applied} — saved {formatINR(discount)}</p>}

            <dl className="mt-4 space-y-1.5 text-sm pt-3 border-t border-navy/10 dark:border-white/10">
              <div className="flex justify-between"><dt className="text-navy/70 dark:text-white/70">Subtotal</dt><dd className="font-semibold">{formatINR(total)}</dd></div>
              <div className="flex justify-between"><dt className="text-navy/70 dark:text-white/70">Discount</dt><dd className="font-semibold text-emerald-600 dark:text-emerald-400">− {formatINR(discount)}</dd></div>
              <div className="flex justify-between"><dt className="text-navy/70 dark:text-white/70">Delivery fee</dt><dd className="font-semibold">{deliveryFee === 0 ? "Free" : formatINR(deliveryFee)}</dd></div>
              <div className="flex justify-between border-t border-navy/10 dark:border-white/10 pt-2 text-base"><dt className="font-serif font-semibold">To pay</dt><dd className="font-bold text-coral text-lg">{formatINR(payable)}</dd></div>
              {mode === "delivery" && total - discount < 299 && <p className="text-xs text-navy/60">Add {formatINR(299 - (total - discount))} more to unlock free delivery.</p>}
            </dl>

            <button type="submit" disabled={submitting || items.length === 0} className="mt-5 w-full rounded-full bg-coral text-white py-3.5 font-semibold text-sm hover:bg-coral-dark transition shadow-soft disabled:opacity-50 min-h-[46px]">
              {submitting ? "Placing order…" : `Place Order · ${formatINR(payable)}`}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}
