# PAIKAR MART - PROJECT ARCHITECTURE AUDIT & MIGRATION PLAN

## 1. Executive Summary
This document provides a hard audit of the current Paikar Mart codebase (Frontend & Backend) to identify structural inconsistencies, overlapping domains, and fragmented routing. It outlines a strict migration plan to reorganize the scattered files into a highly modular, secure, and advanced architectural pattern aligned with the official documentation (`/documentation/architecture/`).

**CRITICAL DIRECTIVE**: No advanced UI/UX components, pages, or features currently built will be deleted, even if they are missing from the formal documentation. Missing documentation will be noted, and the features will be safely integrated into the proper new folder structure.

---

## 2. Hard Audit & Discrepancy Report

### 2.1 Routing Duplication (Frontend)
- **Issue**: There are two parallel routing systems.
  - `src/main.tsx` renders `src/App.tsx`, which uses a custom `<AppShell>` and `<GlobalRouter>` drawing from `src/app/AppShell/routeConfig.ts`.
  - There is a completely detached `src/app/App.tsx` and `src/app/routes.tsx` which configures a `createBrowserRouter` but is effectively dead code (not mounted in `main.tsx`).
- **Resolution**: Deprecate the unused router. Standardize on the `<GlobalRouter>` and clean up dead route index files. Refactor all imports to rely on the active file.

### 2.2 Frontend Folder Fragmentation (`src/pages` vs `src/app/pages` vs `src/modules` vs `src/portals`)
- **Issue**: The view layer is highly scattered:
  - `src/pages/`: Contains 50+ standalone domain files (e.g., `demand.tsx`, `orders.tsx`, `categories.tsx`).
  - `src/app/pages/`: Contains parallel pages (e.g., `DemandPage.tsx`, `HomePage.tsx`, `AdminCenterPage.tsx`).
  - `src/portals/`: Contains 20+ folders (`b2b`, `wholesale`, `export`, `factory-portal`, `retail`), but some portals overlap heavily (e.g., `b2b` vs `wholesale` vs `export` vs `factory-portal`).
  - `src/modules/`: Contains business logic but also houses whole pages/portals (e.g., `retail-b2c`, `logistics-ride`, `social-news`).
- **Resolution**:
  - Consolidate **Portals** rigorously conforming to the 17 mapped ecosystems in `FULL_PORTAL_ARCHITECTURE.md`. Sub-domains (like `wholesale`, `export`, `factory-portal`) must be moved inside `src/portals/b2b/`.
  - Re-classify `src/modules` as strictly headless business logic, data fetching (Zustand/Tanstack), and cross-portal functional domains (auth, cart, wallet). UI Pages inside `src/modules` must be extracted to their respective `src/portals` or `src/pages`.
  - Consolidate `src/app/pages` back into `src/pages/` or `src/portals/` depending on scope, deleting the duplicate dead files.

### 2.3 Backend Modularity Audit
- **Current State**: The backend structure in `/backend` is relatively well-arranged, utilizing a modular domain-driven pattern (`/backend/modules/` -> `auth`, `order`, `product`, `wallet`, `compliance`). API routes are separated into `api/routes/`.
- **Verdict**: The backend is healthy and maintainable. However, alignment checks will be needed to ensure the API payloads fit perfectly with the new consolidated Frontend boundaries.

### 2.4 Undocumented Built Features (Advanced Systems Found)
- The application contains heavily built out pages for `jobs.tsx`, `hotel.tsx`, `agriculture.tsx`, `real-estate.tsx`, `healthcare.tsx`, etc. These act as mini-portals for specific niches but are absent or lightly referenced in the master configuration.
- Component features like the comprehensive `AdminCenterPage.tsx` and advanced `NearByShopPage` exist under `src/app/pages` alongside intricate components.
- **Handling**: These files will NOT be culled. They will be safely migrated into a dedicated `src/portals/verticals/` or designated under their respective categories in the route config.

---

## 3. The Target Master Architecture

Pursuant to `FULL_PORTAL_ARCHITECTURE.md`, the frontend will be enforced into this strict layout:

```text
/src
  /api          # global generic API interceptors, React Query keys
  /components   # global UI primitive components (buttons, headers, modals)
  /features     # complex reusable cross-portal widgets (e.g., Chat widget, SocialProfile)
  /layouts      # shell shells (AppShell, GlobalSidebar, BottomNav)
  /modules      # PURE BUSINESS LOGIC (Zustand stores, services, types) - NO PAGES!
  /pages        # Core isolated pages (Login, Terms, Core Error Pages)
  /portals      # The 17 Official Ecosystems (EACH with its own /pages, /components)
      /admin
      /b2b          # incorporates wholesale, export, factory-portal
      /brand-shops
      /demand
      /marketplace
      /messages
      /nearby
      /news
      /orders
      /pk-shop
      /retail       # incorporates retail-b2c
      /seller
      /services
      /transport
      /travel
      /wallet
```

---

## 4. Execution Workflow (Step-by-Step Instruction Set)

To execute the restructure without crushing the app, we will follow these phased steps recursively:

### PHASE 1: Route Cleanup & Safety Hardening
1. Identify all imports pointing to `src/app/routes.tsx` or `src/app/App.tsx`.
2. Delete the dead `src/app/App.tsx` and `src/app/routes.tsx`.
3. Standardize `main.tsx` to mount precisely from `src/App.tsx` with absolute confidence.
4. Finalize the `routeConfig.ts` to be the single source of truth.

### PHASE 2: Consolidate 'src/app/pages' into 'src/pages' & 'src/portals'
1. Compare `src/pages/demand.tsx` vs `src/app/pages/DemandPage.tsx`. Keep the actively used one, rename to standard, and update `routeConfig.ts`.
2. Move actively used niche portals (Jobs, Transport, Hotel) into `src/portals/niche/` or their respective folders.
3. Evacuate all usable contents from `src/app/` into the cleaner strict root folders, completely deprecating the `src/app/` sub-directory convention to avoid confusion.

### PHASE 3: Portal Consolidation
1. **B2B Mega-Portal**: Merge `/src/portals/wholesale/`, `/src/portals/export/`, and `/src/portals/factory-portal/` into `/src/portals/b2b/`. Update all internal `/b2b` imports.
2. **Retail Consolidation**: Merge `/src/modules/retail-b2c/` (which incorrectly contains pages) into `/src/portals/retail/`.
3. **Module Purge**: Inspect `/src/modules/`. Move any `pages` or `components` folders out of `/src/modules/` and into `/src/features/` or `/src/portals/`. Modules must only hold hooks, stores, and services.

### PHASE 4: Final Aliasing & Import Fixes
1. Run massive `sed` or `grep` sweeps to replace dirty relative paths (`../../../`) with clean `@/` aliases.
2. Validate the entire architecture using `npm run lint` and `npm run build` after each move.

---
**Status**: Initial Audit Complete. Ready to begin Phase 1 execution.
