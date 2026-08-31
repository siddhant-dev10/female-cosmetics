# AURAÉ — Female Cosmetics

A premium, dark-mode, single-brand cosmetics storefront built with Next.js 15, React 19 and TypeScript.

## Stack

- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS
- Framer Motion
- GSAP + ScrollTrigger
- Lenis smooth scrolling
- React Three Fiber + Three.js particle scene
- shadcn-style UI primitives with `class-variance-authority`
- Stripe Checkout API route

## Features

- Cinematic animated hero with a React Three Fiber particle/orb scene
- Mouse-following glow, responsive glassmorphism and hover tilt product cards
- GSAP section reveals, parallax, scroll progress and Lenis smooth scroll
- Product catalog, category filters, finish filters and sorting
- Product detail pages at `/product/[slug]`
- Wishlist and shopping bag persisted with `localStorage`
- INR pricing, delivery promise and COD handling flow
- Stripe-ready card/UPI/net-banking checkout route at `/api/checkout`
- Reviews, editorial campaign cards and newsletter signup
- Metadata, Open Graph, JSON-LD structured data, sitemap and robots
- Mobile-first responsive layout with keyboard focus states and reduced-motion support

## Folder structure

```text
female cosmetics/
├── app/
│   ├── api/checkout/route.ts       # Stripe Checkout session creation
│   ├── checkout/page.tsx           # Checkout route
│   ├── product/[slug]/page.tsx     # Static product detail routes
│   ├── globals.css                 # Tailwind + global dark theme
│   ├── layout.tsx                  # Metadata and global providers
│   ├── page.tsx                    # Storefront home page
│   ├── robots.ts
│   └── sitemap.ts
├── components/
│   ├── ui/                         # shadcn-style Button and Badge
│   ├── visuals/aura-scene.tsx      # R3F particle field and orb
│   ├── commerce-provider.tsx
│   ├── checkout-form.tsx
│   ├── hero.tsx
│   ├── product-card.tsx
│   ├── product-detail.tsx
│   ├── product-grid.tsx
│   ├── site-shell.tsx
│   └── motion-provider.tsx
├── legacy-static/                  # Previous HTML/CSS/JS version
├── lib/data.ts                     # Typed product catalog
├── lib/utils.ts
├── .env.example
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── vercel.json
```

## Install and run

```bash
cd "female cosmetics"
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Validate before deployment:

```bash
npm run typecheck
npm run build
npm run start
```

## Stripe setup

1. Create or log in to a Stripe account at [dashboard.stripe.com](https://dashboard.stripe.com/).
2. Use test mode while developing.
3. Copy the test secret key (`sk_test_...`) into `.env.local`:

   ```bash
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

4. Set the site URL:

   ```bash
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. Add payment methods supported by your Stripe account and region. The API creates INR Checkout line items dynamically from the typed catalog.
6. The checkout API returns a Stripe-hosted Checkout URL for card, UPI and net banking. COD is handled locally as a non-gateway order path with a ₹49 handling fee.

Do not commit `.env.local` or expose `STRIPE_SECRET_KEY` to client components.

## Deploy to Vercel

### Dashboard

1. Push this folder to GitHub or import the existing repository.
2. In [Vercel](https://vercel.com/new), click **Add New → Project** and select the repository.
3. Vercel auto-detects Next.js. Keep the root directory as the repository root.
4. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_SITE_URL` under **Project Settings → Environment Variables**.
5. Deploy. Vercel will run the Next.js build and provide a production URL.

### CLI

```bash
npm i -g vercel
vercel login
vercel
vercel env add STRIPE_SECRET_KEY production
vercel env add NEXT_PUBLIC_SITE_URL production
vercel --prod
```

## Performance notes

- Remote media uses `next/image` with a restricted `images.remotePatterns` allowlist.
- The R3F canvas is dynamically imported with SSR disabled.
- Product detail pages are statically generated from the typed catalog.
- Sections are progressively revealed on scroll; reduced-motion users receive a calmer experience.
- For a production catalog, move products, orders and customer sessions to a database and validate all prices server-side before creating Stripe sessions.
