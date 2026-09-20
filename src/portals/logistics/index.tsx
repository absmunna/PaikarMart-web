import { 
  Truck, Package, MapPin, Bike, Car, ShieldAlert, 
  Clock, ArrowRight, Star, Navigation, 
  Briefcase, Boxes, HardHat, PhoneCall 
} from "lucide-react";
import { motion } from "motion/react";

const LOGISTICS_CATEGORIES = [
  { id: "bike", label: "Bike Ride", icon: Bike, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "parcel", label: "Parcel Delivery", icon: Package, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "car", label: "Car/Sedan", icon: Car, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { id: "truck", label: "Truck/Pickup", icon: Truck, color: "text-indigo-500", bg: "bg-indigo-500/10" },
  { id: "intercity", label: "Intercity", icon: Navigation, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "emergency", label: "Emergency", icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10" },
  { id: "rental", label: "Rental", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: "cargo", label: "Cargo/LTL", icon: Boxes, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export default function LogisticsPortal() {
  return (
    <div className="px-4 py-6 md:px-6 md:py-8 min-h-screen pb-20">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight italic">
          Logistics <span className="text-amber-500">& Ride</span> Hub
        </h1>
        <p className="text-gray-500 dark:text-zinc-400 mt-2 font-medium">Fast, secure and reliable transportation services across Bangladesh.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Action Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {LOGISTICS_CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#121522] rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all group"
              >
                <div className={`p-4 rounded-2xl ${cat.bg} ${cat.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">{cat.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Booking Form */}
          <div className="bg-white dark:bg-[#121522] rounded-[2.5rem] border border-gray-100 dark:border-white/10 p-8 shadow-xl shadow-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32" />
            
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3 italic">
              <Navigation className="h-6 w-6 text-amber-500" /> Book Your Ride or Delivery
            </h2>

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
                </div>
                <input 
                  type="text" 
                  placeholder="Pickup Location" 
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-medium" 
                />
              </div>

              <div className="flex justify-center -my-2 relative z-10">
                <div className="h-8 w-8 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-white/10 absolute -top-4 -z-10" />
                  <div className="w-0.5 h-full bg-gray-200 dark:bg-white/10 absolute -bottom-4 -z-10" />
                  <ArrowRight className="h-4 w-4 text-gray-400 rotate-90" />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <div className="h-2 w-2 rounded-full bg-rose-500 ring-4 ring-rose-500/20" />
                </div>
                <input 
                  type="text" 
                  placeholder="Drop-off Location" 
                  className="w-full pl-10 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl outline-none focus:border-amber-500 transition-all font-bold text-gray-900 dark:text-white placeholder:text-gray-400 placeholder:font-medium" 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Vehicle Type</label>
                  <select className="bg-transparent border-none outline-none w-full font-bold text-gray-900 dark:text-white">
                    <option>Bike (Fastest)</option>
                    <option>Car (Comfort)</option>
                    <option>Pickup Truck</option>
                    <option>Mini Truck</option>
                  </select>
                </div>
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/10">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Load Weight</label>
                  <select className="bg-transparent border-none outline-none w-full font-bold text-gray-900 dark:text-white">
                    <option>No Load (Ride Only)</option>
                    <option>Small (Up to 5kg)</option>
                    <option>Medium (5-20kg)</option>
                    <option>Heavy (20kg+)</option>
                  </select>
                </div>
              </div>

              <button className="w-full mt-6 bg-amber-500 text-white rounded-2xl py-4 font-black text-lg hover:bg-amber-600 transition-all shadow-xl shadow-amber-500/20 active:scale-95">
                Check Availability & Fare
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Tracking Card */}
          <div className="bg-[#0f111a] rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[60px]" />
            <h3 className="text-xl font-black mb-2 flex items-center gap-2 italic">
              <Package className="h-5 w-5 text-amber-500" /> Track Parcel
            </h3>
            <p className="text-zinc-400 text-xs font-medium mb-6 leading-relaxed">Enter your tracking ID to get real-time updates on your delivery.</p>
            
            <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl">
              <input 
                type="text" 
                placeholder="PK-XXXX-XXXX" 
                className="bg-transparent border-none px-4 py-2 w-full text-white outline-none font-bold placeholder:text-zinc-600 uppercase tracking-widest text-sm" 
              />
              <button className="bg-amber-500 text-white font-black px-6 py-2 rounded-xl text-xs uppercase tracking-widest hover:bg-amber-600 transition-colors">
                Track
              </button>
            </div>
          </div>

          {/* Become a Rider */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-[2rem] p-8 text-white shadow-xl shadow-amber-500/10 group">
            <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <HardHat className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-black mb-3 leading-tight italic">Earn with PaikarMart</h3>
            <p className="text-white/80 text-sm font-medium mb-8 leading-relaxed">Register your bike, car or truck and start earning today with the biggest network in Bangladesh.</p>
            <button className="w-full bg-white text-amber-600 rounded-xl py-3.5 font-black text-sm uppercase tracking-widest hover:bg-amber-50 transition-all shadow-lg shadow-black/5">
              Register as Rider
            </button>
          </div>

          {/* Emergency / Support */}
          <div className="bg-white dark:bg-[#121522] rounded-[2rem] border border-gray-100 dark:border-white/10 p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-rose-500" /> 24/7 Support
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-wider">Emergency Helpline</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">09612-XXXXXX</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Deliveries / History */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white italic tracking-tight px-2 flex items-center gap-3">
          <Clock className="h-6 w-6 text-indigo-500" /> Recent Activity
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-[#121522] rounded-[2rem] border border-gray-100 dark:border-white/10 p-6 shadow-sm hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                    <Truck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900 dark:text-white">Truck Delivery</p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">ID: PK-902-392</p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  Completed
                </span>
              </div>
              <div className="space-y-2 border-l-2 border-dashed border-gray-200 dark:border-white/10 ml-5 pl-5 relative py-1">
                <div className="absolute top-0 -left-[5px] h-2 w-2 rounded-full bg-gray-200 dark:bg-zinc-700" />
                <div className="absolute bottom-0 -left-[5px] h-2 w-2 rounded-full bg-gray-200 dark:bg-zinc-700" />
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">Chittagong Port, Gate 4</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white truncate">Dhaka, Banani Block E</p>
              </div>
              <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/5">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">4.9</span>
                </div>
                <p className="text-sm font-black text-amber-500">৳12,450</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
