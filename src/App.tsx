import { Toaster } from "@/components/ui/sonner";
import { AppProviders } from "@/providers/AppProviders";
import { AppShell } from "@/app/AppShell/AppShell";
import { orderTrackingService } from "@/modules/orders/services/orderTrackingService";
import { useEffect } from "react";
import { GlobalBoundary } from "@/app/AppShell/GlobalBoundary";

function App() {
  useEffect(() => {
    try {
      orderTrackingService.initEventListener();
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <GlobalBoundary>
      <AppProviders>
        <AppShell />
        <Toaster />
      </AppProviders>
    </GlobalBoundary>
  );
}

export default App;
