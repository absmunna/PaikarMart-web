import React, { useState } from 'react';
import { useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { GlobalNavigation } from "@/components/common/GlobalNavigation";
import { cn } from "@/lib/utils";
import { GlobalTopBar as Header } from "./GlobalTopBar";
import { BottomNav } from "@/components/common/navigation/BottomNav";
import { AppLauncher } from "@/components/common/navigation/AppLauncher";
import { getRoleGroup, ROLE_GROUP_META } from "@/config/roles.config";
import { RoleBasedSidebar } from "./RoleBasedSidebar";
import { GlobalRouter } from "./GlobalRouter";
import { EventSyncProvider } from "./EventSyncProvider";
import { RoleBasedShell } from "./RoleBasedShell";
import { Footer } from "./Footer";
import { AnimatePresence } from "motion/react";

export const AppShell: React.FC = () => {
  const { pathname } = useLocation();
  const { role } = useAuth();
  const isReels = pathname === "/reels";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('pm_sidebar_collapsed') === 'true';
  });
  const userRole = (role as any) || 'guest';

  React.useEffect(() => {
    const roleGroup = getRoleGroup(userRole);
    const roleMeta = ROLE_GROUP_META[roleGroup];
    document.title = `Paikar Mart - ${roleMeta.labelEn}`;
  }, [userRole]);

  React.useEffect(() => {
    const handleToggle = () => setIsSidebarOpen(prev => !prev);
    const handleOpen = () => setIsSidebarOpen(true);
    const handleClose = () => setIsSidebarOpen(false);
    
    const handleCollapseToggle = (e: any) => {
      const targetState = e.detail !== undefined ? e.detail : !isSidebarCollapsed;
      setIsSidebarCollapsed(targetState);
      localStorage.setItem('pm_sidebar_collapsed', String(targetState));
    };

    window.addEventListener('TOGGLE_SIDEBAR', handleToggle);
    window.addEventListener('OPEN_SIDEBAR', handleOpen);
    window.addEventListener('CLOSE_SIDEBAR', handleClose);
    window.addEventListener('TOGGLE_SIDEBAR_COLLAPSE', handleCollapseToggle);

    return () => {
      window.removeEventListener('TOGGLE_SIDEBAR', handleToggle);
      window.removeEventListener('OPEN_SIDEBAR', handleOpen);
      window.removeEventListener('CLOSE_SIDEBAR', handleClose);
      window.removeEventListener('TOGGLE_SIDEBAR_COLLAPSE', handleCollapseToggle);
    };
  }, [isSidebarCollapsed]);

  const content = (
    <div className={isReels ? "h-[100dvh] w-full bg-black overflow-hidden" : "min-h-[100dvh] w-full overflow-x-hidden flex flex-col bg-[var(--pm-bg)] relative isolate"}>
      <GlobalNavigation />
      {/* Background decorations for ultra-wide screens */}
      {!isReels && (
        <div className="fixed inset-0 pointer-events-none -z-10 opacity-30 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>
      )}

      <div className={isReels ? "h-full" : "flex-1 w-full max-w-[1440px] mx-auto flex flex-col bg-[var(--pm-bg)] shadow-none border-x border-white/[0.03] relative isolate"}>
        {!isReels && <Header isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}
        
        <div className={isReels ? "h-full" : "flex flex-1 w-full relative pt-[72px]"}>
          {!isReels && (
            <>
              {isSidebarOpen && (
                <div 
                  onClick={() => setIsSidebarOpen(false)}
                  className="fixed inset-0 bg-black/60 z-[400] lg:hidden backdrop-blur-[2px] transition-all duration-350 pointer-events-auto"
                />
              )}
              <RoleBasedSidebar isOpen={isSidebarOpen} isCollapsed={isSidebarCollapsed} userRole={userRole} onClose={() => setIsSidebarOpen(false)} />
            </>
          )}
          
          {!isReels ? (
            <div className={cn(
              "flex-1 flex flex-col min-w-0 transition-all duration-300 relative isolate",
              isSidebarCollapsed ? "lg:ml-[80px]" : "lg:ml-[280px]"
            )}>
              <main className={cn(
                "flex-1 pb-[calc(80px+env(safe-area-inset-bottom))] lg:pb-6 px-2 sm:px-4 transition-all duration-300",
                `role-context-${role || 'guest'}`
              )}>
                <div className="max-w-[1360px] mx-auto w-full h-full relative"> 
                   <GlobalRouter />
                </div>
              </main>
              <Footer />
            </div>
          ) : (
            <main className="h-full w-full">
              <GlobalRouter />
            </main>
          )}
        </div>
      </div>

      <BottomNav isSidebarOpen={isSidebarOpen} />
      <AppLauncher />
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
