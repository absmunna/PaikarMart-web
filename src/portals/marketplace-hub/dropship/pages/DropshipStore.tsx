import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, 
  Share2, Heart, Info, CheckCircle2, ChevronRight, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for a specific dropship store
const MOCK_STORES = {
  'pm-smart-deals': {
    id: 'pm-smart-deals',
    name: 'Smart Deals BD',
    subtitle: 'পেইকার মার্টের সরাসরি আমদানিকৃত সেরা বিদেশি কালেকশন',
    theme: {
      primary: '#ff6b00',
      bg: 'bg-gradient-to-tr from-amber-500 to-orange-600',
    },
    banner: {
      img: 'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=1000&h=400&fit=crop',
      title: 'Next-Gen Smart Gadgets',
      desc: 'স্মার্ট লাইফ সহজ করার সর্বাধুনিক বিদেশি প্রযুক্তি।'
    },
    products: [
      {
        id: 'int-p1',
        name: 'Wireless Smart Bluetooth Earbuds (Active Noise Cancel)',
        price: 2800,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
        rating: 4.8,
        reviews: 124,
        sourceCountry: 'চীন',
        shippingDays: '৭-১২ দিন',
        isBestSeller: true
      },
      {
        id: 'int-p2',
        name: 'Premium Ceramic Water Dripper Coffee Set',
        price: 1950,
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop',
        rating: 4.6,
        reviews: 56,
        sourceCountry: 'তুরস্ক',
        shippingDays: '১০-১৫ দিন'
      },
      {
        id: 'int-p3',
        name: 'Sartorial Silk Traditional Dupatta Set',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop',
        rating: 4.9,
        reviews: 89,
        sourceCountry: 'ভারত',
        shippingDays: '৪-৮ দিন'
      },
      {
        id: 'int-p4',
        name: 'Ergonomic Memory Foam Sleep Pillow',
        price: 2400,
        image: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&h=400&fit=crop',
        rating: 4.5,
        reviews: 34,
        sourceCountry: 'ভিয়েতনাম',
        shippingDays: '৮-১২ দিন'
      }
    ]
  }
};

export default function DropshipStore() {
  const { id } = useParams();
  const navigate = useNavigate();
  // Using the mock store or the first one if ID doesn't match
  const store = MOCK_STORES['pm-smart-deals']; // In a real app, fetch by ID
  const [cartCount, setCartCount] = useState(0);

  const handleBuyNow = (product: any) => {
    // In a real app, this would go to checkout or add to cart
    alert(`অর্ডার প্রসেস হচ্ছে: ${product.name}`);
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-20">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground/80" />
          </button>
          <span className="font-black text-lg tracking-tight text-foreground">{store.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-muted rounded-full relative">
            <ShoppingCart className="w-5 h-5 text-foreground/80" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button className="p-2 hover:bg-muted rounded-full">
            <Share2 className="w-5 h-5 text-foreground/80" />
          </button>
        </div>
      </nav>

      {/* Hero Banner Section */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img 
          referrerPolicy="no-referrer"
          src={store.banner.img} 
          alt="Hero" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold uppercase tracking-widest mb-3">
              Elite Global Sourcing
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight">
              {store.banner.title}
            </h1>
            <p className="text-white/80 text-sm md:text-base font-medium max-w-lg mx-auto">
              {store.subtitle}
            </p>
            <Button 
              className="mt-6 rounded-full px-8 h-12 text-sm font-bold shadow-xl"
              style={{ backgroundColor: store.theme.primary }}
            >
              কালেকশন দেখুন <ChevronRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-background border-y border-border py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="w-6 h-6 text-cyan-600 mb-2" />
            <span className="text-[11px] font-bold text-foreground/90">১০০% অথেনটিক</span>
          </div>
          <div className="flex flex-col items-center text-center border-l border-border">
            <Globe className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-[11px] font-bold text-foreground/90">গ্লোবাল সোর্সিং</span>
          </div>
          <div className="flex flex-col items-center text-center md:border-l border-border border-t md:border-t-0 pt-4 md:pt-0">
            <Truck className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-[11px] font-bold text-foreground/90">দ্রুত কাস্টমস ক্লিয়ারেন্স</span>
          </div>
          <div className="flex flex-col items-center text-center border-l border-border border-t md:border-t-0 pt-4 md:pt-0">
            <CheckCircle2 className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-[11px] font-bold text-foreground/90">সেফ পেমেন্ট</span>
          </div>
        </div>
      </section>

      {/* Product List */}
      <main className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-black text-foreground tracking-tight">সরাসরি আমদানিকৃত পণ্যসমূহ</h2>
            <p className="text-xs text-muted-foreground font-medium">নিশ্চিত পেমেন্ট ও ডাইরেক্ট ডেলিভারি গ্যারান্টি</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full text-[10px] font-bold px-4 h-8">ফিল্টার</Button>
          </div>
        </div>

        <div className="product-sink-grid">
          {store.products.map((product, i) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-background rounded-3xl overflow-hidden border border-border hover:shadow-2xl hover:shadow-orange-100 transition-all group"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img 
                  referrerPolicy="no-referrer"
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-md rounded-full shadow-sm hover:bg-background transition-colors">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                </button>
                {product.isBestSeller && (
                  <span className="absolute top-4 left-4 bg-orange-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                    Best Seller
                  </span>
                )}
                <div className="absolute bottom-4 left-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-300">
                  <Button 
                    className="w-full rounded-2xl h-10 text-[10px] font-black shadow-lg"
                    style={{ backgroundColor: store.theme.primary }}
                    onClick={() => handleBuyNow(product)}
                  >
                    ১-ক্লিক অর্ডার
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-1 mb-1.5">
                  <span className="text-[9px] font-bold text-muted-foreground/70">উৎস: {product.sourceCountry}</span>
                  <span className="text-[9px] font-bold text-muted-foreground/70">•</span>
                  <span className="text-[9px] font-bold text-cyan-600">শিপিং: {product.shippingDays}</span>
                </div>
                <h3 className="font-bold text-sm text-foreground line-clamp-2 mb-2 leading-tight">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground line-through">৳{(product.price * 1.2).toLocaleString()}</span>
                    <span className="text-base font-black text-orange-600 leading-none">৳{product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-[10px] font-bold text-foreground/80">{product.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Social proof banner */}
      <section className="bg-orange-50/50 py-12 px-4 text-center">
        <h3 className="text-lg font-black text-foreground mb-2">বিশ্বস্ত ড্রপশিপিং নেটওয়ার্ক</h3>
        <p className="text-xs text-muted-foreground/90 max-w-sm mx-auto mb-6">আমরা সরাসরি আমদানিকারকদের সাথে কাজ করি যাতে আপনি পান সেরা কোয়ালিটি ও মূল্য।</p>
        <div className="flex justify-center -space-x-3 mb-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-muted">
              <img referrerPolicy="no-referrer" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
            </div>
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-white bg-orange-600 flex items-center justify-center text-[10px] font-bold text-white">
            +5k
          </div>
        </div>
        <p className="text-[10px] font-bold text-muted-foreground">৫০০০+ কাস্টমার আমাদের ডিল পছন্দ করেছেন!</p>
      </section>

      {/* Footer Branding */}
      <footer className="py-10 px-4 text-center border-t border-border">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-black text-foreground tracking-tighter">PAIKAR MART</span>
        </div>
        <p className="text-[10px] text-muted-foreground/70 px-8">
          Powered by Paikar Mart Dropshipping Core. All rights reserved &copy; 2026.
        </p>
      </footer>
    </div>
  );
}
