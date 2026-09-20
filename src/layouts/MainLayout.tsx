import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { Footer } from "../components/Footer";
import { DesktopSidebar } from "../components/common/AppNavigation";
import { RightSidebar } from "../components/common/RightSidebar";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0f111a] text-white font-sans">
      <Header />
      
      <div className="flex flex-1 w-full max-w-[1440px] mx-auto">
        <DesktopSidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 pb-20 md:pb-0 w-full min-w-0">
          <Outlet />
        </main>

        <RightSidebar />
      </div>

      {/* Global Footer */}
      <Footer />

      {/* Bottom Navigation for Mobile */}
      <BottomNavigation />
    </div>
  );
}
