import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useGetDemand, getGetDemandQueryKey } from "@/modules/app/api/client/hooks";
import { UnifiedPostDetail } from "@/components/common/UnifiedPostDetail";
import { mapDemandToFeedItem } from "@/modules/social/utils/mappers";
import { Tag, Calendar, CheckCircle2, Gavel } from "lucide-react";
import { toast } from 'sonner';

export default function DemandDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: demand, isLoading } = useGetDemand(id ?? '', { 
    query: { 
      queryKey: getGetDemandQueryKey(id ?? ''), 
      enabled: !!id 
    } 
  });

  if (isLoading) return <div className="p-8 text-center text-zinc-500 font-black animate-pulse">Loading Demand...</div>;
  if (!demand) return <div className="p-8 text-center text-zinc-500 font-black">Demand Not Found</div>;

  const feedItem = mapDemandToFeedItem(demand);

  const customFields = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10 space-y-2">
          <div className="flex items-center gap-2 text-orange-400">
            <Calendar className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Deadline</span>
          </div>
          <p className="text-xs font-black text-white">{demand.deadline || ' June 30, 2026'}</p>
        </div>
        <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Gavel className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Status</span>
          </div>
          <p className="text-xs font-black text-white uppercase">{demand.status || 'OPEN'}</p>
        </div>
      </div>

      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
        <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Matched Vendors ({(demand.matches ?? []).length})</h4>
        {demand.matches && demand.matches.length > 0 ? (
          <div className="space-y-3">
             {demand.matches.slice(0, 3).map((match: any) => (
               <div key={match.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-zinc-800" />
                   <span className="text-[10px] font-bold text-white">{match.name || match.vendorName}</span>
                 </div>
                 <button className="text-[8px] font-black uppercase text-primary">View Match</button>
               </div>
             ))}
          </div>
        ) : (
          <p className="text-[10px] text-zinc-600 italic">No vendors matched this demand yet.</p>
        )}
      </div>

      <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-3">
        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Requirements</h4>
        <ul className="space-y-2.5">
          {['Compliance Documents Required', 'Sample Verification Needed', 'Bulk Packaging Capacity', 'Logistics Partnership'].map((req) => (
            <li key={req} className="flex items-center gap-2.5 text-[10px] text-zinc-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
              {req}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <UnifiedPostDetail 
      item={feedItem} 
      onBack={() => navigate(-1)}
      customFields={customFields}
      actionButtonLabel={`Submit Proposal (Budget: ${demand.budget} BDT)`}
      onAction={() => {
        toast.success("Bidding process started!");
      }}
    />
  );
}

