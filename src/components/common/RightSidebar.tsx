import { Sparkles, Volume2, TrendingUp, UserPlus, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SUGGESTIONS = [
  { id: '1', name: 'Md Munna', role: 'Premium Seller', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
  { id: '2', name: 'Sara Rahman', role: 'Verified Buyer', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: '3', name: 'Dhaka Garments', role: 'Manufacturer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
];

const TRENDING = [
  { id: '1', topic: '#CottonFabric', count: '1.2k posts' },
  { id: '2', topic: '#BulkTrade', count: '850 posts' },
  { id: '3', topic: '#DhakaFashion', count: '2.1k posts' },
];

export function RightSidebar() {
  const navigate = useNavigate();

  return (
    <aside className="hidden xl:flex w-80 flex-col gap-8 p-6 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto no-scrollbar">
      {/* Become a Seller CTA */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#FF7A00] to-orange-600 shadow-xl shadow-orange-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-125 transition-transform">
          <Sparkles className="h-16 w-16 text-white" />
        </div>
        <h4 className="text-base font-black text-white leading-tight mb-2 italic">Sell on PaikarMart</h4>
        <p className="text-xs text-white/80 font-medium mb-4">Reach thousands of buyers across Bangladesh instantly.</p>
        <button 
          onClick={() => navigate('/become-seller')}
          className="w-full bg-white text-[#FF7A00] py-2.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-orange-50 transition-colors"
        >
          Get Started
        </button>
      </div>

      {/* Suggested Contacts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Suggested Sellers</h4>
          <button className="text-[10px] font-bold text-[#FF7A00] hover:underline">See All</button>
        </div>
        <div className="flex flex-col gap-3">
          {SUGGESTIONS.map((s) => (
            <div key={s.id} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <img src={s.avatar} alt={s.name} className="h-10 w-10 rounded-full object-cover border border-white/10" />
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-[#FF7A00] transition-colors">{s.name}</p>
                  <p className="text-[10px] text-zinc-500 font-medium">{s.role}</p>
                </div>
              </div>
              <button className="p-2 text-zinc-500 hover:text-[#FF7A00] hover:bg-[#FF7A00]/10 rounded-full transition-all">
                <UserPlus className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <TrendingUp className="h-4 w-4 text-[#FF7A00]" />
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Market Trends</h4>
        </div>
        <div className="flex flex-col gap-4">
          {TRENDING.map((t) => (
            <div key={t.id} className="group cursor-pointer">
              <p className="text-sm font-bold text-white group-hover:text-[#FF7A00] transition-colors">{t.topic}</p>
              <p className="text-[10px] text-zinc-500 font-medium">{t.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <Volume2 className="h-4 w-4 text-[#FF7A00]" />
          <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Official Updates</h4>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <p className="text-[11px] text-zinc-300 font-medium leading-relaxed italic">
            "New wholesale shipping rates now active for Intercity transport. Check Logistic Hub for details."
          </p>
          <button className="text-[10px] font-bold text-[#FF7A00] flex items-center gap-1 hover:underline">
            Read More <ExternalLink className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Footer Links (Social Style) */}
      <div className="mt-4 pt-6 border-t border-white/5">
        <div className="flex flex-wrap gap-x-3 gap-y-1 opacity-40 hover:opacity-100 transition-opacity">
          {['Privacy', 'Terms', 'Advertising', 'Ad Choices', 'Cookies', 'More'].map((link) => (
            <button key={link} className="text-[10px] text-zinc-400 hover:underline">{link}</button>
          ))}
        </div>
        <p className="text-[10px] text-zinc-600 font-medium mt-4">PaikarMart © 2026</p>
      </div>
    </aside>
  );
}
