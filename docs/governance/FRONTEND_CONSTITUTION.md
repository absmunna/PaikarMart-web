# PAIKARMART ECOSYSTEM — FRONTEND CONSTITUTION
*(new add - Version 1.0)*

This constitution governs all user-interface engineering, browser state hydration laws, modular directory structures, performance optimization rules, and reactive lifecycles across the Paikar Mart React application suite.

---

## 1. HIGH-LEVEL ARCHITECTURE & COMPONENT BOUNDARIES

To prevent bundle bloat and ensure fast client-side performance, the frontend employs a strictly decoupled, domain-driven structure.

```text
                       +----------------------------------+
                       |             App.tsx              |
                       +-----------------+----------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
             +---------+---------+               +---------+---------+
             |    src/portals    |               |    src/modules    |
             | (Domain Portals)  |               | (Generic Units)   |
             +-------------------+               +-------------------+
```

### Module Rules:
1.  **Portals (`src/portals/`)**: Highly specific, siloed interfaces corresponding directly to customer activities (e.g., `retail`, `wholesale`, `nearby-shop`, `service-provider`). Portals import general building blocks but must NEVER directly import components from other sibling portals to maintain a clean dependency structure.
2.  **Modules (`src/modules/`)**: Fully functional, cross-cutting modules (e.g., `auth`, `cart`, `payment`, `wallet`) providing hooks, utility functions, components, and state bridges applicable universally.
3.  **Components (`src/components/`)**: Atomic, pure, stateless visual building blocks (e.g., buttons, grids, input layers).

---

## 2. MODULAR PORTAL LAYOUT PATTERN (প্রতিটি Portal-এর গঠন)

To keep workspace layouts predictable, every folder generated under `src/portals/[portal_name]/` must mirror this exact directory representation:

```text
src/portals/[name]/
├── pages/         # Screen views mapped onto navigation pathways
├── components/    # Domain-specific visual components (e.g. story bars)
├── sections/      # Large logical layout blocks
├── widgets/       # Lightweight visual widgets (e.g. rating cards)
├── store/         # Zustand store slices for portal state
└── index.ts       # Clean public barrel exports
```

---

## 3. STATE MANAGEMENT & HYDRATION RULES

We maintain a strict separation between UI State and Server Sync-state variables.

1.  **Zustand (UI / Client Interaction)**:
    *   Used for fast, local state triggers (e.g., sidebar toggles, shopping cart items, multi-vendor pricing calculators).
    *   *Rule*: Always specify strict selector queries (`const cartCount = useCartStore(s => s.itemCount)`) instead of loading full store scopes to prevent unnecessary component re-renders.
2.  **React Query / TanStack Query (Server States)**:
    *   Must handle all backend communication pipelines.
    *   *Rule*: Specify highly readable, declarative `queryKeys` pointing to specific API paths (e.g. `['products', productId]`, `['orders', orderId]`).

---

## 4. PERFORMANCE HYDRATION & CODE SPLITTING

*   **Lazy Loading**: Screen bundles must load lazily through standard dynamic routing splits:
    ```tsx
    const BuyerDashboard = React.lazy(() => import("./portals/buyer/BuyerDashboard"));
    ```
*   **React `useEffect` Performance Guard**:
    Never trigger state updates inside effect hooks directly without checking bounds. Never pass complex objects or deep arrays as raw dependencies; use primitive hooks (`string`, `boolean`, `number`) to minimize component flickering.
