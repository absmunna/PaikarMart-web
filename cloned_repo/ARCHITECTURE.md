# Paikar Mart Architecture Documentation

This document outlines the architectural guidelines for the Paikar Mart project. Following these rules ensures the maintainability, scalability, and modularity of the codebase.

## 1. Core Philosophy
- **Modular Monolith**: Each feature or domain (e.g., `auth`, `orders`, `product`) acts as a self-contained module.
- **Separation of Concerns**: Strictly separate concerns into UI, Data Fetching (Services), and State Management (Store).
- **Domain-Driven Design**: Logic is grouped by domain, minimizing cross-module coupling.

## 2. Monorepo Folder Structure
The project is organized as a pnpm workspace to facilitate separate deployment and shared logic.

- `apps/frontend/`: The React + Vite application.
    - `src/app/`: Root config, providers, and router setup.
    - `src/core/`: Global singleton utilities, API clients, and auth initialization.
    - `src/design-system/`: Global UI primitives and layout shells.
    - `src/modules/`: Domain-specific business logic (stores, services, types).
    - `src/portals/`: Hub-specific UI views and ecosystems.
    - `src/shared/`: Cross-cutting utilities, types, and constants.
- `apps/backend/`: The Node.js + Express API.
- `packages/database/`: Shared Prisma schema and database connection logic.
- `packages/shared/`: Shared TypeScript types, schemas (Zod), and utility functions used by both apps.

### Frontend Module Rules:
- **Location**: `apps/frontend/src/modules/`
- **Rule**: Imports from outside a module should be minimal and restricted to `shared/` or `core/` resources.
- **Naming Pattern**: All store files must follow the `use[DomainName]Store.ts` naming convention.
- **Layering**: Strictly keep UI-specific states (e.g., `useProductUIStore`) separate from API data states (e.g., `useProductDataStore`).

## 4. Service Fetching Pattern
- **Centralized API**: All API calls must reside within `src/modules/[moduleName]/services/`.
- **Constraint**: Direct `fetch` or `axios` calls from within components are strictly prohibited. Always use service functions.

## 5. New Feature Checklist
Before adding a new feature, verify the following:
- [ ] Is the feature scoped to a module-level?
- [ ] Am I avoiding the creation of an overly broad global store?
- [ ] Does the import path maintain strict module boundaries?
- [ ] Does the logic follow the separation of UI and Data layers?
