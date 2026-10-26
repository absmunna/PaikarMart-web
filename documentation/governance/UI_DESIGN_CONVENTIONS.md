# Paikar Mart UI Design Conventions

This document defines the core standards for UI/UX design and component development to ensure high consistency, modularity, and modern aesthetics across all Paikar Mart portals and modules.

## 1. Design Tokens & Core Styling

*   **Spacing System**: Strict 8px grid (8px, 16px, 24px, 32px, 48px, 64px, etc.) for all paddings, margins, and gaps.
*   **Typography**:
    *   Primary: `Inter` (sans-serif) for general UI.
    *   Secondary: `JetBrains Mono` for technical data, code, or metrics.
    *   Scale: Balanced Major Third hierarchy.
*   **Color Palette (CSS Variables)**:
    *   `--pm-bg`: Primary background
    *   `--pm-surface`: Card/panel background
    *   `--pm-accent`: Brand action/highlight
    *   `--pm-text`: Primary text
    *   `--pm-text-secondary`: Muted text
    *   `--pm-border`: Element borders
    *   `--pm-glass`: Translucent overlays
*   **Styling**: Use Tailwind CSS v4 utility classes. No inline styles.

## 2. Component Standards

### Cards (Glassmorphism)
- **Container**: `bg-[var(--pm-surface)]`, `border`, `border-[var(--pm-border)]`, `rounded-2xl` or `rounded-3xl`.
- **Hover**: Subtle scaling or lift-up effects if interactive.
- **Padding**: Minimal 16px, standard 24px, compact 12px (follow 8px grid).

### Buttons
- **Shape**: Rounded-full (pills) for main actions, rounded-xl for secondary.
- **Interactions**: Subtle `hover:bg-[var(--pm-accent)]` or opacity change (0.8).

### Navigation
- **Desktop**: 
    - Left Sidebar: `w-[280px]`, `sticky top-0`, standard layout.
    - Profiles/User Area: Bottom-left or top-right profile shortcut, dynamic states.
- **Mobile**:
    - Bottom Tab Bar: `h-16` fixed, 5 primary destinations.
    - Drawers for secondary navigation.

### Layouts
- **Responsive**: 
    - Always mobile-first (100dvh).
    - Centered container for desktop (480px width or wider based on content density).
    - Use `sticky` containers for headers (`top-0`).

## 3. Interaction & States
- **Transitions**: `transition-all duration-200 ease-in-out` for all interactive elements.
- **loading**: Use skeleton loaders (`skeleton-shimmer`) for async operations, replacing loading spinners where technically superior for UI perception.
- **Feed**: Clean cards, `line-clamp` for typography protection.

## 4. Implementation Checklist for New Modules
1.  [ ] Define layouts using the established sidebar/topbar shell.
2.  [ ] Adhere to the spacing grid (8px increments).
3.  [ ] Use defined CSS color variables, NOT hardcoded HEX.
4.  [ ] Ensure accessibility (contrast 4.5:1).
5.  [ ] Add appropriate loading skeletons.
