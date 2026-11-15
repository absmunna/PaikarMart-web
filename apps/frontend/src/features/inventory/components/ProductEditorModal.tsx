import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CommerceItem, TradeMode } from '@/types';

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
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !price) return;

    onSave({
      storeId,
      storeName,
      type: tradeMode,
      tradeMode,
      title: title.trim(),
      price: parseFloat(price),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
      description: description.trim() || 'High-quality verified commerce inventory product.',
      category,
      inStock: true,
      deliveryEta: '1-2 Days'
    });
    setTitle('');
    setPrice('');
    setImageUrl('');
    setDescription('');
    setTradeMode('retail');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <form onSubmit={handleSubmit} className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 sm:p-6 shadow-2xl space-y-4 animate-scaleUp">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]">
          <h3 className="text-base font-bold text-[var(--pm-text)]">{isBn ? 'নতুন প্রোডাক্ট যোগ করুন' : 'Add Commerce Item'}</h3>
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
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] focus:border-[var(--pm-accent)] focus:outline-none">
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion & Apparel</option>
                <option value="Food & Grocery">Food & Grocery</option>
                <option value="Home & Living">Home & Living</option>
              </select>
            </div>
          </div>

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
