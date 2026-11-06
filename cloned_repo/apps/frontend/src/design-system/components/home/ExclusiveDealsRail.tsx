import { ChevronLeft, ChevronRight, Zap } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";

interface Deal {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  discount: string;
}

const DEALS: Deal[] = [
  { id: '1', title: 'Premium Cotton T-Shirt', price: 450, originalPrice: 600, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500', discount: '25% OFF' },
  { id: '2', title: 'Wireless Headphones', price: 3200, originalPrice: 4500, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', discount: '28% OFF' },
  { id: '3', title: 'Smart Watch Series 7', price: 5500, originalPrice: 7500, image: 'https://images.unsplash.com/photo-1544117518-30df578096a4?w=500', discount: '26% OFF' },
  { id: '4', title: 'Leather Travel Bag', price: 2800, originalPrice: 3800, image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500', discount: '26% OFF' },
  { id: '5', title: 'Mechanical Keyboard', price: 1800, originalPrice: 2500, image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500', discount: '28% OFF' },
  { id: '6', title: 'Gaming Mouse', price: 950, originalPrice: 1500, image: 'https://images.unsplash.com/photo-1527814050087-37a3c71ee91f?w=500', discount: '36% OFF' },
];

export function ExclusiveDealsRail() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="bg-[#FF7A00] p-1.5 rounded-lg shadow-lg shadow-[#FF7A00]/20">
            <Zap className="h-4 w-4 text-white fill-white" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tight">Flash Deals</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none mt-1">Limited time offers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {DEALS.map((deal) => (
          <Link 
            key={deal.id}
            to={`/product/${deal.id}`}
            className="flex-shrink-0 w-[180px] group"
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/5 bg-white/[0.02]">
              <img 
                src={deal.image} 
                alt={deal.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#FF7A00] text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-lg">
                {deal.discount}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white text-xs font-bold line-clamp-1 mb-1">{deal.title}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-[#FF7A00]">৳{deal.price}</span>
                  <span className="text-[10px] text-zinc-400 line-through">৳{deal.originalPrice}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
