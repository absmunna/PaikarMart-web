# PaikarMart — Bangladesh Super App

PaikarMart হবে Bangladesh-এর **Super App** — social commerce, B2B trade, food delivery, ride sharing, services, content, jobs সব একসাথে একটাই platform-এ।

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS v4 + motion/react |
| State | Zustand |
| Backend | Node.js + Express |
| Database | PostgreSQL + Prisma ORM |
| Routing | React Router DOM v7 |
| AI | Google Gemini (Aloop AI) |
| Realtime | Socket.io |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL (local or Supabase)

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Start dev server (Frontend + Backend)
npm run dev
```

Server runs on port **5000**.

### Environment Variables

`.env` file তৈরি করো (`.env.example` দেখো):

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret
VITE_API_BASE_URL=http://localhost:5000
```

---

## 📁 Project Structure

```
src/
├── app/AppShell/     ← App shell, routing, navigation
├── config/           ← Portal registry, roles, payment config
├── features/         ← Cross-portal: auth, profile, registration
├── modules/          ← Business logic: cart, wallet, orders, AI
├── components/       ← Shared UI components
├── portals/          ← 12 Super Portals
│   └── _templates/   ← Shared portal templates
├── pages/            ← Core pages: login, register, settings
└── shared/           ← StoryBar, PortalIconBar
```

---

## 🗺️ 12 Super Portals

| Portal | Route | Status |
|---|---|---|
| Marketplace | `/marketplace` | ✅ |
| B2B Trade | `/b2b` | ✅ |
| Food Delivery | `/food` | ✅ |
| Grocery | `/grocery` | ✅ |
| Pharmacy | `/pharmacy` | ✅ |
| Ride & Delivery | `/ride` | ✅ |
| Services | `/services` | ✅ |
| Media & News | `/news` | ✅ |
| Nearby | `/local` | ✅ |
| Travel & Hotel | `/travel` | 🔄 |
| Jobs | `/jobs` | 🔄 |
| Verticals Hub | `/verticals` | 🆕 |

---

## 📱 Bottom Navigation

```
🏠 Home | 🛍️ Marketplace | ⊞ Apps | 💬 Message | 👤 Profile
```

---

## 📚 Documentation

| File | বিষয় |
|---|---|
| `MASTER_PLAN.md` | Full architecture + 6-phase build plan |
| `AGENTS.md` | Developer + AI agent guidelines |
| `documentation/DESIGN_SYSTEM.md` | UI/UX design standards |
| `documentation/ROLES_AND_PERMISSIONS.md` | Role matrix + trust levels |
| `documentation/API_AND_DATABASE.md` | API endpoints + DB schema |

---

## 🏗️ Build Phases
> **Current Status: Phase 1 & 2 Completed (Foundation & Infrastructure) | Moving to Phase 3**

```
Phase 1 — Foundation:    ✅ Done (Store unify, Config, Bottom Nav, Checkout)
Phase 2 — Portals:       ✅ Done (Templates, Portals Launcher, Launcher Redesign)
Phase 3 — Registration:  🔄 Active (Smart wizard, Profile real API)
Phase 4 — Commerce:      🆕 Upcoming (PostCard, SocialTicker, Dual-Currency)
Phase 5 — Portal Upgrade: 🆕 Upcoming (Jobs, Real Estate, Verticals)
Phase 6 — Polish:        🆕 Upcoming (AI features, Admin panel, Mobile audit)
```

---

## 🚀 Next Steps (Focus)

1.  **Smart Registration Wizard**: Refactor the multi-role registration flow for B2B, Wholesale, and Retail roles.
2.  **Logistics Hub Backend**: Implement ride-share and transport availability layers.

---

## 🛡️ Key Rules

1. **No duplicate files** — grep first, update existing
2. **Single store** — one source per domain (cart, wallet, auth)
3. **@/ alias always** — no relative `../../` imports
4. **Barrel imports** — `@modules/[name]` via `index.ts`
5. **Mock in dev only** — production uses real API
6. **44px touch targets** — all interactive elements

See `AGENTS.md` for full rules.

---

## 🚀 Deployment

- **Frontend:** Vercel (push to GitHub main)
- **Backend:** Railway (Node.js/Express)
- **Database:** Supabase (PostgreSQL)

```bash
npm run build
```
