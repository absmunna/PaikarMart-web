# PAIKARMART ECOSYSTEM — DEVOPS & CI/CD CONSTITUTION
*(new add - Version 1.0)*

This constitution governs version control workflows, compilation/bundling targets, environment variable policies, production container definitions (Cloud Run), and fallback simulation models enabling seamless offline developer iterations.

---

## 1. REPOSITORY & SHIELD WORKFLOW (THE MAINLINE POLICY)

*   **Main Branch**: Pushes directly to GitHub `main` trigger automated deployment flows targeting Vercel (frontend) and Railway/Cloud Run (backend).
*   **Decoupled Directories**:
    *   `/src`: Houses the React 18 / Vite / TypeScript single-page application bundle.
    *   `/backend`: Houses the Express server handling API endpoints and ORM transactions.

---

## 2. PRODUCTION COMPILATION & STANDALONE EXECUTION

To guarantee extremely fast startup times under highly distributed micro-containers, the server uses a consolidated distribution pipeline.

```text
               +--------------------------------------+
               |          backend/server.ts           |
               +------------------+-------------------+
                                  |
               +------------------+-------------------+
               |        esbuild compilation           |
               +------------------+-------------------+
                                  |
                                  v
               +------------------+-------------------+
               |        dist/server.cjs (Bundled)     |
               +--------------------------------------+
```

### Script Protocols:
*   `npm run build`: Bundles the React assets inside `/dist` and uses `esbuild` to compile `server.ts` into a self-contained, high-performance CommonJS file at `dist/server.cjs` with native, external module checks.
*   `npm run start`: Directly executes the compiled bundle `node dist/server.cjs` to bypass any relative ESM importing issues and cold launch constraints in production nodes.

---

## 3. SEAMLESS DEV-FALLBACK STRATEGY

To safeguard the staging environment and local developers during cloud outages, DB migrations, or missing local credentials:
*   If the database system cannot verify `process.env.DATABASE_URL`, controllers must automatically switch to mock states (in-memory standard arrays) instead of crashing on startup.
*   The dev server must continue running on port `3000` to feed user-interface visual testing safely.
