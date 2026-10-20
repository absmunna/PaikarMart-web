import React from 'react';
import { 
  ShoppingBag, Factory, Sparkles, Award, MapPin, 
  Activity, Store, Wrench, Laptop, Briefcase, UserCircle, 
  Truck, LayoutDashboard 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const modules = [
  { id: 'marketplace', icon: ShoppingBag, label: 'Marketplace', path: '/marketplace', color: 'bg-orange-500' },
  { id: 'wholesale', icon: Factory, label: 'Wholesale', path: '/wholesale', color: 'bg-indigo-500' },
  { id: 'pk-store', icon: Sparkles, label: 'PK Store', path: '/pk-shop', color: 'bg-amber-500' },
  { id: 'brands', icon: Award, label: 'Brands', path: '/brands', color: 'bg-pink-500' },
  { id: 'nearby', icon: MapPin, label: 'Nearby', path: '/nearby', color: 'bg-emerald-500' },
  { id: 'pharmacy', icon: Activity, label: 'Pharmacy', path: '/pharmacy', color: 'bg-teal-500' },
  { id: 'grocery', icon: Store, label: 'Grocery', path: '/grocery', color: 'bg-orange-600' },
  { id: 'services', icon: Wrench, label: 'Services', path: '/services', color: 'bg-purple-500' },
  { id: 'digital', icon: Laptop, label: 'Digital', path: '/digital', color: 'bg-blue-500' },
  { id: 'become-seller', icon: Briefcase, label: 'Seller', path: '/become-seller', color: 'bg-zinc-600' },
  { id: 'logistics', icon: Truck, label: 'Logistics', path: '/logistic', color: 'bg-amber-700' },
  { id: 'admin', icon: LayoutDashboard, label: 'Admin', path: '/admin', color: 'bg-red-500' },
];

export const PortalHubPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--pm-bg)] p-6 pb-24">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl font-black text-white mb-8 tracking-tight">Advanced Portal Hub</h1>
        
        <div className="grid grid-cols-3 gap-4">
          {modules.map((m) => (
            <Link
              key={m.id}
              to={m.path}
              className="group flex flex-col items-center gap-2"
            >
              <div className={cn(
                "w-16 h-16 rounded-[22px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-all",
                m.color
              )}>
                <m.icon className="h-7 w-7 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase text-[var(--pm-muted)] group-hover:text-white text-center">
                {m.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortalHubPage;
