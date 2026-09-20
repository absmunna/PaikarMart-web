import { useListDemands, getListDemandsQueryKey } from "@/modules/app/api/client/hooks";
import { DemandCard } from "./DemandCard";

export function DemandRail() {
  const { data, isLoading } = useListDemands({}, { query: { queryKey: getListDemandsQueryKey() } });
  const items = (data ?? []).slice(0, 8);

  if (isLoading || items.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[300px] rounded-[28px] skeleton-shimmer bg-white/[0.03]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {items.map((d: any) => (
        <div key={d.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
           <DemandCard demand={d as any} />
        </div>
      ))}
    </div>
  );
}
