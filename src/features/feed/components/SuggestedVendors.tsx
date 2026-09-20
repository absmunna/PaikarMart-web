import { useGetSuggestedVendors, getGetSuggestedVendorsQueryKey } from "@/modules/app/api/client/hooks";
import { GlassCard } from "@/components/ui/GlassCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function SuggestedVendors() {
  const { data: vendors } = useGetSuggestedVendors({ query: { queryKey: getGetSuggestedVendorsQueryKey() } });

  if (!vendors?.length) return null;

  return (
    <GlassCard className="p-4">
      <h3 className="font-semibold text-white mb-4">Suggested Vendors</h3>
      <div className="flex flex-col gap-4">
        {vendors.map((vendor: any) => (
          <div key={vendor.id} className="flex items-center justify-between">
            <Link to={`/vendors/${vendor.id}`} className="flex items-center gap-3 overflow-hidden">
              <Avatar className="h-10 w-10 border border-white/10 shrink-0">
                <AvatarImage src={vendor.avatarUrl} />
                <AvatarFallback>{vendor.name[0]}</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <h4 className="text-sm font-medium text-white truncate">{vendor.name}</h4>
                <p className="text-xs text-white/50 truncate capitalize">{(vendor.type ?? '').replace('_', ' ')}</p>
              </div>
            </Link>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-white/5 border-white/10 text-white hover:bg-white/10 shrink-0">
              Follow
            </Button>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
