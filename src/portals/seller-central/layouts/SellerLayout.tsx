import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Wallet, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronRight,
  LogOut
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

interface SellerLayoutProps {
  children: React.ReactNode;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "ড্যাশবোর্ড", path: "/seller-central" },
    { icon: Package, label: "ইনভেন্টরি", path: "/seller-central/inventory" },
    { icon: ShoppingBag, label: "অর্ডার", path: "/seller-central/orders" },
    { icon: BarChart3, label: "অ্যানালিটিক্স", path: "/seller-central/analytics" },
    { icon: Wallet, label: "ওয়ালেট", path: "/wallet" },
    { icon: Settings, label: "সেটিংস", path: "/seller-central/settings" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0f111a] text-white flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#141624] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-8 border-b border-white/5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 bg-[#FF7A00] rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-[#FF7A00]/20 group-hover:scale-110 transition-transform">P</div>
              <span className="text-xl font-bold tracking-tight">PaikarMart <span className="text-[#FF7A00]">Central</span></span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-2xl font-medium transition-all duration-200 group
                    ${isActive 
                      ? "bg-[#FF7A00] text-white shadow-lg shadow-[#FF7A00]/20" 
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
                  {item.label}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-white/5">
            <div className="bg-[#1e2136] rounded-3xl p-4 flex items-center gap-3 border border-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF7A00] to-orange-600 flex items-center justify-center text-white font-bold uppercase overflow-hidden shrink-0">
                {user?.name ? user.name.charAt(0) : "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate">{user?.name || "Seller Name"}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ভেরিফাইড সেলার</p>
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 text-gray-500 hover:text-rose-400 transition-colors rounded-xl hover:bg-white/5"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 bg-[#0f111a]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
          <button 
            className="p-2 text-gray-400 hover:text-white lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md ml-4">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="অর্ডার বা প্রোডাক্ট খুঁজুন..." 
                className="w-full bg-[#1e2136] border border-white/5 rounded-2xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#FF7A00]/50 transition-all text-white placeholder:text-gray-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4 ml-auto">
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-[#FF7A00] rounded-full border-2 border-[#0f111a]"></span>
            </button>
            <div className="h-8 w-px bg-white/5 mx-1 hidden sm:block"></div>
            <div className="flex items-center gap-3 bg-[#1e2136] rounded-2xl px-3 py-1.5 border border-white/5 sm:flex hidden">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">ব্যালেন্স</span>
                <span className="text-xs font-bold text-emerald-400 tracking-tight">৳ ৮,৫৫০.০০</span>
              </div>
              <Wallet className="h-4 w-4 text-[#FF7A00]" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-0">
          {children}
        </div>
      </main>
    </div>
  );
}
