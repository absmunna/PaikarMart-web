# 🌟 Paikar Mart Super App - Development & UI/UX Guidelines

This file serves as the official design guidelines, code rules, and integration workflows for **Paikar Mart** (Multi-vendor Social Commerce Super App). It includes optimized mobile/Capacitor frameworks, visual styling rules, security architectures, and our responsive mobile design patterns.

---

## 🎨 1. Mobile & Safe Area Engineering (Capacitor & Web Views)

To ensure the web app runs beautifully inside hybrid wrappers like **Capacitor** (and eventually **React Native**), the layout must explicitly handle physical hardware bars, notches, and touch targets:

### Safe-Area Inset Handling
Never overlap physical device bars or hardware notches. Use absolute safe area padding:
* **Headers & Tops**: Protect headers using safe top spacing or CSS offsets:
  ```css
  .pt-safe {
    padding-top: env(safe-area-inset-top);
  }
  .header-notch {
    padding-top: calc(12px + env(safe-area-inset-top));
  }
  ```
* **Bottom Bars & Shells**: Ensure floating or persistent bottom components are raised above the system nav bar:
  ```css
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }
  .nav-safe {
    padding-bottom: calc(8px + env(safe-area-inset-bottom));
  }
  ```

### Ergonomics & Tap Experience
* **Touch Target Size**: All mobile clickables (buttons, tab items, dropdown arrows) **MUST** match a minimum **44px × 44px** boundary area to prevent fat-finger issues on touch screens.
* **Taptic Active Feedback**: Interactive tags/buttons must support an intuitive spring-like feedback transition on tap. In utility classes:
  ```css
  button, .btn {
    @apply transition-all duration-300 active:scale-95 cursor-pointer select-none;
  }
  ```
* **Disable Highlight**: Disable standard browser highlights on tap inside mobile shells:
  ```css
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  ```

---

## 💎 2. 3D Glassmorphism & Visual Identity (Bangladeshi Vibe)

Our design system combines premium Swiss/modern flat elements with high-impact Bangladeshi cultural elements and a futuristic dark cyber glass motif.

### Cohesive Design Properties
* **Palette Tokens**: Use our declared variables inside `src/index.css`. Never hardcode colors like `#ffffff` or custom hex values.
  * **Brand Green**: `var(--pm-green)` / `var(--pm-green-light)` (resembles prosperous crop fields & Bangladeshi flag star).
  * **Brand Accent**: `var(--pm-purple)` / `var(--pm-purple-dark)` (curated store elements, PK premium store).
  * **Gold Trim**: `var(--pm-gold)` / `var(--pm-gold-light)` (trust rating stars, verified badge trim, cultural নকশী কাঁথা accents).
* **Card Materialism**: Cards must use the `.glass-card` styling with consistent blurred backdrops (`backdrop-filter: blur(20px) saturate(180%)`), fine subtle white borders, and clean relative drop shadows.
* **Image Sourcing**: For mock graphics, use standard JSX images with `referrerPolicy="no-referrer"` to prevent remote source blocking inside sandboxed previews.

---

## 📋 3. Portal UI Rules & Content Layouts (StoryBar & Mobile Docks)

All portals (Home Feed, Retail/B2C, Wholesale/B2B, Logistics, services, local, etc.) MUST align with standard super-app design principles to keep layouts uniform across workflows.

### The Mandatory Super App Intro Pair
Every main portal view must immediately introduce the user with:
1. **StoryBar**: Horizontal dynamic circular card scroll. This displays story previews and active status/activity reels depending on the channel context.
2. **PortalIconBar**: Category icon grids immediately below the search/story layer. Allows fast portal bridging, category navigation, and quick filter access.

### Spot Spotlight Placement
* Keep search and category filters centralized and compact.
* Use a single responsive global Search page (`/search`) or modal popups containing recent histories, trending topics, voice keywords, and price sliders, reducing clutter on entry homepages.

---

## 🌐 4. Super-App Architecture & Sync Rules

* **Single-View Integrity**: Small widgets must exist on a single, well-managed view with expandable drawers (e.g. `useAppLauncherStore` drawer) instead of initiating expensive route redirects.
* **Zustand & Shared Hooks**: Keep cross-portal communication light. Share settings, localization, and auth profiles via Zustand variables.
* **Axios/API Proxying**: In production, absolute server paths must resolve server-side. Never expose raw API hostnames or secret client credentials in global state bundles.

---

## 📁 5. Folder Hierarchy Map & Standard Practice

Maintain our structured, clean separation of app segments:
* `/src/app/AppShell/`: Routing configurations, shells, navigation bar components, and global modal hubs.
* `/src/portals/`: Modules, static assets, and custom page folders dedicated to each distinct portal segment (e.g. `/portals/nearby`, `/portals/retail`).
* `/src/pages/`: Central pages of the app (home view, standard policies, sub-portals directories).
* `/src/components/ui/`: Core styling component definitions, action buttons, and input styles.

Avoid bulky imports or deep-nested structural moves. When implementing logic, keep modules encapsulated inside their dedicated portal directory to keep the global workspace dry and clean.

---

## ⚙️ 6. Logical Implementation Workflow (Based on Gamma Architecture)

We are retaining our superior UI/UX, 3D glassmorphism elements, and modular component structures. We will carefully integrate the advanced business logic workflows derived from the Gamma architecture document *under the hood*.

### Advanced Workflows to Implement (Phase-by-Phase):

**Phase 1: Dynamic Universal Post Creation (`/create`)**
*   **Logic**: Build a dynamic form engine using `react-hook-form` and `zod` schema validation that adapts fields based on `PostType` ('product', 'service', 'bid', 'video').
*   **File Uploads**: Implement multi-image drag-and-drop, video previews, and size validations.

**Phase 2: Supply Chain & Order Management Logic**
*   **Three-Tier Architecture**: Sync logic between Factory → Wholesaler → Local Shop.
*   **Inventory Sync**: Implement logic for bulk ordering, multi-vendor carts, and stock decrements on order confirmation.
*   **Order Lifecycle**: Hook up processing states (pending → confirmed → shipped → delivered).

**Phase 3: Advanced Logistics & Routing System**
*   **Dynamic Calculation Engine**: Integrate Google Maps Distance Matrix API in the backend to calculate logistics charges using the formula: `(Distance × Rate × Weight × Zone Multiplier + Handling Fee)`.
*   **Ride Share & Matching**: Logic to broadcast delivery/ride requests to nearby riders and handle driver state tracking.

**Phase 4: Commission & Payment Settlement Engine**
*   **Dynamic Commissions**: Wire up role-based deductions: Factory (3-5%), Wholesaler (5-8%), Local Shop (8-10%), Rider (Fixed fee 50-100 BDT).
*   **Bulk Discounts**: Apply automated platform fee reductions for high-volume orders.
*   **Settlement Engine**: Tie into Wallet and Payment endpoints for automated payout aggregations for vendors.

**Phase 5: Cross-Border Export Module (B2B)**
*   **International Standards**: Support for HS (Harmonized System) Codes in product payloads.
*   **Currency & Customs**: Implement live currency conversions and custom duties calculator logic.
*   **Documentation Tracking**: Ensure invoices, packing lists, and origin certificates are managed per export order.

> **⚠️ STRICT EXECUTION RULE FOR AI AGENTS**: When implementing these logical features or hooking up APIs, **NEVER** overwrite existing UI layout files, styling classes, or the `AppShell`. Connect the backend API and UI state changes (`src/store/`) smoothly, using our pre-existing polished frontend components. Ensure no UI/UX breakage occurs.
