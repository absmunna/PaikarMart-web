import { useListDemands, getListDemandsQueryKey } from "@/modules/app";
import { UnifiedPostCard, UnifiedPost } from "@/design-system/components/feed/UnifiedPostCard";

export function DemandRail() {
  const { data, isLoading } = useListDemands({}, { query: { queryKey: getListDemandsQueryKey() } });
  const items = (data ?? []).slice(0, 8);

  if (isLoading || items.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[300px] rounded-[28px] skeleton-shimmer bg-white/[0.03]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((d: any) => {
        const post: UnifiedPost = {
          id: d.id,
          type: 'demand',
          authorName: 'Demand User', // Demands might not have author info in this hook
          authorAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${d.id}`,
          isVerified: false,
          authorRole: 'Buyer',
          timestamp: d.postedAt || 'Recently',
          content: d.description || d.title,
          location: d.location,
          likes: 0,
          comments: 0,
          metadata: {
             urgency: (d as any).urgency || 'Normal'
          }
        };
        return (
          <div key={d.id} className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <UnifiedPostCard post={post} />
          </div>
        );
      })}
    </div>
  );
}
