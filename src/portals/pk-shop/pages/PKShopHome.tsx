import React, { useMemo } from 'react';
import { ShoppingBag, Star, ShieldCheck, Coins } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../../modules/cart/cartStore';
import { useCartDrawerStore } from '../../../modules/cart/cartDrawerStore';
import { useProductStore } from '../../../modules/products/productStore';

export const PKShopHome = () => {
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartDrawerStore((state) => state.open);

  const { products: storeProductsRaw, fetchProducts, isLoading } = useProductStore();

  React.useEffect(() => {
    fetchProducts({ pkShop: true });
  }, []);
  
  const products = useMemo(() => 
    storeProductsRaw.filter(p => p.portal === 'pk-shop'), 
  [storeProductsRaw]);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image || 'https://via.placeholder.com/300',
      portal: 'pk-shop',
      coinCashback: product.coinCashback || Math.floor(Number(product.price) * 0.05)
    });
    openCart();
  };

  return (
    <div className="flex flex-col gap-6 px-4 pb-12">
      {/* Premium Hero Section */}
      <section className="relative h-[200px] rounded-[32px] overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-black flex items-center px-8 border border-white/10 shadow-2xl">
        <div className="relative z-10 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 bg-indigo-500/20 backdrop-blur-md w-fit px-3 py-1 rounded-full border border-indigo-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[9px] font-bold text-indigo-200 uppercase tracking-widest">Paikar Mart Exclusive</span>
          </div>
          <h1 className="text-3xl font-black text-white leading-none">PK <span className="text-indigo-400">Shop</span></h1>
          <p className="text-indigo-200/70 text-xs max-w-[240px]">Experience high-grade luxury & quality directly crafted by our elite partners.</p>
        </div>

        {/* Abstract Shapes for Premium Look */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-500/10 blur-[80px] rounded-full translate-x-1/2" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-[40px] rounded-full" />
      </section>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Quality Assured', icon: Star, desc: '100% Inspected' },
          { label: 'Fast Delivery', icon: ShoppingBag, desc: 'Same-day Shipping' },
          { label: 'Premium Brand', icon: ShieldCheck, desc: 'Authentic Label' }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl glass border border-[var(--pm-border)]/20 text-center">
            <item.icon className="w-5 h-5 text-[var(--pm-accent)]" />
            <span className="text-[10px] font-black text-[var(--pm-text)] leading-none">{item.label}</span>
            <span className="text-[8px] text-[var(--pm-text-muted)]">{item.desc}</span>
          </div>
        ))}
      </div>

      {/* Exclusive Product Catalog */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-base font-black text-[var(--pm-text)] uppercase tracking-wider">Exclusive Catalog</h3>
          <span className="text-[10px] text-[var(--pm-text-secondary)] font-bold">{products?.length || 0} Products</span>
        </div>

        {(!products || products.length === 0) ? (
          <div className="p-12 text-center bg-[var(--pm-surface)] rounded-3xl border border-dashed border-[var(--pm-border)]">
            <ShoppingBag className="w-12 h-12 text-[var(--pm-text-secondary)]/20 mx-auto mb-4" />
            <p className="text-[var(--pm-text-secondary)] text-sm">কোনো পণ্য পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -4 }}
                className="glass rounded-3xl border border-[var(--pm-border)]/30 overflow-hidden flex flex-col justify-between group shadow-lg"
              >
                {/* Product Image & Tag */}
                <div className="aspect-[4/3] w-full overflow-hidden relative bg-black/10">
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-indigo-900/80 backdrop-blur-md text-white text-[8px] font-black uppercase px-2 py-1 rounded-full border border-indigo-500/20 shadow-md">
                    {product.tag || 'Exclusive'}
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[var(--pm-text)] line-clamp-2 min-h-[32px] leading-tight">
                      {product.name}
                    </h4>

                    {/* Rating Mock */}
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                      <span className="text-[10px] font-bold text-[var(--pm-text)]">4.5</span>
                      <span className="text-[8px] text-[var(--pm-text-muted)]">(12)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {/* Price and Coin Cashback */}
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-[var(--pm-accent)]">৳ {Number(product.price)}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-[var(--pm-text-muted)] line-through">৳ {Number(product.originalPrice)}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 mt-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span className="text-[9px] font-black">+{Math.floor(Number(product.price) * 0.05)} Coins Reward</span>
                      </div>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-[var(--pm-accent)] text-white py-2 rounded-xl text-[10px] font-black shadow-lg shadow-[var(--pm-accent)]/15 active:scale-95 transition-all flex items-center justify-center gap-1.5 hover:opacity-90"
                    >
                      <ShoppingBag className="w-3 h-3" /> Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
