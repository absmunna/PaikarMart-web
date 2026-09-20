import * as React from "react";
import { 
  Building2, Plane, MapPin, Search, Calendar,
  Info, ShieldCheck, Zap, Clock, ChevronRight, ArrowLeft
} from "lucide-react";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { useSearchParams, useNavigate } from "react-router-dom";
import { GlassCard } from "@/components/ui/GlassCard";

export default function TravelPortal() {
  const [searchParams] = useSearchParams();
  const selectedCat = searchParams.get("cat") || "all";
  const navigate = useNavigate();

  return (
    <div className="w-full px-4 pb-24 flex flex-col pt-16">
      <div className="flex-1 flex flex-col gap-6 pt-2">
        <section className="pt-2 md:pt-4">
          <StoryBar context={"travel" as any} />
        </section>

        <div className="sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-border/50 -mx-4 px-4">
          <CategoryNavBar context={"travel" as any} />
        </div>

        <div className="flex flex-col gap-6 pt-2">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] p-6 bg-gradient-to-br from-blue-900/20 via-cyan-900/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-lg font-black text-foreground">Travel & Booking</h1>
                <p className="text-xs text-muted-foreground">Hotels, flights & holiday packages</p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-rose-500" />
                <div className="flex-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Destination</p>
                  <p className="text-sm font-semibold text-white">Where to next?</p>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-cyan-400" />
                <div className="flex-1">
                  <p className="text-[10px] text-white/50 uppercase tracking-wider font-bold">Dates</p>
                  <p className="text-sm font-semibold text-white/40 italic">Select your travel dates</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-cyan-400">Trusted Booking</p>
                <p className="text-[10px] text-cyan-100/60 leading-relaxed mt-1">
                  Verified hotels and reliable travel operators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
