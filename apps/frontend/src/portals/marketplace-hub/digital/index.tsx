import { 
  Gamepad2, Music, Video, FileText, Gift, 
  Download, Globe, Zap, ShieldCheck, Star,
  Monitor, Cpu, Layers, HardDrive, Smartphone,
  ShoppingBag, CheckCircle2, Flame, Sparkles
} from "lucide-react";
import { motion } from "motion/react";

const DIGITAL_CATEGORIES = [
  { id: "games", label: "Game Credits", icon: Gamepad2, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "subscriptions", label: "Subscriptions", icon: Layers, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "software", label: "Software", icon: Cpu, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { id: "giftcards", label: "Gift Cards", icon: Gift, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "courses", label: "Online Courses", icon: Monitor, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "assets", label: "Design Assets", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-500/10" },
];

const FEATURED_DIGITAL = [
  { id: 1, title: "PUBG Mobile UC Top-up", category: "Game Credits", price: "৳1,250", rating: 4.9, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400", instant: true },
  { id: 2, title: "Netflix Premium (1 Month)", category: "Subscription", price: "৳450", rating: 4.8, image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=400", instant: true },
  { id: 3, title: "Microsoft Office 365 Pro", category: "Software", price: "৳2,500", rating: 4.7, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400", instant: false },
];

export default function DigitalPortal() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8 min-h-screen pb-32">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2 px-1">
          <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Instant Delivery</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight italic">
          Digital <span className="text-blue-500">Market</span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium max-w-2xl">
          Instant access to game credits, software licenses, premium subscriptions, and online learning resources.
        </p>
      </div>

      {/* Quick Stats / Trust */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Zap className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider italic">Delivery in 60 Seconds</p>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider italic">100% Verified Keys</p>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <p className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider italic">Over 10,000+ Items</p>
        </div>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
        {DIGITAL_CATEGORIES.map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#121522] rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm hover:border-blue-500/30 transition-all group"
          >
            <div className={`p-4 rounded-2xl ${cat.bg} ${cat.color} mb-3 group-hover:scale-110 transition-transform`}>
              <cat.icon className="h-6 w-6" />
            </div>
            <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-widest">{cat.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Featured Section */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Flame className="h-6 w-6 text-rose-500" />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">Trending Digital Assets</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_DIGITAL.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-[#121522] rounded-[2.5rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all p-4"
            >
              <div className="relative h-48 rounded-[2rem] overflow-hidden mb-6">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                {item.instant && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">
                    Instant
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6">
                  <button className="bg-white text-black px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300">
                    Buy Now
                  </button>
                </div>
              </div>

              <div className="px-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{item.category}</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-gray-900 dark:text-white">{item.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white italic leading-tight mb-4">{item.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-black text-gray-900 dark:text-white">{item.price}</p>
                  <div className="h-8 w-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-blue-500 transition-colors cursor-pointer">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Registration CTA */}
      <div className="mt-20 relative rounded-[3rem] bg-[#0f111a] p-10 md:p-16 overflow-hidden border border-white/5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 blur-[100px] -ml-32 -mt-32" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/5 blur-[80px] -mr-32 -mb-32" />
        
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto space-y-8">
          <div className="h-16 w-16 rounded-[1.5rem] bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tight leading-tight">Sell Your Digital Assets Globally.</h2>
          <p className="text-zinc-400 font-medium text-lg leading-relaxed">
            Join PaikarMart as a digital creator. Sell game keys, software, subscriptions or design assets to a worldwide audience with automated delivery and secure payouts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
             <button className="bg-blue-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20">
              Open Digital Store
            </button>
            <button className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
