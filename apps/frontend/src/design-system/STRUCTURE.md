# Design System — Folder ownership (V2 layout)

Goal: **one place per concern**. Do not add a second BottomNav / Hub / Root shell.

## Layout shell (page chrome)

| Path | Role |
|---|---|
| `layouts/RootLayout.tsx` | **Production shell** — desktop + mobile frame, scroll hide nav, mounts PortalHubOverlay |
| `layouts/MobileLayout.tsx` | Lightweight mobile-only shell |
| `layouts/DesktopLayout.tsx` / `MainLayout` / `PortalLayout` / `DashboardLayout` | Specialized wrappers |
| `layouts/index.ts` | Public exports |

## Navigation (interactive chrome)

| Path | Role |
|---|---|
| `components/navigation/BottomNav.tsx` | **Canonical** mobile bottom bar (center Hub → `useNavUIStore`) |
| `components/navigation/Navbar.tsx` | Top bar |
| `components/navigation/UnifiedSidebar.tsx` | Desktop + mobile drawer sidebar |
| `components/navigation/CategoryBar.tsx` | Category strip |
| `components/navigation/index.ts` | Public exports |

## Layout overlays / chrome helpers

| Path | Role |
|---|---|
| `components/layout/PortalHubOverlay.tsx` | Store-driven hub host → **SuperAppHubModal** |
| `components/layout/SuperAppHubModal.tsx` | V2 portal grid UI (BN labels, hub cards) |
| `components/layout/ThemeBlobs.tsx` / `NakshiOverlay.tsx` | Visual atmosphere |
| `components/layout/index.ts` | Public exports |

### Deprecated / re-export only (do not edit logic here)

- `components/layout/BottomNav.tsx` → re-exports navigation BottomNav
- `components/layout/AppBottomNav.tsx` → same
- Prefer **not** using `components/common/navigation/BottomNavigation.tsx` for new code

## AppShell state (not visual)

| Path | Role |
|---|---|
| `app/AppShell/useNavUIStore.ts` | Hub open/close, sidebar, search, cart flags |
| `app/AppShell/useNavSettingsStore.ts` | Nav visibility / fixed vs auto-hide |
| `app/AppShell/GlobalTopBar.tsx` | Alternate top chrome experiments — **RootLayout uses Navbar** |

## Import rules

```ts
// Preferred
import { RootLayout } from '@/design-system/layouts';
import { BottomNav, Navbar } from '@/design-system/components/navigation';
import { PortalHubOverlay, SuperAppHubModal } from '@/design-system/components/layout';

// Path alias used by RootLayout today (keep working)
import { BottomNav } from '@/components/navigation/BottomNav';
```

## V2 UI contract

1. Mobile: 4 side tabs + elevated center **Hub** button
2. Hub opens **one** overlay (PortalHubOverlay → SuperAppHubModal)
3. Desktop: UnifiedSidebar + Navbar + optional right rail (RootLayout)
4. Auto-hide nav controlled by `useNavSettingsStore` + RootLayout scroll logic
