# The Jeweller's Hub

Premium accessories & jewellery e-commerce platform built for the Nigerian market.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Auth**: Clerk
- **Database & Storage**: Supabase (Postgres + Storage)
- **Payments**: Paystack (NGN)
- **Email**: Nodemailer (SMTP)
- **Hosting**: Vercel

## Getting Started

1. Clone the repo
2. Copy `.env.example` to `.env.local` and fill in all values
3. Install dependencies: `npm install`
4. Run the dev server: `npm run dev`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

See `.env.example` for all required environment variables. Never commit `.env.local`.

## Project Structure

```
src/
├── app/
│   ├── (storefront)/     # Public storefront pages
│   ├── admin/            # Admin dashboard (protected)
│   ├── sign-in/          # Clerk auth pages
│   └── sign-up/
├── components/
│   └── layout/           # Header, Footer
└── lib/
    ├── supabase/          # Supabase clients (browser + server)
    └── utils.ts           # Shared utilities
```

## Build Status

Built phase-by-phase. See the master prompt for the full phase breakdown.
