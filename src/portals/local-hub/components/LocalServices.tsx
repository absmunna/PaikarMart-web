import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Star, MapPin, ShieldCheck, Clock, 
  ArrowRight, Phone, MessageSquare,
  Wrench, Zap, Droplets, Briefcase, 
  Search, SlidersHorizontal, Loader2,
  AlertTriangle
} from 'lucide-react';
import { LocalService } from '../types';
import { cn } from '@/lib/utils';

const SERVICE_CATEGORIES = [
  { id: 'electrical', name: 'Electrical', icon: Zap, color: 'text-yellow-400' },
  { id: 'plumbing', name: 'Plumbing', icon: Droplets, color: 'text-blue-400' },
  { id: 'appliances', name: 'Appliances', icon: Wrench, color: 'text-orange-400' },
  { id: 'cleaning', name: 'Cleaning', icon: Star, color: 'text-cyan-400' },
];

export const LocalServices: React.FC = () => {
  const [services, setServices] = useState<LocalService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/local/services');
        const result = await response.json();
        if (result.status === 'success') {
          setServices(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div className="space-y-8">
      {/* Search & Categories */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search for doctors, electricians, tutors..." 
            className="w-full h-12 pl-10 pr-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 rounded-2xl hover:border-cyan-500/50 transition-all whitespace-nowrap"
            >
              <cat.icon className={cn("w-4 h-4", cat.color)} />
              <span className="text-xs font-bold text-white">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-white">Top Rated Providers</h2>
          <button className="text-cyan-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1">
            See All <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              <p className="text-zinc-500 text-sm">Searching for best providers...</p>
            </div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <motion.div 
                key={service.id}
                whileHover={{ scale: 1.01 }}
                className="bg-zinc-900 border border-white/5 rounded-3xl p-4 flex gap-4 hover:border-cyan-500/30 transition-all group"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
                  <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-md rounded border border-white/10 text-[9px] font-black text-white uppercase">
                    {service.category}
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-white text-sm">{service.name}</h3>
                      <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                        <Star size={12} className="fill-yellow-400" />
                        {service.rating}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-zinc-400">{service.provider}</span>
                      {service.isVerified && <ShieldCheck size={12} className="text-blue-400" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full uppercase">
                        {service.availability}
                      </span>
                      <span className="text-xs font-black text-white">{service.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 h-9 bg-cyan-500 text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-colors">
                      Book Now
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center justify-center space-y-3 bg-zinc-900/50 rounded-3xl border border-dashed border-white/10">
              <AlertTriangle className="w-8 h-8 text-zinc-700" />
              <p className="text-zinc-500 text-sm">No service providers found in this area.</p>
            </div>
          )}
        </div>
      </div>

      {/* Safety & Trust Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-3xl p-5 flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shrink-0">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm mb-1">PaikarMart Safe-Home Guarantee</h3>
          <p className="text-xs text-blue-200 leading-relaxed">
            All service providers are background-verified. We guarantee quality service or your money back.
          </p>
        </div>
      </div>
    </div>
  );
};
