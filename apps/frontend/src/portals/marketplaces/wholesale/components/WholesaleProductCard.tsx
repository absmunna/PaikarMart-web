import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  ShieldCheck, 
  FileText, 
  PackageCheck, 
  ShoppingCart, 
  Plus, 
  Minus,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { CommerceItem } from '@/types';
import { BulkTierPricingTable } from '@/features/b2b';

interface WholesaleProductCardProps {
  product: CommerceItem;
  onAddToCart: (item: CommerceItem, quantity: number, isWholesale: boolean) => void;
  onRequestRFQ: (item: CommerceItem) => void;
  onRequestSample: (item: CommerceItem) => void;
}

export const WholesaleProductCard: React.FC<WholesaleProductCardProps> = ({
  product,
  onAddToCart,
  onRequestRFQ,
  onRequestSample,
}) => {
  const moq = product.minWholesaleQty || 20;
  const [quantity, setQuantity] = useState(moq);
  const [showTiers, setShowTiers] = useState(false);

  // Calculate current unit price based on tiered pricing or default discount
  const currentUnitPrice = React.useMemo(() => {
    if (product.wholesaleTiers && product.wholesaleTiers.length > 0) {
      // Find highest tier matching current quantity
      const matchedTier = [...product.wholesaleTiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(t => quantity >= t.minQty);
      if (matchedTier) return matchedTier.pricePerUnit;
    }
    // Fallback: 10% volume discount at MOQ, 20% at 2x MOQ, 30% at 5x MOQ
    if (quantity >= moq * 5) return Math.round(product.price * 0.7);
    if (quantity >= moq * 2) return Math.round(product.price * 0.8);
    return Math.round(product.price * 0.9);
  }, [product, quantity, moq]);

  const totalLotPrice = currentUnitPrice * quantity;

  const handleIncrement = () => {
    setQuantity(prev => prev + 10);
  };

  const handleDecrement = () => {
    setQuantity(prev => Math.max(moq, prev - 10));
  };

  const handleAdd = () => {
    onAddToCart(product, quantity, true);
  };

  return (
    <div className="bg-[var(--pm-card)] rounded-2xl border border-[var(--pm-border)] hover:border-[var(--pm-border-strong)] transition-all flex flex-col overflow-hidden shadow-xs hover:shadow-md">
      {/* Product Image & Supplier Header */}
      <div className="relative aspect-4/3 bg-[var(--pm-surface)] overflow-hidden group">
        <img
          src={product.imageUrl}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600';
          }}
        />

        {/* B2B Trust Bar Overlay */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-medium text-white shadow-xs">
            <Building2 className="w-3 h-3 text-emerald-400" />
            <span className="truncate max-w-[120px]">{product.storeName}</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-[var(--pm-success)] text-[11px] font-bold text-white shadow-xs font-mono tabular-nums">
            MOQ: {moq} pcs
          </div>
        </div>

        {/* Quick Sample Action */}
        <button
          onClick={() => onRequestSample(product)}
          className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg pm-glass text-[11px] font-semibold text-[var(--pm-text)] border border-[var(--pm-border)] shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
        >
          <PackageCheck className="w-3 h-3 text-[var(--pm-accent)]" />
          Sample Unit
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Metadata: Unboxed Text with Separators (Anti-Slop Rule) */}
          <div className="flex items-center gap-2 text-[11px] text-[var(--pm-muted)] mb-1">
            <span className="font-medium text-[var(--pm-text)]">
              {product.subCategory?.toUpperCase() || 'FACTORY DIRECT'}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3 text-[var(--pm-muted)]" />
              {product.deliveryEta}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-[var(--pm-success)] font-medium">
              <ShieldCheck className="w-3 h-3" />
              Verified Mill
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-[var(--pm-text)] line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-[var(--pm-muted)] line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & MOQ Matrix */}
        <div className="pt-2 border-t border-[var(--pm-border)] space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[11px] text-[var(--pm-muted)] block">Wholesale Rate</span>
              <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
                <span className="text-base font-bold text-[var(--pm-text)]">
                  ৳{currentUnitPrice}
                </span>
                <span className="text-[11px] text-[var(--pm-muted)]">/ unit</span>
                {product.originalPrice && (
                  <span className="text-xs text-[var(--pm-muted)] line-through ml-1">
                    ৳{product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowTiers(!showTiers)}
              className="text-[11px] font-medium text-[var(--pm-success)] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <Layers className="w-3 h-3" />
              {showTiers ? 'Hide Slabs' : 'Price Slabs'}
              {showTiers ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Collapsible Volume Pricing Slabs */}
          {showTiers && (
            <div className="animate-fade-in pt-1">
              <BulkTierPricingTable
                basePrice={product.price}
                tiers={product.wholesaleTiers}
                selectedQuantity={quantity}
                minWholesaleQty={moq}
                onSelectTier={(qty) => setQuantity(qty)}
              />
            </div>
          )}

          {/* Quantity Selector & Order Subtotal */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity <= moq}
                className="w-6 h-6 rounded-md bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] disabled:opacity-40 transition-colors cursor-pointer"
                title="Decrease quantity by 10"
              >
                <Minus className="w-3 h-3" />
              </button>

              <span className="px-2 text-xs font-bold text-[var(--pm-text)] font-mono tabular-nums">
                {quantity} pcs
              </span>

              <button
                type="button"
                onClick={handleIncrement}
                className="w-6 h-6 rounded-md bg-[var(--pm-card)] border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-text)] hover:bg-[var(--pm-card-hover)] transition-colors cursor-pointer"
                title="Increase quantity by 10"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-[var(--pm-muted)] block">Lot Total</span>
              <span className="text-xs font-bold text-[var(--pm-text)] font-mono tabular-nums">
                ৳{totalLotPrice.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Dual Primary Actions: Bulk Add & RFQ */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => onRequestRFQ(product)}
              className="px-3 py-2 rounded-xl border border-[var(--pm-border)] hover:border-[var(--pm-success)] text-[var(--pm-text)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[var(--pm-success)]" />
              Get Quote
            </button>

            <button
              type="button"
              onClick={handleAdd}
              className="px-3 py-2 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Bulk Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
