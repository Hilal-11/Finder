# Worker Marketplace App

A mobile marketplace connecting the public with local workers and professionals — carpenters, architects, photographers, videographers, wedding decorators, bulk labor teams, and more. Visitors can browse categories, search by location, and contact workers directly via in-app chat, voice call, email, phone, or WhatsApp.

---

## Table of Contents

- [Worker Marketplace App](#worker-marketplace-app)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
    - [MVP (Phase 1)](#mvp-phase-1)
    - [Phase 2](#phase-2)
    - [Phase 3](#phase-3)
  - [Tech Stack](#tech-stack)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Available Scripts](#available-scripts)
  - [Roadmap](#roadmap)
  - [Contributing](#contributing)
  - [License](#license)

---

## Overview

**User roles:**

- **Visitor / Customer** — browses workers, searches by category/location, contacts and reviews workers
- **Worker / Provider** — individual professional or team lead (bulk labor crews of 5/8/10), manages profile and portfolio
- **Admin** — approves worker listings, manages categories, moderates reports

**Core idea:** unlike platforms that hide contact details to force bookings through the app, this app surfaces direct contact info (call, WhatsApp, email, chat) on every worker profile — prioritizing speed and trust over platform-mediated transactions.

---

## Features

### MVP (Phase 1)

- Phone/email signup with OTP, separate flows for Visitor and Worker
- Worker profile: category/subcategory, service area, bio, pricing, portfolio images, availability toggle
- Admin-configurable categories and subcategories
- Search with filters: category, location, price range, rating
- Location-based discovery (map + "near me")
- Direct contact block: Call, WhatsApp deep link, Email, In-app chat
- Ratings and reviews
- Admin panel for approvals and category management

### Phase 2

- Team/bulk worker profiles (team size, per-person/per-day rate)
- In-app voice/video calling with masked numbers
- Booking system with availability calendar
- Quote requests (reverse marketplace — customer posts requirement, workers respond)
- ID verification / verified badge
- Favorites, push notifications, multi-language UI
- Worker subscription tiers

### Phase 3

- In-app payments with escrow-style holds
- Dispute resolution and refunds
- Worker analytics dashboard
- SEO-optimized public profile pages
- Featured/sponsored listings

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Mobile app | React Native + Expo |
| Web (public profiles + admin) | Next.js |
| Backend | Node.js + Express |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (phone OTP + email) |
| Realtime chat | Supabase Realtime |
| File storage | Supabase Storage |
| Maps/location | Google Maps Platform / Mapbox |
| Push notifications | Expo Push Notifications |
| Voice calling (Phase 2) | Twilio Voice / Exotel |
| WhatsApp | wa.me deep links (MVP), WhatsApp Business API (later) |
| Payments | Razorpay |
| Search | Postgres full-text search (MVP), Meilisearch/Algolia (scale) |
| Hosting | Vercel (web/admin), Railway/Render (API), Supabase (DB/Auth/Storage) |

---

## Project Structure

```
worker-marketplace/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (auth)/             # Login, signup, OTP verification
│   ├── (visitor)/          # Visitor-facing screens
│   │   ├── index.tsx       # Home / category browse
│   │   ├── search.tsx
│   │   └── worker/[id].tsx # Worker profile detail
│   ├── (worker)/           # Worker-facing screens
│   │   ├── profile-setup.tsx
│   │   ├── portfolio.tsx
│   │   └── dashboard.tsx
│   └── (admin)/            # Admin panel screens
├── components/             # Reusable UI components
├── lib/
│   └── supabase.ts         # Supabase client init
├── hooks/                  # Custom React hooks
├── constants/               # Categories, colors, config values
├── types/                  # TypeScript types/interfaces
├── assets/                 # Images, icons, fonts
├── .env                    # Environment variables (not committed)
├── app.json                # Expo config
├── package.json
└── README.md
```

---

## Prerequisites

- Node.js v20+ and npm (or yarn/pnpm)
- Expo Go app installed on your phone (Play Store / App Store) for live testing
- A free [Supabase](https://supabase.com) account/project
- A Razorpay account (for payment integration, Phase 2+)
- Git

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd worker-marketplace
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Install core Expo packages** (if setting up fresh)

   ```bash
   npx expo install expo-router react-native-safe-area-context react-native-screens
   npx expo install @supabase/supabase-js react-native-url-polyfill
   npx expo install expo-image-picker expo-image expo-location react-native-maps
   ```

4. **Set up environment variables** — see [Environment Variables](#environment-variables) below

5. **Run the development server**

   ```bash
   npx expo start
   ```

   Scan the QR code with Expo Go on your phone to load the app.

---

## Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=your-supabase-project-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key
EXPO_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
```

> Never commit `.env` to version control. Add it to `.gitignore`.

---

## Database Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Open the SQL editor and create the core tables:
   - `users`
   - `worker_profiles`
   - `categories`
   - `portfolio_items`
   - `reviews`
   - `bookings`
   - `conversations`
   - `messages`
   - `contact_clicks` (for analytics)
3. Enable **Row Level Security (RLS)** on every table before writing app logic against them
4. Copy your Project URL and anon key into `.env`

---

## Available Scripts

```bash
npx expo start          # Start the development server
npx expo start --clear  # Start with cache cleared
npx expo run:android    # Build and run on Android
npx expo run:ios        # Build and run on iOS (macOS only)
eas build                # Production build via EAS (once configured)
```

---

## Roadmap

- [ ] Phase 1 — Auth, profiles, categories, search, direct contact, reviews, admin approval
- [ ] Phase 2 — Team profiles, masked calling, bookings, quote requests, verification, subscriptions
- [ ] Phase 3 — In-app payments, disputes, analytics dashboard, SEO profile pages, featured listings

---

## Contributing

This is currently a solo/early-stage project. Contribution guidelines will be added once the MVP is stable.

---

## License

Not yet decided.
