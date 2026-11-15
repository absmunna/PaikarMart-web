import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CommerceItem, ProductVariantOption, TradeMode } from '@/types';

const CATEGORY_VARIANT_PRESETS: Record<string, ProductVariantOption[]> = {
  Electronics: [
    { id: 'storage', label: 'Storage', values: ['128 GB', '256 GB', '512 GB'] },
    { id: 'color', label: 'Color', values: ['Black', 'White', 'Blue'] },
  ],
  'Fashion & Apparel': [
    { id: 'size', label: 'Size', values: ['S', 'M', 'L', 'XL'] },
    { id: 'color', label: 'Color', values: ['Black', 'White', 'Navy'] },
  ],
  'Food & Grocery': [
    { id: 'pack', label: 'Pack size', values: ['1 pack', '2 pack', '5 pack'] },
  ],
  'Home & Living': [
    { id: 'size', label: 'Size', values: ['Small', 'Medium', 'Large'] },
    { id: 'color', label: 'Color', values: ['Black', 'White', 'Natural'] },
  ],
};

interface ProductEditorModalProps {
  isOpen: boolean;
  isBn: boolean;
  storeId: string;
  storeName: string;
  onClose: () => void;
  onSave: (product: Omit<CommerceItem, 'id' | 'rating' | 'reviewsCount'>) => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({ isOpen, isBn, storeId, storeName, onClose, onSave }) => {
  const [tradeMode, setTradeMode] = useState<TradeMode>('retail');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [stockQuantity, setStockQuantity] = useState('1');
  const [sku, setSku] = useState('');
  const [variantOptions, setVariantOptions] = useState<ProductVariantOption[]>(CATEGORY_VARIANT_PRESETS.Electronics);
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !price) return;
    const numericPrice = parseFloat(price);
    const numericStock = Math.max(0, parseInt(stockQuantity || '0', 10));
    const defaultVariantKey = variantOptions.map((option) => option.values[0]).join(' · ');

    onSave({
      storeId,
      storeName,
      type: tradeMode,
      tradeMode,
      title: title.trim(),
      price: numericPrice,
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      description: description.trim() || 'High-quality verified commerce inventory product.',
      category,
      inStock: numericStock > 0,
      deliveryEta: '1-2 Days',
      variantOptions,
      variantOffers: variantOptions.length > 0 ? [{
        key: defaultVariantKey,
        label: defaultVariantKey,
        sku: sku.trim() || undefined,
        price: numericPrice,
        stockQuantity: numericStock,
      }] : [],
    });
    setTitle('');
    setPrice('');
    setImageUrl('');
    setDescription('');
    setStockQuantity('1');
    setSku('');
    setTradeMode('retail');
    setVariantOptions(CATEGORY_VARIANT_PRESETS.Electronics);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <form role="dialog" aria-modal="true" aria-labelledby="inventory-editor-title" onSubmit={handleSubmit} className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]">
          <h3 id="inventory-editor-title" className="text-base font-bold text-[var(--pm-text)]">{isBn ? 'নতুন প্রোডাক্ট যোগ করুন' : 'Add Commerce Item'}</h3>
          <button type="button" onClick={onClose} className="text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer" aria-label={isBn ? 'বন্ধ করুন' : 'Close'}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-[var(--pm-text)] block mb-1">Trade Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {(['retail', 'wholesale'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setTradeMode(mode)}
                  className={`py-2 rounded-xl font-bold border transition-colors ${tradeMode === mode ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] border-[var(--pm-accent)]' : 'bg-[var(--pm-surface)] border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-text)]'}`}
                >
                  {mode === 'retail' ? 'Retail (খুচরা)' : 'Wholesale (পাইকারি)'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-[var(--pm-text)] block mb-1">Product Title</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Wireless Bluetooth Earbuds 5.3" className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] focus:outline-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[var(--pm-text)] block mb-1">Price (BDT ৳)</label>
              <input type="number" step="1" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1250" className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] focus:outline-none font-mono tabular-nums" />
            </div>
            <div>
              <label className="font-bold text-[var(--pm-text)] block mb-1">Category</label>
              <select value={category} onChange={(e) => { const next = e.target.value; setCategory(next); setVariantOptions(CATEGORY_VARIANT_PRESETS[next] || []); }} className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:outline-none">
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Food & Grocery">Food & Grocery</option>
                <option value="Home & Living">Home & Living</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-[var(--pm-text)] block mb-1">Opening Stock</label>
              <input type="number" min="0" step="1" required value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:outline-none font-mono tabular-nums" />
            </div>
            <div>
              <label className="font-bold text-[var(--pm-text)] block mb-1">SKU (Optional)</label>
              <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. SKU-001" className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] focus:outline-none font-mono" />
            </div>
          </div>

          {variantOptions.length > 0 && (
            <div className="rounded-xl border border-[var(--pm-border)] bg-[var(--pm-surface)] p-3 space-y-2">
              <div>
                <p className="font-bold text-[var(--pm-text)]">Category variants</p>
                <p className="text-[10px] text-[var(--pm-muted)]">These presets will be available on the product details page.</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {variantOptions.map((option) => <span key={option.id} className="rounded-lg border border-[var(--pm-accent-border)] bg-[var(--pm-accent-soft)] px-2 py-1 text-[10px] font-bold text-[var(--pm-accent)]">{option.label}: {option.values.join(', ')}</span>)}
              </div>
            </div>
          )}

          <div>
            <label className="font-bold text-[var(--pm-text)] block mb-1">Image URL</label>
            <input type="url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] focus:outline-none" />
          </div>

          <div>
            <label className="font-bold text-[var(--pm-text)] block mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Short product details" className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:border-[var(--pm-accent)] focus:outline-none resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-[var(--pm-border)]">
          <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-muted)] font-bold text-xs cursor-pointer">{isBn ? 'বাতিল' : 'Cancel'}</button>
          <button type="submit" className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs shadow-md cursor-pointer">{isBn ? 'সেভ করুন' : 'Save Product'}</button>
        </div>
      </form>
    </div>
  );
};
