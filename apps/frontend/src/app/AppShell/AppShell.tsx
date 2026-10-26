import React from 'react';
import { useLocation } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { cn } from "@/lib/utils";
import { AppHeader } from "@/design-system/components/layout/AppHeader";
import { AppSidebar } from "@/design-system/components/layout/AppSidebar";
import { AppBottomNav } from "@/design-system/components/layout/AppBottomNav";
import { PortalHubOverlay } from "@/design-system/components/layout/PortalHubOverlay";
import { GlobalCartDrawer } from "@/modules/cart";
import { useNavUIStore } from "./useNavUIStore";
import { useCartDrawerStore } from "@/modules/cart/store/cartDrawerStore";
import { GlobalRouter } from "./GlobalRouter";
import { EventSyncProvider } from "./EventSyncProvider";
import { RoleBasedShell } from "./RoleBasedShell";
import { Footer } from "./Footer";

export const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const isReels = pathname === "/reels";
  const { isCartOpen, setCartOpen } = useNavUIStore();
  const { isOpen: isCartDrawerOpen, close: closeCartDrawer } = useCartDrawerStore();

  const isCartVisible = isCartOpen || isCartDrawerOpen;
  const handleCloseCart = () => {
    setCartOpen(false);
    closeCartDrawer();
  };

  const content = (
    <div className={cn(
      "min-h-[100dvh] w-full flex flex-col bg-black text-[var(--pm-text)] selection:bg-[var(--pm-accent)] selection:text-white overflow-x-hidden",
      isReels && "h-[100dvh] overflow-hidden"
    )}>
      {/* Dynamic Background */}
      {!isReels && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--pm-accent)]/5 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
        </div>
      )}

      {/* Global Header */}
      {!isReels && <AppHeader />}

      {/* Main Container */}
      <div className="flex flex-1 w-full max-w-[1600px] mx-auto relative group/main">
        <main className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-500",
          !isReels && "pb-24 md:pb-8" // Extra padding for mobile bottom nav
        )}>
          <div className="flex-1 w-full h-full relative p-4 md:p-6 lg:p-8">
            <GlobalRouter />
          </div>

          {!isReels && <Footer />}
        </main>
      </div>

      {/* Mobile/Tablet Overlays */}
      <AppSidebar />
      <AppBottomNav />
      <PortalHubOverlay />
      <GlobalCartDrawer isOpen={isCartVisible} onClose={handleCloseCart} />
    </div>
  );

  return (
    <EventSyncProvider>
      <RoleBasedShell>
        {content}
      </RoleBasedShell>
    </EventSyncProvider>
  );
};
