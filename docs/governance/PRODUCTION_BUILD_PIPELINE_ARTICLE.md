# PaikarMart — Production Build & Deployment Pipeline Blueprint
> **Scope:** Full-stack Express + Vite build instructions, container binding, and zero-downtime rollout rules.

---

## 🚀 1. Full-Stack Architecture & Build Flow
PaikarMart combines a high-performance React SPA frontend with a robust Node.js/Express backend packaged into a self-contained production bundle.

```
[Source Code (TS)] ➔ [Vite Static Build (dist/)]
                   ➔ [esbuild Backend Bundle (dist/server.cjs)]
                   ➔ [Cloud Run Container (Port 3000)]
```

---

## 📋 2. Mandatory Build & Run Scripts (`package.json`)
* **Development:** `npm run dev` (Runs `tsx server.ts` with hot-reloading and Vite middleware).
* **Production Build:** `npm run build` (Compiles Vite static assets and bundles `server.ts` into `dist/server.cjs` via esbuild).
* **Production Start:** `npm start` (Runs `node dist/server.cjs` binding securely to host `0.0.0.0` and port `3000`).

---

## ⚠️ 3. Non-Negotiable Deployment Rules
1. **Never hardcode secrets** in client code or Git repositories. Use environment variables.
2. **Always test local builds** with `npm run build` followed by `npm start` before deploying to Cloud Run.
3. **Preserve modular boundaries** (`src/modules/`, `src/portals/`, `src/features/`) to ensure future maintenance remains frictionless.
