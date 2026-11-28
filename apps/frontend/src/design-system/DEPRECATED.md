# Deprecated layout / nav stubs

These files must **not** gain new logic. They exist only for old imports.

| File | Status |
|---|---|
| `components/layout/BottomNav.tsx` | re-export → `navigation/BottomNav` |
| `components/layout/AppBottomNav.tsx` | re-export → `navigation/BottomNav` |
| `components/common/navigation/BottomNavigation.tsx` | re-export → `navigation/BottomNav` |
| `components/navigation/DynamicCategoryBar.tsx` | re-export → `CategoryBar` |
| `components/navigation/FloatingNavButton.tsx` | returns `null` |
| `app/AppShell/GlobalTopBar.tsx` | adapter → `Navbar` |
| `shared/components/layout/SidebarDrawer.tsx` | alias → `AppSidebar` |

Canonical chrome:
- `layouts/RootLayout.tsx`
- `navigation/Navbar.tsx`
- `navigation/BottomNav.tsx`
- `layout/PortalHubOverlay.tsx` → `SuperAppHubModal`
