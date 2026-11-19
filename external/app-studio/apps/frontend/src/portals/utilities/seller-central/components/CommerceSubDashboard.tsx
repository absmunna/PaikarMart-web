import React, { useState } from 'react';
import { CommerceItem } from '@/types';
import { 
  ShoppingBag, 
  Plus, 
  Package, 
  Layers, 
  
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { InventoryProductCard, InventoryToolbar, ProductEditorModal, useSellerInventory } from '@/features/inventory';

export interface CommerceSubDashboardProps {
  products: CommerceItem[];
  storeId?: string;
  storeName?: string;
  onAddNewProduct: (newProduct: Omit<CommerceItem, 'id' | 'rating' | 'reviewsCount'>) => void;
  onCreatePromoPost: (product: CommerceItem) => void;
  onOpenQuickAttach?: () => void;
  editProductId?: string;
}

export const CommerceSubDashboard: React.FC<CommerceSubDashboardProps> = ({
  products,
  storeId = 'seller_store_pending',
  storeName = 'Verified Seller Store',
  onAddNewProduct,
  onCreatePromoPost,
  onOpenQuickAttach,
  editProductId
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const {
    commerceProducts,
    filteredProducts,
    searchQuery,
    setSearchQuery,
    inventoryFilter,
    setInventoryFilter,
  } = useSellerInventory(products);

  const editRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (editProductId && editRef.current) {
      editRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [editProductId]);

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--pm-card)] p-5 rounded-3xl border border-[var(--pm-border)] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] flex items-center justify-center font-black shadow-md shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[var(--pm-text)]">
              {isBn ? 'রিটেইল ও হোলসেল ক্যাটালগ ম্যানেজমেন্ট' : 'Commerce Product Catalog'}
            </h3>
            <p className="text-xs text-[var(--pm-muted)]">
              {isBn ? 'খুচরা এবং পাইকারি পণ্যের ইনভেন্টরি, দাম ও প্রমোশন পোস্ট তৈরি করুন' : 'Manage retail stock, wholesale discount tiers & publish promo feed posts'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {onOpenQuickAttach && (
            <button
              type="button"
              onClick={onOpenQuickAttach}
              className="px-4 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>{isBn ? '⚡ ক্যাটালগ থেকে যোগ করুন' : '⚡ 30s Quick Attach'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-card-hover)] text-[var(--pm-text)] border border-[var(--pm-border)] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isBn ? 'নতুন কাস্টম প্রোডাক্ট' : 'Custom Product'}</span>
          </button>
        </div>
      </div>

      <InventoryToolbar
        isBn={isBn}
        searchQuery={searchQuery}
        filter={inventoryFilter}
        visibleCount={filteredProducts.length}
        totalCount={commerceProducts.length}
        onSearchChange={setSearchQuery}
        onFilterChange={setInventoryFilter}
      />

      {/* Catalog Grid */}
      {filteredProducts.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredProducts.map((item) => (
          <div key={item.id} ref={item.id === editProductId ? editRef : null}>
            <InventoryProductCard
              item={item}
              isBn={isBn}
              isHighlighted={item.id === editProductId}
              onCreatePromoPost={onCreatePromoPost}
            />
          </div>
        ))}
      </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-[var(--pm-border)] bg-[var(--pm-card)] p-10 text-center">
          <Package className="w-8 h-8 mx-auto text-[var(--pm-muted)] mb-2" />
          <p className="text-sm font-bold text-[var(--pm-text)]">{isBn ? 'কোনো প্রোডাক্ট পাওয়া যায়নি' : 'No inventory items found'}</p>
          <p className="text-xs text-[var(--pm-muted)] mt-1">{isBn ? 'সার্চ বা স্টক ফিল্টার পরিবর্তন করুন।' : 'Adjust your search or stock filter.'}</p>
        </div>
      )}

      <ProductEditorModal
        isOpen={isAddModalOpen}
        isBn={isBn}
        storeId={storeId}
        storeName={storeName}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddNewProduct}
      />

    </div>
  );
};
