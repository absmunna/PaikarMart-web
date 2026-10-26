import { 
  Wrench, Stethoscope, Briefcase, Scissors, MonitorPlay, 
  Home as HomeIcon, Star, MapPin, Clock, Search,
  Filter, ChevronRight, CheckCircle2, ShieldCheck,
  Zap, Calendar, UserCheck, MessageSquare, Hammer,
  Paintbrush, GraduationCap, HeartPulse
} from "lucide-react";
import { motion } from "motion/react";

const SERVICE_CATEGORIES = [
  { id: "repair", label: "Home Repair", icon: Hammer, color: "text-orange-500", bg: "bg-orange-500/10", count: 124 },
  { id: "beauty", label: "Beauty & Salon", icon: Scissors, color: "text-rose-500", bg: "bg-rose-500/10", count: 85 },
  { id: "health", label: "Healthcare", icon: HeartPulse, color: "text-emerald-500", bg: "bg-emerald-500/10", count: 62 },
  { id: "it", label: "Digital & IT", icon: MonitorPlay, color: "text-blue-500", bg: "bg-blue-500/10", count: 45 },
  { id: "legal", label: "Professional", icon: Briefcase, color: "text-indigo-500", bg: "bg-indigo-500/10", count: 32 },
  { id: "cleaning", label: "Deep Cleaning", icon: HomeIcon, color: "text-purple-500", bg: "bg-purple-500/10", count: 54 },
  { id: "painting", label: "Home Decor", icon: Paintbrush, color: "text-amber-500", bg: "bg-amber-500/10", count: 28 },
  { id: "education", label: "Education", icon: GraduationCap, color: "text-cyan-500", bg: "bg-cyan-500/10", count: 96 },
];

const FEATURED_PROVIDERS = [
  { id: 1, name: "FixIt Pro Solutions", service: "AC & Electrician", rating: 4.9, reviews: 342, price: "৳500/hr", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400", verified: true },
  { id: 2, name: "Serene Spa at Home", service: "Beauty & Wellness", rating: 4.8, reviews: 215, price: "৳1,200/pkg", image: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=400", verified: true },
  { id: 3, name: "Green Tech IT", service: "Laptop & Web Services", rating: 4.7, reviews: 156, price: "৳800/hr", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400", verified: true },
];

export default function ServicesPortal() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8 min-h-screen pb-32">
      {/* Hero / Header */}
      <div className="mb-12 relative rounded-[3rem] bg-indigo-950 p-8 md:p-16 overflow-hidden border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 blur-[100px]" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <ShieldCheck className="h-4 w-4" /> Trusted Professionals
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] italic tracking-tight">
              Expert Help <br />
              <span className="text-indigo-400">At Your Doorstep.</span>
            </h1>
            <p className="text-zinc-400 text-lg font-medium leading-relaxed max-w-md">
              Find and book top-rated professionals for home repair, beauty, healthcare and business services.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="What service do you need?" 
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-indigo-500 transition-all text-white font-bold placeholder:text-zinc-600 placeholder:font-medium" 
                />
              </div>
              <button className="w-full sm:w-auto bg-indigo-500 text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20">
                Find Help
              </button>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-2 gap-4">
             <div className="space-y-4 pt-12">
               <div className="h-40 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl p-6 flex flex-col justify-end">
                 <Wrench className="h-8 w-8 text-indigo-400 mb-2" />
                 <p className="text-lg font-black text-white italic">Repair</p>
               </div>
               <div className="h-40 rounded-[2.5rem] bg-indigo-500 p-6 flex flex-col justify-end">
                 <Scissors className="h-8 w-8 text-white mb-2" />
                 <p className="text-lg font-black text-white italic">Salon</p>
               </div>
             </div>
             <div className="space-y-4">
               <div className="h-40 rounded-[2.5rem] bg-zinc-800 p-6 flex flex-col justify-end">
                 <MonitorPlay className="h-8 w-8 text-emerald-400 mb-2" />
                 <p className="text-lg font-black text-white italic">IT Help</p>
               </div>
               <div className="h-40 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl p-6 flex flex-col justify-end">
                 <Briefcase className="h-8 w-8 text-amber-400 mb-2" />
                 <p className="text-lg font-black text-white italic">Business</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-8 mb-16">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">Explore Categories</h2>
          <button className="text-indigo-500 text-sm font-black uppercase tracking-widest hover:underline flex items-center gap-1">
            Browse All <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
          {SERVICE_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-[#121522] border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-6 text-center hover:shadow-xl hover:shadow-black/5 hover:border-indigo-500/30 transition-all cursor-pointer group"
            >
              <div className={`h-16 w-16 rounded-2xl ${cat.bg} ${cat.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <cat.icon className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-1">{cat.label}</h3>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{cat.count}+ Providers</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Professionals */}
      <div className="space-y-8 mb-20">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
            <h2 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight">Top-Rated Professionals</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURED_PROVIDERS.map((provider) => (
            <motion.div 
              key={provider.id}
              whileHover={{ y: -5 }}
              className="group bg-white dark:bg-[#121522] rounded-[2.5rem] border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all p-6"
            >
              <div className="flex items-start gap-5 mb-6">
                <div className="h-24 w-24 rounded-[2rem] bg-gray-100 border border-gray-200 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                  <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-black text-gray-900 dark:text-white truncate italic">{provider.name}</h3>
                    {provider.verified && <CheckCircle2 className="h-4 w-4 text-indigo-500 shrink-0" />}
                  </div>
                  <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">{provider.service}</p>
                  <div className="flex items-center gap-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> {provider.rating} ({provider.reviews})
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50 dark:border-white/5">
                <div>
                  <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Starting from</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white">{provider.price}</p>
                </div>
                <button className="bg-zinc-900 dark:bg-white dark:text-black text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-500 dark:hover:bg-indigo-500 dark:hover:text-white transition-all">
                  Book Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Registration CTA */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-[3rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-900/20">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="space-y-6 max-w-xl">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <UserCheck className="h-7 w-7 text-white" />
            </div>
            <h3 className="text-4xl font-black italic leading-tight">Expert at your work? <br />Join our pro network.</h3>
            <p className="text-white/80 font-medium text-lg leading-relaxed">
              Become a verified service provider on PaikarMart. Grow your business with guaranteed payments and a constant stream of customers.
            </p>
          </div>
          <div className="flex flex-col gap-4 shrink-0 w-full lg:w-auto">
             <button className="bg-white text-indigo-700 px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-black/10">
              Register as Provider
            </button>
            <div className="flex items-center justify-center gap-6 text-white/60 text-[10px] font-black uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Verified Only</span>
              <span className="flex items-center gap-1.5"><MessageSquare className="h-4 w-4" /> Live Chat</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Flexible</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
