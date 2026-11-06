import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Bell, Menu, Home, Package, Store } from 'lucide-react';

interface B2CLayoutProps {
  children: React.ReactNode;
}

export const B2CLayout: React.FC<B2CLayoutProps> = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] flex flex-col">
      {/* Retail Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-zinc-100 px-4 py-3 flex items-center justify-between shadow-sm sm:px-6">
        <div className="flex items-center gap-2" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg shadow-orange-200">
            <Store className="w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-base font-black tracking-tighter leading-none">PaikarMart</h1>
            <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Retail Hub</p>
          </div>
        </div>

        <div className="flex-1 max-w-lg mx-6 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input 
              type="text" 
              placeholder="পণ্য, ব্র্যান্ড বা দোকান খুঁজুন..." 
              className="w-full h-11 bg-zinc-100 border-0 rounded-2xl pl-10 pr-4 text-sm outline-none focus:ring-2 ring-orange-500/20"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all">
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={() => navigate('/cart')} className="relative p-2 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-all">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">২</span>
          </button>
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-xl bg-zinc-100 overflow-hidden border border-zinc-200 hover:border-orange-500 transition-all">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Munna" alt="User" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-zinc-100 px-6 py-2 flex items-center justify-between sm:hidden z-50">
        <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-zinc-400">
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold">Home</span>
        </button>
        <button onClick={() => navigate('/shop')} className="flex flex-col items-center gap-1 text-orange-600">
          <Store className="w-5 h-5" />
          <span className="text-[9px] font-bold">Shop</span>
        </button>
        <button onClick={() => navigate('/orders')} className="flex flex-col items-center gap-1 text-zinc-400">
          <Package className="w-5 h-5" />
          <span className="text-[9px] font-bold">Orders</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-zinc-400">
          <User className="w-5 h-5" />
          <span className="text-[9px] font-bold">Account</span>
        </button>
      </nav>
    </div>
  );
};
