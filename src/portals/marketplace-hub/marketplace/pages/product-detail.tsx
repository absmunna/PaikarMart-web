import React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { useGetProduct, getGetProductQueryKey } from "@/modules/app/api/client/hooks";
import { UnifiedPostDetail } from "@/components/common/UnifiedPostDetail";
import { mapProductToFeedItem } from "@/modules/social/utils/mappers";
import { 
  ShieldCheck, Clock, CheckCircle2, Calendar, 
  ArrowDownCircle, FileText, MessageSquare 
} from "lucide-react";
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useGetProduct(id ?? '', { 
    query: { 
      queryKey: getGetProductQueryKey(id ?? ''), 
      enabled: !!id 
    } 
  });

  if (isLoading) return <div className="p-8 text-center text-zinc-500 font-black animate-pulse">Loading Product...</div>;
  if (!product) return <div className="p-8 text-center text-zinc-500 font-black">Product Not Found</div>;

  const feedItem = mapProductToFeedItem(product);
  
  const isService = product.type === "service" || product.portal === "services";
  const isDigital = product.type === "digital" || product.portal === "digital";

  const customFields = (
    <div className="space-y-4">
      {isService ? (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Duration</span>
              </div>
              <p className="text-xs font-black text-white">{product.metadata?.duration || '2-4 Hours'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400">
                <Calendar className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Availability</span>
              </div>
              <p className="text-xs font-black text-white">{product.metadata?.availability || 'Next Day'}</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 space-y-3">
             <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Service Includes</h4>
             <ul className="space-y-2">
                {['Verified Expert', 'On-site Support', 'Service Warranty'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-[10px] text-zinc-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> {f}
                  </li>
                ))}
             </ul>
          </div>
        </>
      ) : (
        <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/5 space-y-4">
           <div className="flex items-center gap-3">
             <ShieldCheck className="w-5 h-5 text-cyan-400" />
             <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Trust Guarantee</h4>
               <p className="text-[10px] text-zinc-500 font-medium">100% Authentic & QC Checked</p>
             </div>
           </div>
           
           <div className="pt-4 border-t border-white/[0.04] grid grid-cols-2 gap-4">
              <div className="space-y-1">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Category</span>
                 <p className="text-[10px] font-black text-white uppercase tracking-tighter">{product.category}</p>
              </div>
              <div className="space-y-1">
                 <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Return Policy</span>
                 <p className="text-[10px] font-black text-white uppercase tracking-tighter">7 Days Exchange</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );

  const actionLabel = isService ? "Book Appointment" : isDigital ? "Instant Download" : "Add to Cart";

  return (
    <UnifiedPostDetail 
      item={feedItem} 
      onBack={() => navigate(-1)}
      customFields={customFields}
      actionButtonLabel={actionLabel}
      onAction={() => {
        if (isService) {
           toast.success("Consulting service provider...");
           return;
        }
        if (isDigital) {
           toast.success("Download started!");
           return;
        }
        toast.success(`${product.title} added to cart!`);
      }}
    />
  );
}
