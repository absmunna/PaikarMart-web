# Paikar Mart Architecture Documentation

This document outlines the architectural guidelines for the Paikar Mart project. Following these rules ensures the maintainability, scalability, and modularity of the codebase.

## 1. Core Philosophy
- **Modular Monolith**: Each feature or domain (e.g., `auth`, `orders`, `product`) acts as a self-contained module.
- **Separation of Concerns**: Strictly separate concerns into UI, Data Fetching (Services), and State Management (Store).
- **Domain-Driven Design**: Logic is grouped by domain, minimizing cross-module coupling.

## 2. Folder Structure Guideline
- `src/components/`: Contains shared global UI components (e.g., `Buttons`, `Modals`, `Layouts`).
- `src/modules/`: Contains domain-specific modules. Each module has its own `components/`, `services/`, and `store/` directories.
    - **Rule**: Imports from outside a module should be minimal and restricted to `shared/` or `core/` resources.
- `src/shared/`: Contains global project types, constants, and utility functions shared across multiple modules.

## 3. State Management Rules
- **Naming Pattern**: All store files must follow the `use[DomainName]Store.ts` naming convention (e.g., `useCartStore.ts`).
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
