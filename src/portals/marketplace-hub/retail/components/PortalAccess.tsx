import React from 'react';
import { ShoppingBag, Box, MapPin, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PortalAccess = () => {
  const navigate = useNavigate();
  
  const portals = [
    { name: 'পাইকারি', icon: Box, path: '/b2b', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { name: 'মার্কেট', icon: ShoppingBag, path: '/marketplace', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { name: 'লোকাল', icon: MapPin, path: '/local', color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { name: 'লজিস্টিক', icon: Truck, path: '/logistics', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 px-2">
      {portals.map((p) => (
        <div 
          key={p.name} 
          onClick={() => navigate(p.path)}
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${p.bg}`}>
            <p.icon className={`w-6 h-6 ${p.color}`} />
          </div>
          <span className="text-[10px] font-bold text-center text-zinc-300">{p.name}</span>
        </div>
      ))}
    </div>
  );
};
