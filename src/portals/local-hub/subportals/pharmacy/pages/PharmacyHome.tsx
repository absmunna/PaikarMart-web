import * as React from "react";
import { useState, useRef } from "react";
import { Pill, Search, Stethoscope, FileUp, ShieldAlert, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { useListProducts, getListProductsQueryKey } from "@/modules/app/api/client/hooks";
import { ProductGrid } from "@/features/product/components/ProductGrid";
import { StoryBar } from "@shared/StoryBar";
import { CategoryNavBar } from "@shared/CategoryNavBar";
import { useLanguage } from "@/features/language/LanguageContext";

const DRUG_CATS = [
  { id: "all", label: "All Items", emoji: "💊" },
  { id: "pain relief", label: "Pain Relief", emoji: "🌡️" },
  { id: "cardiac", label: "Cardiac", emoji: "❤️" },
  { id: "diabetes", label: "Diabetes", emoji: "🩺" },
  { id: "eye care", label: "Eye Care", emoji: "👁️" },
  { id: "baby care", label: "Baby Care", emoji: "👶" },
  { id: "vitamins", label: "Vitamins", emoji: "🍃" },
  { id: "allergy", label: "Allergy", emoji: "🤧" },
];

export function PharmacyHome() {
  const { isBn } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Prescription states
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { data: products, isLoading } = useListProducts(
    { type: "pharmacy" },
    { query: { queryKey: getListProductsQueryKey({ type: "pharmacy" }) } }
  );

  const filteredProducts = products?.filter((p: any) => {
    let matches = true;
    if (activeCategory !== "all") {
      matches = p.category?.toLowerCase() === activeCategory.toLowerCase();
    }
    if (searchQuery) {
      matches = matches && (
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return matches;
  }) || [];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const simulateUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large (max 5MB)");
      return;
    }
    setPrescriptionFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success("Prescription uploaded successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateUpload(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--pm-bg)] pb-28 pt-0 max-w-7xl mx-auto px-4">
      <section className="pt-2"><StoryBar context="pharmacy" /></section>
      
      <div className="md:sticky top-16 z-40 bg-[var(--pm-bg)]/90 backdrop-blur-lg border-b border-[var(--pm-border)]/40 -mx-4 px-4 mt-2">
        <CategoryNavBar context="pharmacy" />
      </div>

      <div className="mt-4">
        {/* HERO */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[28px] border border-cyan-500/20 p-5 bg-[#050D08] mb-4 shadow-xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(6,182,212,0.1)_0%,transparent_60%)]" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 shadow-inner">
              <Pill className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-black text-cyan-400 uppercase tracking-widest">Healthcare</span>
              </div>
              <h1 className="text-lg font-black text-white leading-tight">
                {isBn ? "অনলাইন ফার্মেসি" : "Online Pharmacy"}
              </h1>
              <p className="text-[11px] text-zinc-500 font-bold mt-0.5">
                {isLoading ? "Loading..." : (isBn ? `${filteredProducts.length} টি ঔষধ পাওয়া গেছে` : `${filteredProducts.length} medicines available`)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Prescription Upload Area */}
        <div className="mb-6">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf" onChange={handleFileChange} />
          <div 
            onClick={handleUploadClick}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files?.[0]) simulateUpload(e.dataTransfer.files[0]); }}
            className={`w-full relative overflow-hidden rounded-3xl border-2 border-dashed transition-all cursor-pointer bg-[#050D08]
              ${isDragging ? 'border-cyan-400 bg-cyan-500/5' : 'border-white/10 hover:border-cyan-500/30'}
              ${prescriptionFile && !isUploading ? 'border-cyan-500/50 bg-cyan-500/5' : ''}
            `}
          >
            <div className="p-6 flex flex-col items-center justify-center text-center gap-3">
              {isUploading ? (
                <div className="w-full max-w-[200px] flex flex-col items-center gap-3 py-2">
                  <div className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">Scanning... {uploadProgress}%</div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              ) : prescriptionFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-1">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                  </div>
                  <p className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">Prescription Accepted</p>
                  <p className="text-[10px] text-zinc-400 font-medium">Our pharmacists are reviewing: {prescriptionFile.name}</p>
                  <button onClick={(e) => { e.stopPropagation(); setPrescriptionFile(null); }} className="mt-2 text-[10px] font-bold text-rose-400 border border-rose-500/30 px-3 py-1 rounded-lg">Remove</button>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Upload Prescription</h3>
                    <p className="text-[10px] font-bold text-zinc-500 mt-1">Tap or drag your prescription image here</p>
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-cyan-500 bg-cyan-500/10 px-3 py-1.5 rounded-full mt-1">
                    Get 10% Off
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="mb-4">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? "ঔষধ খুঁজুন..." : "Search medicines or brands..."}
              className="w-full h-12 bg-[#050D08] rounded-2xl border border-white/5 pl-10 pr-4 text-[12px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/40 transition-all font-semibold shadow-inner"
            />
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-2 -mx-4 px-4 snap-x">
          {DRUG_CATS.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat.id)}
                className={`snap-center shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[11px] font-black transition-all border ${
                  isActive 
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                    : 'bg-[#050D08] border-white/5 text-zinc-400 hover:bg-white/5'
                }`}
              >
                <span>{cat.emoji}</span>
                <span className="uppercase tracking-widest">{cat.label}</span>
              </motion.button>
            );
          })}
        </div>

        <ProductGrid 
          products={filteredProducts} 
          isLoading={isLoading} 
          emptyMessage={searchQuery ? "No matching medicines found." : "No medicines available in this category yet."}
        />
      </div>
    </div>
  );
}
