# PaikarMart — UI/UX Design System & Minimalism Constitution
> **Scope:** Mandatory guidelines for modern, minimalistic, and consistent UI components, icons, typography, and anti-slop styling across all portals and pages.

---

## 🎨 1. Core UI/UX Philosophy & Anti-Slop Rules
To ensure PaikarMart maintains a world-class, clean, and professional aesthetic, all developers and AI agents must strictly adhere to the following UI standards:

* **No AI Slop:** Strictly ban purple-to-blue gradients, cyan-on-dark text, arbitrary glowing drop-shadows, and heavy nested cards (cards inside cards).
* **Sophisticated Neutrals:** Avoid pure `#000` or `#FFF`. Use soft neutral shades (`bg-zinc-50`, `text-zinc-600 dark:text-zinc-400`) for visual ergonomics.
* **Mathematical Border Radiis:** Cap card border radiis at `rounded-xl` to `rounded-2xl` (12px–16px). Use consistent button sizing with smooth transitions (`transition-all duration-200`).

---

## 🔘 2. Icons & Typography Consistency
* **Icons:** `lucide-react` is the **ONLY** permitted icon library. Do not mix SVG sources or custom icon sets. Keep icon sizes consistent (`h-4 w-4` or `h-5 w-5`) with standard stroke widths.
* **Typography:** Maintain strict hierarchical scaling (Heading ➔ Subheading ➔ Body). Avoid oversized full-sentence hero headlines. Use clean sans-serif font pairings with comfortable line heights (`1.5` to `1.7`).

---

## 📐 3. Component Uniformity Rule
All reusable components (Buttons, Badges, Cards, Modals) must draw their primitives from `src/components/ui/` to ensure identical look-and-feel across all 12+ super portals.
