# Skyshore Café — Where the Sky Meets the Sea

A production-quality, multi-page café website for a fictional beach-inspired café chain.

**Live target:** Vercel (`vercel --prod`)

## Stack

- **Next.js 14 (App Router) + TypeScript**
- **Tailwind CSS** (design tokens in `tailwind.config.ts`)
- **Framer Motion** (hero parallax, page reveals, cart + chat)
- **Zustand** (cart state, drawer)
- **Local JSON data** in `data/` — ready to swap for Prisma + Postgres:
  - `menu.json`, `outlets.json`, `reviews.json`, `recipes.json`, `combos.json`
- **Claude API** via `app/api/recommend/route.ts` (server-only; `ANTHROPIC_API_KEY` in `.env.local`)

## Quick start

```bash
git clone https://github.com/<you>/skyshore-cafe.git
cd skyshore-cafe
npm install
cp .env.local.example .env.local   # add ANTHROPIC_API_KEY
npm run dev                        # http://localhost:3000
npm run build                      # production build
```

Without an API key, the recommender falls back to local keyword matching — the UI still works end-to-end for demos.

## Pages

| Page | Route |
|---|---|
| Home | `/` |
| Menu | `/menu` |
| Product detail | `/menu/[id]` |
| Combos & Offers | `/combos` |
| Checkout | `/checkout` |
| Order tracking | `/order/track` |
| Recipes | `/recipes` |
| Outlets | `/outlets` |
| About | `/about` |
| Feedback | `/feedback` |
| Contact | `/contact` |
| Account | `/account` |
| Dashboard (mock admin) | `/dashboard` |
| AI recommend API | `/api/recommend` |

## Folder structure

```
app/                  # App Router pages + API routes
components/
  ui/                 # Button, GlassCard, Badge, Rating, Logo, ProductCard, WaveDivider
  sections/           # Home sections
  layout/             # Nav, Footer
  cart/               # Glass cart drawer
  chat/               # AI recommender chat
data/                 # JSON: menu, outlets, reviews, recipes, combos
store/                # Zustand stores (cart)
lib/                  # Types, data helpers
tailwind.config.ts     # Design tokens: skyx, aqua, sand, coral, navy
```

## Design system

**Palette (Tailwind tokens)**
- Sky: `#3FA9C4` · Soft aqua `#7FD1C0` · Sand `#FFF8ED` / `#E9D5B8`
- Coral accent `#FF7A6B` · Deep navy text `#12263A`
- Dark mode = deep night-sea (`#0B1A2B` → `#1E3A53`)

**Typography**
- Headings: Fraunces (elegant serif)
- Body: Inter (clean sans)

**Glassmorphism**
`.glass` = translucent white, `backdrop-blur + saturate`, thin light border, soft shadow. Used for nav, cards, cart drawer, chat panel, dashboards.

**Signature details**
- Wave dividers, overlapping glass panels, parallax hero, micro-interactions (`hover:-translate-y-1`), asymmetric story section, varied card layouts.
- No purple gradient heroes, no identical grids, no emoji icons (SVG icons in `Rating` / `Logo`), no lorem ipsum.

## AI features (server-route only)

1. **Menu recommender** (`/api/recommend`) — sends menu JSON to Claude, requests **structured JSON** (`{"items":[...ids], "reason":"..."}`), validates IDs against `menu.json` before rendering product cards.
2. **Smart pairing** in cart/checkout — copy suggests a matching snack/drink with one-tap add.

## Accessibility & performance checklist

- [x] Semantic landmarks (`header`, `main`, `footer`, `nav`, `section` with `aria-labelledby`)
- [x] Skip-to-content link, visible focus ring (`#3FA9C4`)
- [x] Glass text uses dark navy on light, high-contrast white on dark (`WCAG AA`)
- [x] `aria-label` on icon buttons, `alt` on all images, `aria-pressed` / `aria-expanded` on toggles
- [x] Keyboard navigable tabs/filters; drawer is `role="dialog"`
- [x] Mobile-first, 44px+ touch targets, responsive 360px → 1440px
- [x] `next/image` with `sizes`, lazy below-the-fold images, lazy-loaded routes
- [x] SEO metadata + Open Graph, `sitemap.ts`, `robots.ts`, `loading/error/not-found` boundaries
- [x] Skeleton loaders, empty states, toast-friendly optimistic cart

**Performance targets:** Lighthouse 90+ (images optimised via Unsplash `w=` params, minimal client JS — only cart/nav/chat are client components).

## Images

All photography via **Unsplash** (free to use). Representative URLs (see `data/*.json` for full list):

- Beach: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e`
- Chai/coffee, café interiors, food, mocktails — `photo-1571934811356`, `photo-1522992319`, `photo-1544145945`, `photo-1559925393`, etc.

Attribution in footer. Replace with your own CDN URLs before launch.

## Deployment (Vercel)

```bash
npm i -g vercel
vercel env add ANTHROPIC_API_KEY production
vercel --prod
```

Set `ANTHROPIC_API_KEY` in the Vercel dashboard under Environment Variables.

## Screenshots

> Add real screenshots after `npm run dev`:
> - Home (hero + glass panel)
> - Menu filters
> - Cart drawer
> - AI recommender chat
>
> Place them in `public/screenshots/` and link here.

### Status

✅ **Build passes** (`npm run build` green) · ✅ Dev server runs on `http://localhost:3000`

Screenshots will be added after the visual Home checkpoint review.

## Coupons & delivery rules (demo)

- Codes: `WAVE10` (10% off), `FIRSTSIP` (₹100 off)
- Free delivery above ₹299, otherwise ₹29 · ETA 25–40 min
- Happy hour: weekday 4–6 PM, 20% off select cold drinks

## License

Fictional brand for demonstration. Founder profile on `/about` is placeholder content (marked in code comments).
