import * as React from "react";
import { Search, MapPin, Filter, AlertTriangle } from "lucide-react";
import { StoryBar } from "@shared/StoryBar";
import { PortalIconBar } from "@shared/PortalIconBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { HeroSpotlight } from "@shared/HeroSpotlight";
import { useNavigate } from "react-router-dom";

interface ListingPortalLayoutProps {
  titleEn: string;
  titleBn: string;
  context: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  children: React.ReactNode;
}

export function ListingPortalLayout({ titleEn, titleBn, context, searchQuery, onSearchChange, children }: ListingPortalLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-2 pb-28 pt-0">
      {/* ━━━ HEADER SECTION (Top Priority) ━━━ */}
      <section className="mt-4 px-2 space-y-1">
        <StoryBar context={context} />
        <PortalIconBar context={context} />
      </section>

      <CategoryNavBar context={context} topOffset="72px" />
      
      <div className="px-4 mt-2">
        <h1 className="text-xl font-black text-white">{titleBn}</h1>
        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">{titleEn}</p>
        
        {/* ━━━ HERO SPOTLIGHT (Injected after title) ━━━ */}
        <div className="mt-6">
          <HeroSpotlight context={context} />
        </div>

        <div className="mt-6 h-11 bg-[var(--pm-surface)]/50 rounded-2xl border border-white/[0.06] px-4 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-[var(--pm-accent)]" />
          <input 
            type="text" 
            placeholder="Search listings..." 
            value={searchQuery} 
            onChange={e => onSearchChange(e.target.value)} 
            className="flex-1 bg-transparent text-[12px] text-white outline-none" 
          />
        </div>
      </div>
      <div className="px-4">{children}</div>
    </div>
  );
}
