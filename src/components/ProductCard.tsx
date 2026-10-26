import { Star, ShoppingCart, Eye, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, MouseEvent } from "react";
import { useCartStore } from "../modules/cart/store/useCartStore";
import { toast } from "sonner";

export interface ProductCardProps {
  id: string;
  title: string;
  storeName: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  isWholesale?: boolean;
  moq?: number; // Minimum Order Quantity
  onQuickView?: (product: ProductCardProps) => void;
}

export default function ProductCard(props: ProductCardProps) {
  const {
    id,
    title,
    storeName,
    price,
    originalPrice,
    rating,
    reviews,
    imageUrl,
    isWholesale,
    moq,
    onQuickView,
  } = props;

  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      id,
      title,
      store: storeName,
      price,
      originalPrice,
      quantity: moq || 1,
      image: imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
      isWholesale,
      moq,
    });

    setIsAdded(true);
    toast.success(`Added "${title}" to cart!`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleQuickViewClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(props);
    }
  };

  return (
    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-3 shadow-sm transition-all hover:shadow-lg h-full relative">
      <Link to={`/product/${id}`} className="flex-1 flex flex-col gap-3">
        {/* Image Aspect with Quick View Hover Overlay */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
          ) : (
            <div className="text-gray-300 font-medium text-xs">No Image</div>
          )}

          {isWholesale && (
            <span className="absolute top-2 left-2 rounded-md bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white z-10 shadow-sm">
              Wholesale
            </span>
          )}

          {/* Quick View Button on Image */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={handleQuickViewClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-bold shadow-lg hover:bg-white hover:scale-105 transition-all"
            >
              <Eye className="h-3.5 w-3.5 text-[#FF7A00]" />
              Quick View
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1">
          <h3 className="text-sm font-medium leading-tight text-gray-900 line-clamp-2 hover:text-[#FF7A00] transition-colors" title={title}>
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-1">{storeName}</p>
          
          <div className="mt-1.5 flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-medium text-gray-700">{rating || "4.8"}</span>
            <span className="text-xs text-gray-400">({reviews || 24})</span>
          </div>

          <div className="mt-auto pt-3">
            <div className="flex items-end gap-2">
              <span className="text-base font-bold text-gray-900">৳{price.toLocaleString()}</span>
              {originalPrice && (
                <span className="text-xs text-gray-400 line-through mb-0.5">
                  ৳{originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {isWholesale && moq && (
              <p className="mt-1 text-[11px] font-medium text-blue-600">Min. Order: {moq} units</p>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-3 flex gap-2">
        <button
          onClick={handleQuickViewClick}
          className="flex items-center justify-center p-2.5 rounded-xl border border-gray-200 text-gray-600 hover:text-[#FF7A00] hover:border-[#FF7A00] hover:bg-orange-50/50 transition-all"
          title="Quick View"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={handleAddToCart}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-gray-100 text-gray-900 hover:bg-[#FF7A00] hover:text-white"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="h-3.5 w-3.5" /> Added
            </>
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
