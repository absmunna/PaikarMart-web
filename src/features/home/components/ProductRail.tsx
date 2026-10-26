import { Link } from "react-router-dom";
import { useListProducts, getListProductsQueryKey } from "@/modules/app/api/client/hooks";

export function ProductRail({ sort = "trending" as const }: { sort?: "trending" | "newest" }) {
  const { data } = useListProducts(
    { sort } as any,
    { query: { queryKey: getListProductsQueryKey({ sort } as any) } },
  );
  const items = Array.isArray(data) ? data.slice(0, 12) : [];

  if (items.length === 0) {
    return (
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="shrink-0 w-40 sm:w-44">
            <div className="w-full aspect-square rounded-xl skeleton-shimmer" />
            <div className="mt-2 h-3 w-3/4 rounded skeleton-shimmer" />
            <div className="mt-1 h-3 w-1/2 rounded skeleton-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
      {items.map((p) => (
        <Link key={p.id} to={`/marketplace/product/${p.id}`}>
          <div className="shrink-0 w-40 sm:w-44 group cursor-pointer">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5">
              {p.images?.[0] ? (
                <img
                  src={p.images[0]}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full skeleton-shimmer" />
              )}
              {(p as any).discount && (p as any).discount > 0 ? (
                <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500 text-white">
                  -{(p as any).discount}%
                </span>
              ) : null}
            </div>
            <div className="mt-2 text-[13px] text-white truncate font-medium">{p.title}</div>
            <div className="text-primary text-sm font-bold">৳{Number(p.price ?? 0).toFixed(0)}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
