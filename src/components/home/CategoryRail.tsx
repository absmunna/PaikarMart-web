import { Laptop, Shirt, ShoppingBasket, Pill, Home, LayoutGrid, Smartphone, Watch, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { id: 'all', label: 'All Categories', icon: LayoutGrid, color: 'bg-zinc-800' },
  { id: 'electronics', label: 'Electronics', icon: Smartphone, color: 'bg-blue-500' },
  { id: 'wholesale', label: 'Wholesale', icon: Zap, color: 'bg-[#FF7A00]' },
  { id: 'fashion', label: 'Fashion', icon: Shirt, color: 'bg-pink-500' },
  { id: 'grocery', label: 'Grocery', icon: ShoppingBasket, color: 'bg-emerald-500' },
  { id: 'pharmacy', label: 'Pharmacy', icon: Pill, color: 'bg-red-500' },
  { id: 'home', label: 'Home', icon: Home, color: 'bg-purple-500' },
  { id: 'computing', label: 'Computing', icon: Laptop, color: 'bg-cyan-500' },
  { id: 'accessories', label: 'Accessories', icon: Watch, color: 'bg-amber-500' },
];

export function CategoryRail() {
  return (
    <section className="py-4">
      <div className="flex items-center justify-between mb-4 px-1">
        <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Explore Categories</h2>
        <Link to="/categories" className="text-[10px] font-black text-[#FF7A00] uppercase tracking-widest hover:underline">See All</Link>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {CATEGORIES.map((cat) => (
          <Link 
            key={cat.id}
            to={`/marketplace?category=${cat.id}`}
            className="flex flex-col items-center gap-3 flex-shrink-0 group"
          >
            <div className={`h-16 w-16 rounded-[1.5rem] ${cat.color} flex items-center justify-center shadow-lg shadow-${cat.color.split('-')[1]}-500/20 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
              <cat.icon className="h-7 w-7 text-white" />
            </div>
            <span className="text-[11px] font-bold text-zinc-400 group-hover:text-white transition-colors">
              {cat.label}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
