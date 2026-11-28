# PaikarMart-web deploy (no Firebase Hosting)

Production path does **not** require Firebase Hosting.

| Layer | Platform |
|---|---|
| Frontend SPA | **Vercel** (`vercel.json`) |
| API | **Render** (`render.yaml` / Express) |
| DB | **Supabase** Postgres (Prisma) |
| Auth (optional client) | Firebase Auth **SDK only** — not Hosting |

Do **not** run `firebase deploy --only hosting` for this app.

Required env (frontend):
- `VITE_API_BASE_URL` → Render API, e.g. `https://…onrender.com/api/v1`
- `VITE_FIREBASE_*` only if using Firebase Auth client

Catalog live Buy-Box needs Supabase migration `add_master_catalog` applied once.
