import React, { useState } from 'react';
import { Image, Tag, Smile, Send, X, ShoppingBag } from 'lucide-react';
import { User, CommerceItem, TaggedProduct, PostType } from '@/types';

interface PostComposerProps {
  currentUser: User;
  commerceItems: CommerceItem[];
  onCreatePost: (content: string, taggedProduct?: TaggedProduct, mediaUrl?: string, postType?: PostType) => void;
}

export const PostComposer: React.FC<PostComposerProps> = ({
  currentUser,
  commerceItems,
  onCreatePost,
}) => {
  const [content, setContent] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<CommerceItem | null>(null);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [postType, setPostType] = useState<PostType>('regular');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !selectedProduct && !mediaPreview) return;

    let tagged: TaggedProduct | undefined = undefined;
    if (selectedProduct) {
      tagged = {
        id: selectedProduct.id,
        title: selectedProduct.title,
        price: selectedProduct.price,
        image: selectedProduct.imageUrl,
        category: selectedProduct.category,
        storeName: selectedProduct.storeName,
        type: selectedProduct.type
      };
    }

    onCreatePost(content, tagged, mediaPreview || (selectedProduct ? selectedProduct.imageUrl : undefined), postType);
    setContent('');
    setSelectedProduct(null);
    setShowProductPicker(false);
    setMediaPreview(null);
    setPostType('regular');
  };

  return (
    <div className={`bg-[var(--pm-card)] text-[var(--pm-text)] border transition-all rounded-3xl p-4 sm:p-5 shadow-sm premium-shadow ${
      postType === 'demand' ? 'border-orange-500/40 ring-1 ring-orange-500/10' : 
      postType === 'sale' ? 'border-[var(--pm-success)]/40 ring-1 ring-[var(--pm-success)]/10' : 
      'border-[var(--pm-border)]'
    }`}>
      
      {/* Top Input Row */}
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="relative shrink-0">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-[var(--pm-border)] shadow-sm"
          />
          <div className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 bg-[var(--pm-success)] border-2 border-[var(--pm-card)] rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              postType === 'demand' ? "What are you looking for? (Quantity, Budget, Location...)" :
              postType === 'sale' ? "What are you selling? (Price, Condition, Specs...)" :
              `What's on your mind, ${currentUser.name.split(' ')[0]}?`
            }
            rows={2}
            className="w-full bg-[var(--pm-surface)] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-[15px] font-medium text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] resize-none focus:border-[var(--pm-accent)] focus:ring-2 focus:ring-[var(--pm-accent)]/15 focus:bg-[var(--pm-input)] transition-all outline-none"
          />
        </div>
      </div>

      {/* Media & Tagged Previews */}
      {(selectedProduct || mediaPreview) && (
        <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {selectedProduct && (
            <div className="relative shrink-0 w-48 p-2.5 rounded-[1.25rem] bg-[var(--pm-accent-soft)] border border-[var(--pm-accent-border)] flex items-center gap-3 group">
              <img
                src={selectedProduct.imageUrl}
                alt={selectedProduct.title}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-xl object-cover shrink-0 bg-[var(--pm-card)]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-black text-[var(--pm-text)] truncate">{selectedProduct.title}</p>
                <p className="text-[10px] font-mono font-bold text-[var(--pm-accent)]">৳{selectedProduct.price.toLocaleString()}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[var(--pm-card)] border border-[var(--pm-border)] text-[var(--pm-muted)] hover:text-[var(--pm-danger)] flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {mediaPreview && (
            <div className="relative shrink-0 w-32 aspect-square rounded-[1.25rem] overflow-hidden group">
              <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setMediaPreview(null)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-red-500 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Product Tagging Dropdown Modal (Simplified) */}
      {showProductPicker && (
        <div className="mt-4 p-4 rounded-2xl border border-[var(--pm-border)] bg-[var(--pm-surface)] animate-scale-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-widest text-[var(--pm-muted)] flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              Tag Product or Service
            </span>
            <button
              onClick={() => setShowProductPicker(false)}
              className="text-[11px] font-black uppercase tracking-widest text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {commerceItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedProduct(item);
                  setShowProductPicker(false);
                }}
                className="flex items-center gap-3 p-2 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] hover:border-[var(--pm-accent)] hover:shadow-sm transition-all text-left cursor-pointer"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-[var(--pm-text)] truncate">{item.title}</p>
                  <p className="text-[10px] font-mono text-[var(--pm-accent)] font-bold">৳{item.price.toLocaleString()}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="mt-4 pt-4 border-t border-[var(--pm-border)] flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
          <div className="flex items-center p-1 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)]">
            {(['regular', 'demand', 'sale'] as PostType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPostType(type)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all cursor-pointer ${
                  postType === type 
                    ? (type === 'demand' ? 'bg-orange-600 text-white shadow-sm' : type === 'sale' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-sm')
                    : 'text-[var(--pm-muted)] hover:text-[var(--pm-text)]'
                }`}
              >
                {type === 'regular' ? 'Post' : type === 'demand' ? 'Buy' : 'Sell'}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-[var(--pm-border)] mx-1 sm:mx-2" />

          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setShowProductPicker(!showProductPicker)}
              className={`p-2 sm:p-2.5 rounded-full transition-all active-scale cursor-pointer ${selectedProduct ? 'bg-[var(--pm-accent-soft)] text-[var(--pm-accent)]' : 'text-[var(--pm-muted)] hover:bg-[var(--pm-surface)] hover:text-[var(--pm-text)]'}`}
              title="Tag Product"
            >
              <Tag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
            <button
              type="button"
              onClick={() => setMediaPreview(mediaPreview ? null : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')}
              className={`p-2 sm:p-2.5 rounded-full transition-all active-scale cursor-pointer ${mediaPreview ? 'bg-[var(--pm-success-soft)] text-[var(--pm-success)]' : 'text-[var(--pm-muted)] hover:bg-[var(--pm-surface)] hover:text-[var(--pm-text)]'}`}
              title="Add Photo"
            >
              <Image className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
            <button
              type="button"
              className="p-2 sm:p-2.5 rounded-full text-[var(--pm-muted)] hover:bg-[var(--pm-surface)] hover:text-[var(--pm-text)] transition-all active-scale cursor-pointer"
              title="Add Feeling"
            >
              <Smile className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!content.trim() && !selectedProduct && !mediaPreview}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-full bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-30 text-[var(--pm-accent-fg)] text-xs sm:text-[13px] font-black uppercase tracking-wider transition-all active-scale shadow-lg cursor-pointer shrink-0 ml-auto sm:ml-0"
        >
          <span>Share</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
