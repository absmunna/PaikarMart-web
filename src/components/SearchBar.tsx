import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, ShoppingBag, Tag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { productService } from "../services/productService";
import { SellerProduct } from "../modules/seller/types";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SellerProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);
    
    // Using subscription for real-time results as requested
    const unsubscribe = productService.subscribeToSearch(query, (products) => {
      setResults(products);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search products, services, categories..."
          className="h-10 w-full rounded-full border border-white/10 bg-[#1e2136] pl-10 pr-10 text-sm text-white outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] transition-all placeholder:text-gray-500"
        />
        <AnimatePresence>
          {(query || isLoading) && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-[#FF7A00]" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-[#1e2136] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[60] backdrop-blur-xl"
          >
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {results.length > 0 ? (
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Products & Services
                  </div>
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                    >
                      <div className="h-12 w-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                        {product.images && product.images[0] ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.title} 
                            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-600">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{product.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-[#FF7A00]">৳{product.price}</span>
                          <span className="text-[10px] text-gray-500 px-1.5 py-0.5 bg-white/5 rounded-md flex items-center gap-1">
                            <Tag className="h-2.5 w-2.5" />
                            {product.categoryName}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : !isLoading && query ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 mb-3">
                    <Search className="h-6 w-6 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-400">No results found for "{query}"</p>
                  <p className="text-xs text-gray-500 mt-1">Try a different keyword or category</p>
                </div>
              ) : null}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
