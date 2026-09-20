import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, ShoppingCart, Star, ShieldCheck, Store, 
  Minus, Plus, Check, ChevronRight, Tag, MapPin, Truck, RefreshCw 
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useCartStore } from "../modules/cart/store/useCartStore";

export interface QuickViewProduct {
  id: string;
  title: string;
  storeName?: string;
  sellerName?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  images?: string[];
  description?: string;
  isWholesale?: boolean;
  moq?: number;
  stock?: number;
  categoryName?: string;
  location?: string;
  variants?: string[];
  colors?: string[];
}

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: QuickViewProduct | null;
}

export function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const initialMoq = product?.isWholesale && product?.moq ? product.moq : 1;
  const [quantity, setQuantity] = useState(initialMoq);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [isAdded, setIsAdded] = useState(false);

  // Reset state when product changes or opens
  useEffect(() => {
    if (product) {
      const minQty = product.isWholesale && product.moq ? product.moq : 1;
      setQuantity(minQty);
      setSelectedImageIndex(0);
      setSelectedVariant(product.variants && product.variants.length > 0 ? product.variants[0] : "");
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : "");
      setIsAdded(false);
    }
  }, [product, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  // Build image list
  const imageList = product.images && product.images.length > 0
    ? product.images
    : product.imageUrl
    ? [product.imageUrl]
    : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600"];

  const store = product.storeName || product.sellerName || "PaikarMart Merchant";
  const minQty = product.isWholesale && product.moq ? product.moq : 1;
  const subtotal = product.price * quantity;
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      store: store,
      price: product.price,
      originalPrice: product.originalPrice,
      quantity: quantity,
      image: imageList[0],
      isWholesale: product.isWholesale,
      moq: product.moq,
      selectedVariant: selectedVariant,
      selectedColor: selectedColor,
    });

    setIsAdded(true);
    toast.success(`Added ${quantity}x "${product.title}" to cart!`, {
      description: `Store: ${store} • Total: ৳${subtotal.toLocaleString()}`,
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onClose();
    navigate("/cart");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-white dark:bg-[#121522] rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-white/10 z-10 my-auto flex flex-col md:flex-row max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer shadow-sm"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Column: Image Gallery */}
          <div className="w-full md:w-1/2 p-4 md:p-6 bg-gray-50 dark:bg-black/20 flex flex-col justify-between border-b md:border-b-0 md:border-r border-gray-100 dark:border-white/5">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/5 shadow-inner flex items-center justify-center">
              <img
                src={imageList[selectedImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Wholesale / Discount Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isWholesale && (
                  <span className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-md uppercase tracking-wider flex items-center gap-1">
                    <Tag className="w-3 h-3" /> Wholesale B2B
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {imageList.length > 1 && (
              <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
                {imageList.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square w-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? "border-[#FF7A00] ring-2 ring-[#FF7A00]/30 shadow-md scale-105"
                        : "border-gray-200 dark:border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions */}
          <div className="w-full md:w-1/2 p-5 md:p-7 flex flex-col overflow-y-auto">
            <div className="flex-1 space-y-4">
              {/* Category & Store Header */}
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-[#FF7A00] font-bold uppercase tracking-wider">
                  {product.categoryName || "Marketplace"}
                </span>
                <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 font-medium">
                  <Store className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{store}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {product.title}
              </h2>

              {/* Rating & Location */}
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 flex-wrap">
                <div className="flex items-center gap-1 bg-amber-400/10 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {product.rating || "4.8"}
                  </span>
                  <span className="text-gray-400">({product.reviews || 42} reviews)</span>
                </div>
                {product.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{product.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Express Delivery</span>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 flex items-baseline justify-between">
                <div>
                  <span className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                    ৳{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="ml-2 text-sm text-gray-400 line-through">
                      ৳{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.isWholesale && product.moq && (
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-md">
                    MOQ: {product.moq} Units
                  </span>
                )}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                  Product Details
                </h4>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {product.description ||
                    "Premium quality product sourced directly from verified manufacturers and sellers on PaikarMart. Guaranteed authentic with fast local shipping options."}
                </p>
              </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Size / Variant
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedVariant === v
                            ? "border-[#FF7A00] bg-[#FF7A00]/10 text-[#FF7A00]"
                            : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Selector */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Color
                  </h4>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedColor === c
                            ? "border-[#FF7A00] bg-[#FF7A00]/10 text-[#FF7A00]"
                            : "border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Subtotal */}
              <div className="flex items-center justify-between pt-2">
                <div>
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    Quantity
                  </h4>
                  <div className="flex items-center border border-gray-200 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 overflow-hidden w-32">
                    <button
                      onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                      disabled={quantity <= minQty}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white disabled:opacity-40 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-bold text-sm text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-gray-400 font-medium block">Total</span>
                  <span className="text-lg font-black text-gray-900 dark:text-white">
                    ৳{subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 mt-4 border-t border-gray-100 dark:border-white/10 flex flex-col gap-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className={`flex items-center justify-center gap-2 h-11 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-md ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-[#FF7A00] hover:bg-[#e06b00] text-white shadow-[#FF7A00]/20"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all cursor-pointer shadow-md shadow-blue-600/20"
                >
                  Buy Now
                </button>
              </div>

              <Link
                to={`/product/${product.id}`}
                onClick={onClose}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span>View Full Product Details & Specs</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
