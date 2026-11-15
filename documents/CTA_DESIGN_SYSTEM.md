# PaikarMart CTA Design System

This document outlines the standardized CTA (Call to Action) button styles and behaviors across different portals to ensure a consistent user experience.

## 1. Marketplace (Retail & Wholesale)
*   **Retail (B2C)**: 
    *   *Text*: "Add to Cart"
    *   *Color*: Blue (`bg-blue-600`)
    *   *Icon*: `ShoppingBag`
*   **Wholesale (B2B)**: 
    *   *Text*: "Source Wholesale Bulk"
    *   *Color*: Amber (`bg-amber-500`)
    *   *Text Color*: Slate-950 (for contrast)
    *   *Icon*: `Package`

## 2. Nearby Services & Repairs
*   **Service Providers**: 
    *   *Text*: "Book Now" / "Book Service Slot"
    *   *Color*: Emerald/Purple (`bg-emerald-600` / `bg-purple-600`)
    *   *Icon*: Dynamic (e.g., `Wrench`, `Scissors`, `Zap`)

## 3. Transit & Logistics
*   **Ride Options**: 
    *   *Text*: "Book Ride"
    *   *Color*: Sky Blue (`bg-sky-600`)
    *   *Icon*: Dynamic (e.g., `Car`, `Bike`, `Truck`)

## 4. Specialized Commerce
*   **Demand Board (RFQ)**: 
    *   *Text*: "Submit Offer / Quote"
    *   *Color*: Orange (`bg-orange-600`)
    *   *Icon*: `MessageSquare`
*   **Used Market (P2P)**: 
    *   *Text*: "Chat with Seller"
    *   *Color*: Teal (`bg-teal-600`)
    *   *Icon*: `MessageSquare`

## 5. Implementation Rules
1.  **Stop Propagation**: All CTAs within cards must use `e.stopPropagation()` to prevent unintended navigation to detail pages.
2.  **Visual Weight**: Use `font-black`, `uppercase`, and `tracking-widest` for secondary portal buttons to maintain enterprise-grade typography.
3.  **Elevation**: Apply `shadow-md` with matching colored glows (e.g., `shadow-blue-500/20`).
