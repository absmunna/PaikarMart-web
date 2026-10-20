import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Wrench, Truck, ShieldCheck, Star, 
  Search, Filter, Clock, MapPin,
  ChevronRight, Laptop, Activity, Zap,
  Briefcase, PenTool, UserCheck, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';

const SERVICES = [
  { id: 's1', name: 'AC Servicing & Repair', icon: Zap, price: '৳৪৫০', rating: 4.9, reviews: 340, provider: 'Expert AC Solutions', availability: 'Instant' },
  { id: 's2', name: 'Home Cleaning Service', icon: Activity, price: '৳৮০০', rating: 4.7, reviews: 120, provider: 'FreshHome BD', availability: 'Scheduled' },
  { id: 's3', name: 'Laptop & Gadget Repair', icon: Laptop, price: '৳৫০০', rating: 4.8, reviews: 210, provider: 'Gadget Doc', availability: 'Instant' },
  { id: 's4', name: 'Plumbing & Pipe Fix', icon: PenTool, price: '৳৩০০', rating: 4.6, reviews: 85, provider: 'Master Plumbers', availability: 'Instant' },
];

export const ServicesPortal: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0c101c] border border-white/5 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 shadow-xl">
              <Wrench className="w-10 h-10 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Services Hub</h1>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">Local Technicians & Physical Services</p>
            </div>
          </div>
          <div className="flex gap-3">
             <Button variant="outline" className="h-14 rounded-2xl border-white/10 px-6 font-black uppercase text-[10px] tracking-widest bg-white/5">
                <Truck className="w-4 h-4 mr-2 text-sky-400" /> Instant Rider Dispatch
             </Button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Categories */}
        <div className="lg:col-span-3 space-y-4">
           <Card className="bg-[#111625] border-white/5 p-4 rounded-3xl sticky top-24">
              <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-4 mb-4">Service Categories</h4>
              <div className="space-y-1">
                 {[
                   { label: 'Repair & Fix', icon: Wrench, active: true },
                   { label: 'Cleaning', icon: Activity },
                   { label: 'Electronics', icon: Laptop },
                   { label: 'Logistics', icon: Truck },
                   { label: 'Professional', icon: Briefcase },
                 ].map((cat, i) => (
                   <button 
                    key={i}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                      cat.active ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'text-zinc-500 hover:bg-white/5'
                    }`}
                   >
                     <cat.icon className="w-4 h-4" />
                     {cat.label}
                   </button>
                 ))}
              </div>
           </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-9 space-y-6">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
              <Input 
                placeholder="Find a technician or service provider..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border-white/10 pl-12 h-14 rounded-2xl text-sm font-bold shadow-xl"
              />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((service) => (
                <Card key={service.id} className="bg-[#111625] border-white/5 p-6 rounded-[2.5rem] group hover:border-purple-500/30 transition-all duration-500 shadow-xl overflow-hidden relative">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <service.icon className="w-6 h-6 text-purple-400" />
                         </div>
                         <div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">{service.name}</h3>
                            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-2">By {service.provider}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/5 text-[10px] text-amber-500 font-black border border-amber-500/10">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {service.rating}
                      </div>
                   </div>

                   <div className="mt-6 flex items-center gap-4">
                      <div className="bg-white/5 rounded-2xl px-4 py-2 border border-white/5 flex flex-col">
                         <span className="text-[8px] text-zinc-500 font-black uppercase">Starting at</span>
                         <span className="text-xl font-black text-white">{service.price}</span>
                      </div>
                      <div className="flex-1 bg-emerald-500/5 rounded-2xl px-4 py-2 border border-emerald-500/10 flex items-center gap-3">
                         <Clock className="w-4 h-4 text-emerald-400" />
                         <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase">{service.availability} Booking</p>
                            <p className="text-[8px] text-zinc-500 font-bold uppercase">Provider nearby</p>
                         </div>
                      </div>
                   </div>

                   <div className="mt-6 flex gap-3 pt-4 border-t border-white/5">
                      <Button 
                        onClick={() => toast.success(`Booking service: ${service.name}`)}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-black text-[10px] uppercase tracking-widest h-11 rounded-xl"
                      >
                        Book Service
                      </Button>
                      <Button variant="ghost" size="icon" className="w-11 h-11 rounded-xl bg-white/5 text-zinc-400">
                         <UserCheck className="w-5 h-5" />
                      </Button>
                   </div>
                </Card>
              ))}
           </div>

           {/* Custom Service Request */}
           <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Need a Custom Service?</h3>
                 <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Submit a request and get quotes from top-rated professionals.</p>
              </div>
              <Button className="bg-white text-black font-black text-xs uppercase tracking-widest px-10 rounded-2xl h-14 shadow-2xl transition-all active:scale-95 whitespace-nowrap">
                 Post a Job <Plus className="w-4 h-4 ml-2" />
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
};
