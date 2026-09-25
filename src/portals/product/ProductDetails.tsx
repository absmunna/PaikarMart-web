import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  Star, ShieldCheck, Truck, Store as StoreIcon, CheckCircle2, 
  Heart, Share2, Plus, Minus, ShoppingCart, ArrowLeft,
  Package, Sparkles, MessageSquare, Clock, Check
} from "lucide-react";
import { useState, useMemo } from "react";
import { ProductReviews } from "../../components/reviews/ProductReviews";
import { useCartStore } from "../../modules/cart/store/useCartStore";
import { toast } from "sonner";
import { mockProducts } from "@/lib/workspace-stub";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("Medium");
  const [selectedColor, setSelectedColor] = useState("Black");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const matched = useMemo(() => {
    return mockProducts.find((p) => p.id === id || String(p.id) === String(id));
  }, [id]);

  // Dynamic product data with fallback
  const product = {
    id: id || "prod-101",
    title: matched?.title || matched?.name || "Premium Combed Cotton Crewneck T-Shirt (Export Quality)",
    description: matched?.description || "Experience breathable comfort with 100% combed ringspun cotton fabric (180 GSM). Specially crafted for Bangladesh's subtropical climate with reactive dye, anti-pilling wash, and double-stitched reinforced collar. Ideal for both daily retail wear and wholesale bulk re-branding.",
    price: matched?.price || 450,
    originalPrice: matched?.compareAtPrice || matched?.originalPrice || Math.round((matched?.price || 450) * 1.35),
    wholesalePrice: matched?.moq ? Math.round((matched.price) * 0.65) : 220,
    moq: matched?.moq || 50,
    isWholesaleAvailable: Boolean(matched?.moq || matched?.type === 'wholesale'),
    rating: matched?.rating || 4.8,
    reviews: matched?.reviewCount || 124,
    sold: 1542,
    images: matched?.images && matched.images.length > 0 
      ? matched.images 
      : [
          matched?.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800",
          "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
          "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"
        ],
    variants: ["Small (38)", "Medium (40)", "Large (42)", "XL (44)", "XXL (46)"],
    colors: ["Black", "Navy Blue", "Heather Grey", "Olive Green"],
    seller: {
      id: matched?.sellerId || matched?.vendor?.id || "store-1",
      name: matched?.vendorName || matched?.vendor?.name || matched?.seller || "Dhaka Garments Syndicate",
      rating: 4.9,
      verified: true,
      joinDate: "2021",
      location: matched?.location || "Keraniganj Wholesale Complex, Dhaka",
      responseRate: "98%"
    }
  };

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: `${product.title} (${selectedSize}, ${selectedColor})`,
      price: product.price,
      image: product.images[0],
      store: product.seller.name,
      sellerId: product.seller.id,
      quantity: quantity
    });
    toast.success(`যোগ করা হয়েছে: ${quantity}x ${product.title}`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  return (
    <div className="px-4 py-6 md:px-6 md:py-8 max-w-7xl mx-auto min-h-screen text-white pb-32">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> আগের পৃষ্ঠায় ফিরুন
      </button>

      {/* Main Product Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-[#141624] p-5 md:p-8 rounded-3xl border border-white/5 shadow-2xl">
        
        {/* Left: Product Images */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 relative group">
            <img 
              src={product.images[activeImageIndex]} 
              alt={product.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
            {product.isWholesaleAvailable && (
              <span className="absolute top-4 left-4 bg-[#FF7A00] text-white px-3 py-1 rounded-full text-xs font-black shadow-lg uppercase tracking-wider">
                Wholesale Lot Available (MOQ: {product.moq} pcs)
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIndex(i)}
                className={`aspect-square w-20 rounded-xl bg-black/40 border-2 overflow-hidden shrink-0 transition-all ${
                  activeImageIndex === i ? "border-[#FF7A00] scale-95 shadow-md" : "border-white/10 hover:border-white/30"
                }`}
              >
                <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details & Controls */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                In Stock & Ready to Ship
              </span>
              <span className="text-[10px] font-bold text-zinc-400">
                SKU: PK-TEE-{product.id.slice(0, 5)}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white leading-tight">
              {product.title}
            </h1>
            
            <div className="mt-3 flex items-center gap-4 flex-wrap text-sm">
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  <Star className="h-4 w-4 fill-amber-400" />
                </div>
                <span className="font-bold text-white">{product.rating}</span>
                <span className="text-zinc-400">({product.reviews} রিভিউ)</span>
              </div>
              <span className="text-zinc-700">•</span>
              <span className="text-zinc-400">{product.sold} বিক্রি হয়েছে</span>
            </div>

            {/* Price section */}
            <div className="mt-5 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-black text-[#FF7A00]">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-zinc-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% ছাড়
                </span>
              </div>

              {product.isWholesaleAvailable && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">
                    পাইকারি দর ({product.moq}+ পিস):
                  </span>
                  <span className="text-base font-black text-amber-400">
                    ৳{product.wholesalePrice} / পিস
                  </span>
                </div>
              )}
            </div>

            {/* Size & Color selection */}
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">সাইজ নির্বাচন করুন:</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((variant) => (
                    <button 
                      key={variant} 
                      onClick={() => setSelectedSize(variant)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedSize === variant 
                          ? "bg-[#FF7A00] text-white border-[#FF7A00] shadow-md shadow-[#FF7A00]/25" 
                          : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">কালার:</h3>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button 
                      key={color} 
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedColor === color 
                          ? "bg-white text-zinc-900 border-white font-black" 
                          : "bg-white/5 text-zinc-300 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2">পরিমাণ:</h3>
                <div className="flex items-center gap-3 w-36 border border-white/10 rounded-2xl bg-black/40 p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center font-black text-white">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/5"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-4">
            <div className="flex gap-3">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-white/10 hover:bg-white/15 text-white py-4 px-6 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95"
              >
                <ShoppingCart className="h-4 w-4 text-[#FF7A00]" /> কার্টে যোগ করুন
              </button>
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-[#FF7A00] hover:bg-[#e06b00] text-white py-4 px-6 rounded-2xl font-black text-sm transition-all shadow-xl shadow-[#FF7A00]/25 flex items-center justify-center gap-2 active:scale-95"
              >
                এখনই কিনুন
              </button>
              <button 
                onClick={() => {
                  setIsWishlisted(!isWishlisted);
                  toast(isWishlisted ? "উইশলিস্ট থেকে সরানো হয়েছে" : "উইশলিস্টে যুক্ত হয়েছে");
                }}
                className={`p-4 border rounded-2xl transition-all ${
                  isWishlisted ? "border-rose-500 bg-rose-500/10 text-rose-500" : "border-white/10 text-zinc-400 hover:text-rose-500 hover:border-rose-500/30"
                }`}
                title="উইশলিস্ট"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-rose-500" : ""}`} />
              </button>
            </div>

            {/* Delivery and Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-white/5">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/20 border border-white/5">
                <Truck className="h-5 w-5 text-[#FF7A00] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">সারা বাংলাদেশে ডেলিভারি</p>
                  <p className="text-[11px] text-zinc-400">ঢাকার ভেতরে ২৪-৪৮ ঘন্টা, বাইরে ৩-৫ দিন</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/20 border border-white/5">
                <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-white">১০০% গ্যারান্টিযুক্ত কোয়ালিটি</p>
                  <p className="text-[11px] text-zinc-400">৭ দিনের মধ্যে সহজ রিটার্ন ও রিফান্ড সুবিধা</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Seller Store Badge */}
      <div className="mt-6 bg-[#141624] p-5 md:p-6 rounded-3xl border border-white/5 flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 text-[#FF7A00] border border-[#FF7A00]/20 flex items-center justify-center font-black text-xl">
            <StoreIcon className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">{product.seller.name}</h3>
              {product.seller.verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" /> ভেরিফাইড সেলার
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1">{product.seller.location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to="/messages"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-zinc-300 border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <MessageSquare className="h-3.5 w-3.5 text-[#FF7A00]" /> ইনবক্স করুন
          </Link>
          <Link 
            to={`/store/${product.seller.id}`}
            className="px-5 py-2.5 bg-[#FF7A00] hover:bg-[#e06b00] text-white rounded-xl text-xs font-black transition-all shadow-md shadow-[#FF7A00]/20"
          >
            স্টোর ভিজিট করুন
          </Link>
        </div>
      </div>

      {/* Product Description */}
      <div className="mt-6 bg-[#141624] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
        <h2 className="text-lg font-black text-white mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#FF7A00]" /> পণ্যের বিবরণ ও স্পেসিফিকেশন
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Trust-Aware Reviews Section */}
      <div className="mt-6 bg-[#141624] p-6 md:p-8 rounded-3xl border border-white/5 shadow-xl">
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
