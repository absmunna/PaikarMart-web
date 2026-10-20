# PAIKARMART ECOSYSTEM — DESIGN SYSTEM CONSTITUTION
*(new add - Version 1.0)*

This constitution governs all aesthetic standards, UI/UX interaction metrics, typography, spatial rhythms, and mobile-first container definitions across the Paikar Mart multi-vendor super app.

---

## 1. DYNAMIC COLOR TOKENS & PALETTE
We enforce the usage of theme-aware CSS variables defined under `globals.css`. Hardcoding hex values or raw Tailwind color strings is strictly prohibited to maintain unified theming states.

```css
:root {
  --pm-bg: #0d0d1a;
  --pm-surface: #13131f;
  --pm-elevated: #1a1a2e;
  --pm-accent: #f97316;
  --pm-text: #ffffff;
  --pm-text-secondary: #a1a1aa;
  --pm-border: rgba(255, 255, 255, 0.08);
  --pm-glass: rgba(255, 255, 255, 0.07);
}
```

---

## 2. STANDARD TYPOGRAPHY HIERARCHY

We pair fonts intentionally to convey professional craft, local identity, and high-tech utility.

*   **Primary Font Selection**: **Inter** (Universal sans-serif default configured for readability across high-density commerce grids, interface titles, and form controls).
*   **Mono-space Font**: **JetBrains Mono** or **Fira Code** (Reserved exclusively for invoice IDs, wholesale units, numeric transaction figures, pricing rates, and order indicators).

---

## 3. SPATIAL RHYTHMS & CONTAINER CONSTRAINTS

*   **Mobile-First Blueprint**: The standard platform design caters to mobile-first interfaces.
    *   **Max Mobile Width**: Absolute hard cap of `480px` horizontally centered on desktop viewports.
    *   **Desktop Framing**: Large desktop views feature smooth ambient background gradients supporting responsive dashboards or sidebars flanking the centered `480px` mock device frame, keeping focus entirely on user conversion flows.
*   **Touch-Target Parameters**: Every clickable element, button, list-item action, or gesture controller on mobile viewports MUST verify a minimum tap-area of **44x44px** to ensure zero thumb-fatigue and error-free checkouts.

---

## 4. SYSTEM INTERACTIVE GESTURES (MOTION DESIGN)

All reactive transitions use standard, lightweight library modules (`framer-motion` or `motion/react`) configured for performance and responsiveness.
*   **Visual Feedback**: Buttons utilize smooth spring state physics on press/touch down: `whileTap={{ scale: 0.96 }}`.
*   **Route Crossfades**: To provide standard, native-app visual transitions on browser views, view entry points wrap in lightweight layout transitions: `initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}`.
