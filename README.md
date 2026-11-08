# Skyshore Café — Where the Sky Meets the Sea

A calm beachside café chain across India — affordable chai to signature Sunset Skies, with outlet-aware menus, AI recommendations, daily rotations, and a glassmorphism premium UI.

## Project Overview

| Layer | Detail |
|---|---|
| Design system | Sky blues, aqua, sand beige, coral accent, deep navy. Fraunces serif headings, Inter body. Frosted-glass UI, wave dividers, parallax hero, dark-mode night sea. |
| Data | `data/menu.json` (87 items, core 63 + 21 local), `data/outlets.json` (12 outlets), `data/recipes.json` (10 recipes), `data/reviews.json`, `data/combos.json`. Structure mirrors future Prisma + Postgres models (core/local split). |
| Pages | Home, Menu, Product detail, Combos, Checkout, Order tracking, Recipes (+ detail + articles), Outlets, About, Feedback, Contact, Account, Dashboard, Login/Signup. |
| State | Zustand stores for cart (`store/cart.ts`), location (`store/location.ts`), orders (`store/order.ts`), auth (`store/auth.ts`). |
| AI | `/api/recommend` — server-only OpenAI-compatible call (`AI_BASE_URL`/`AI_API_KEY`/`AI_MODEL` in `.env.local`, fallback otherwise). |
| Fonts | Google Fonts (Fraunces + Inter) loaded in `app/layout.tsx`. |

## Features

- **Outlet-aware menu**: 63 core items + each city's local items only (no cross-city leakage). `Only at {city}` badge. 25+ items guaranteed. Console logs outlet once per change.
- **Daily rotation**: deterministic seed `YYYY-MM-DD + outletId`. Today’s Combos (4), Today’s Specials (3), Chef’s Special (premium/signature/local only — never plain burgers/pizza). Skeleton-first, `?date=` override in dev.
- **AI recommender**: compact menu context, temp 0.3, 10s timeout, strict JSON parsing, id validation, price enforcement in code, max 4 items. Fallback = keyword + price + veg + hot/cold filter with “Basic search” label. Supports English/Telugu/Hindi/Tenglish.
- **Cart drawer**: focus trap across all focusable elements (not just close), Esc closes, returns focus to trigger, `aria-modal`, sheet + popup notification.
- **Checkout**: coupon (`WAVE10`/`FIRSTSIP`), pickup/delivery toggle, validated address (phone, 6-digit pincode, city check), free delivery above ₹299 (₹29 otherwise), mock UPI/Card/COD, order persisted in Zustand + localStorage.
- **Order tracking**: 5-step animation (Received → Brewing & Baking → Packed → Out for delivery → Delivered) driven by a timer, ETA, reachable after checkout.
- **Recipes**: 10 recipes (chai, cold coffee, mango lassi, mirchi bajji, samosa, pav bhaji, pasta, dessert, mocktail, signature) each with story, ingredients, steps, prep time, serves, difficulty, nutrition, linked item id, own image. Detail page `/recipes/[id]`. “Behind the counter” articles page `/recipes/articles` (3 articles).
- **Outlets**: 12 fictional branches across Indian cities with geolocation (Haversine), lat/lng, timings, phone, “Get directions”.
- **Feedback & Reviews**: star rating, dish selection, photo upload UI, recent reviews, rating distribution bar.
- **Account dashboard**: order history, reorder, saved addresses, favourites, Wave Points.
- **Admin dashboard**: mock analytics (revenue, orders, bestsellers, outlet sales).
- **Auth**: mock Zustand-only sign-in (no OAuth), glass modal with email + “Continue with Google (Demo)”, Esc closes, sign out.

## Screenshots

> Placeholder — add real captures under `public/screenshots/` before public launch.
- `public/screenshots/home.jpg` — Hero, today’s specials, combo strip, story teaser.
- `public/screenshots/menu.jpg` — Category tabs, search, filters, outlet locals.
- `public/screenshots/cart.jpg` — Glass cart drawer with totals.
- `public/screenshots/checkout.jpg` — Validation states, coupon, payment options.
- `public/screenshots/track.jpg` — Animated order steps + ETA.

## Tech Stack

- **Next.js 14 (App Router) + TypeScript + Tailwind CSS**
- **Zustand** (cart, location, orders, auth)
- **Next/Image** with `next/image` sizes & remotePatterns
- **Local JSON** data (Prisma-ready)
- **AI**: OpenAI-compatible server route (`/api/recommend`)

## Setup Steps

```bash
git clone https://github.com/balajipodila/skyshore-cafe.git
cd skyshore-cafe
npm install
cp .env.example .env.local   # then paste your AI_* keys (leave blank for fallback)
npm run dev                  # http://localhost:3000
```

Without `AI_API_KEY`, the recommender falls back to strict keyword filtering (Basic search label) — UI still works.

## Environment Variables (names, no values)

```
AI_BASE_URL   # e.g. http://localhost:20128/v1
AI_API_KEY    # server-only, never exposed to client
AI_MODEL      # e.g. auto / gpt-4o-mini
```

## Deploy Steps for Vercel

```bash
vercel login
vercel env add AI_BASE_URL production      # paste same localhost-compatible endpoint or cloud URL
vercel env add AI_API_KEY production       # paste server key
vercel env add AI_MODEL production
vercel deploy --prod
```

Or: import `balajipodila/skyshore-cafe` in Vercel dashboard → **Add New Project** → **Import Git Repository** → **Deploy**. Auto-detects Next.js from `package.json`.

## Image Credits

| Source | Host allowed | Usage |
|---|---|---|
| Unsplash | images.unsplash.com | Hero, menu items, recipes, outlets (free with attribution) |
| Pexels | images.pexels.com | Chai/snack photos (free with attribution) |

Photography is demo placeholder content. Replace `remotePatterns` with your CDN before production. Attributions are in `data/*.json` image URLs.

## Known Limitations

- **Mock auth**: Zustand-only (no sessions, no OAuth). User not persisted across devices.
- **Mock payment**: UPI/Card/COD UI only — no real charges.
- **Mock notifications**: `/api/order/notify` returns local confirmation only — no SMTP/SMS/WhatsApp dispatch.
- **Fictional data**: All 12 outlets are fictional. Locations, menus and reviews are demo content.
- **AI**: Without `AI_API_KEY` or with HTTP errors, recommender falls back to strict keyword filter (“Basic search”).

> **Note:** Outlet/owner details are fictional sample content. Founder profile (Podila Balaji / Bobby) and all branch addresses are placeholders. Sample content markers are kept in code comments.
