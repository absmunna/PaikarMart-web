import * as React from "react";
import { MapPin, Star, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface ListingCardProps {
  item: {
    id: string;
    title: string;
    price: string;
    image: string;
    location: string;
    badges: string[];
  };
  onClick: () => void;
}

export function ListingCard({ item, onClick }: ListingCardProps) {
  return (
    <div onClick={onClick} className="rounded-2xl border border-white/[0.05] bg-white/[0.02] p-3 hover:border-[var(--pm-accent)]/30 transition-all cursor-pointer">
      <div className="h-32 rounded-xl overflow-hidden mb-3 bg-neutral-900">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <h3 className="text-[12px] font-black text-white truncate">{item.title}</h3>
      <p className="text-[14px] font-black text-[var(--pm-accent)] mt-1">{item.price}</p>
      <div className="flex items-center gap-1 text-[9px] text-zinc-500 mt-2">
        <MapPin className="w-3 h-3" /> {item.location}
      </div>
      <div className="flex gap-1 mt-2">
        {item.badges.map((b, i) => (
          <span key={i} className="text-[8px] font-black px-1.5 py-0.5 rounded bg-white/5 text-zinc-400 uppercase">{b}</span>
        ))}
      </div>
    </div>
  );
}
