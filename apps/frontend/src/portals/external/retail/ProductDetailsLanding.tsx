import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Heart, Share2, AlertCircle } from 'lucide-react';
import { CommerceItem, User, Order } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProductDetailsSkeleton } from '@/design-system/components';

interface ProductDetailsLandingProps {
  currentUser: User;
  onUpdateUser: (user: User) => void;
  onOrderPlaced: (order: Order) => void;
  commerceItems: CommerceItem[];
  onOpenAuthModal?: (tab?: 'login' | 'register') => void;
}

export const ProductDetailsLanding: React.FC<ProductDetailsLandingProps> = ({
  currentUser,
  onUpdateUser,
  onOrderPlaced,
  commerceItems,
  onOpenAuthModal,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const product = commerceItems.find((item) => item.id === id) || commerceItems[0];

  if (!product) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-[var(--pm-muted)] mx-auto" />
        <h2 className="text-xl font-bold text-[var(--pm-text)]">Product Not Found</h2>
        <button onClick={() => navigate(-1)} className="text-[var(--pm-accent)] font-bold cursor-pointer">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-28 px-4 pt-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--pm-card)] border border-[var(--pm-border)] text-xs font-bold cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'ফিরে যান' : 'Back'}</span>
        </button>
        <span className="text-xs font-black uppercase text-[var(--pm-accent)]">{product.category}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[var(--pm-card)] p-6 rounded-3xl border border-[var(--pm-border)] shadow-md">
        <div className="aspect-square rounded-2xl overflow-hidden bg-[var(--pm-surface)]">
          <img src={product.imageUrl} alt={product.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
        </div>
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <h1 className="text-xl font-black text-[var(--pm-text)]">{product.title}</h1>
            <p className="text-2xl font-mono font-black text-[var(--pm-accent)]">৳{product.price.toLocaleString()}</p>
            <p className="text-xs text-[var(--pm-muted)] leading-relaxed">{product.description}</p>
          </div>
          <div className="pt-4 border-t border-[var(--pm-border)] flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                onOrderPlaced({
                  id: `ORD-${Date.now()}`,
                  createdAt: new Date().toISOString(),
                  items: [{ product, quantity: 1, isWholesale: false }],
                  subtotal: product.price,
                  deliveryFee: 60,
                  tax: Math.round(product.price * 0.05),
                  total: product.price + 60 + Math.round(product.price * 0.05),
                  status: 'confirmed',
                  deliveryAddress: currentUser.location || 'Dhaka',
                  paymentMethod: 'Cash on Delivery',
                  estimatedArrival: 'Same Day',
                  trackingStep: 1,
                  buyerName: currentUser.name,
                  buyerPhone: currentUser.phone || '',
                  storeId: product.storeId,
                  storeName: product.storeName,
                });
                navigate('/portal/orders');
              }}
              className="flex-1 py-3 rounded-xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] font-black text-xs uppercase tracking-wider cursor-pointer shadow-md"
            >
              {isBn ? 'এখনই অর্ডার করুন (COD)' : 'Buy Now (COD)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
