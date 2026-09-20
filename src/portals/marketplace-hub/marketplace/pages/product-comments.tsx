import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, MessageSquare, Star, HelpCircle, 
  ShoppingCart, ShieldCheck, AlertCircle, TrendingUp,
  Image as ImageIcon, Share2, MoreHorizontal, User, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatBDT } from '@/lib/format';
import { useAuth } from '@/features/auth/AuthContext';
import { ProductQASection } from '@/features/product/components/ProductQASection';
import { ReviewSystem } from '@/features/product/components/ReviewSystem';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock data fetching logic
const getMockProduct = (id: string) => ({
  id,
  title: "Premium Handloom Jamdani Saree - Heritage Collection",
  price: 12500,
  images: ["https://images.unsplash.com/photo-1610030469915-9a88e470876d?w=800"],
  rating: 4.9,
  reviewCount: 42,
  qnaCount: 15,
  vendorName: "Heritage Weaves BD"
});

export default function ProductCommentsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'reviews' | 'qna' | 'comments'>('qna');
  
  const product = getMockProduct(id || "p1");
  const isBuyer = role === 'buyer' || role === 'user';
  
  // Real security logic: Only jara order koreche tara review dite parbe
  // Mocking order verification for now
  const hasOrdered = true; // This would typically come from an API check

  const tabs = [
    { id: 'reviews', label: 'Reviews', icon: Star, color: 'text-amber-500' },
    { id: 'qna', label: 'Buyer Q&A', icon: HelpCircle, color: 'text-rose-500' },
    { id: 'comments', label: 'Comments', icon: MessageSquare, color: 'text-purple-400' }
  ] as const;

  return (
    <div className="min-h-screen bg-[#050D08] pb-12">
      {/* ─── Tab Bar (Sticky) ─── */}
      <div className="sticky top-16 z-50 bg-[#050D08]/95 backdrop-blur-md border-b border-[#1e3425]/30">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 flex flex-col items-center gap-1.5 py-4 transition-all relative overflow-hidden",
                activeTab === tab.id ? "text-white opacity-100" : "text-zinc-500 opacity-60 hover:opacity-100"
              )}
            >
              <span className={cn(
                "text-[11px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id ? "text-cyan-400" : "text-zinc-400"
              )}>
                {tab.label}
              </span>
              <tab.icon className={cn(
                "w-5 h-5 transition-transform duration-300",
                activeTab === tab.id ? "scale-110 " + tab.color : "scale-100 grayscale opacity-50"
              )} />
              
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab-line"
                  className="absolute bottom-0 w-12 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_10px_cyan-400]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Compact Product Banner (Sticky) ─── */}
      <div className="sticky top-[136px] z-40 bg-[#0c1a12]/80 backdrop-blur-sm border-b border-[#1e3425]/50 py-2 px-4 mt-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg overflow-hidden border border-[#1e3425] shrink-0 bg-black/40">
            <img src={product.images[0]} alt="Product" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[10px] font-bold text-white line-clamp-1 opacity-80">{product.title}</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-black text-cyan-400">{formatBDT(product.price)}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate(`/marketplace/product/${product.id}`)}
            className="px-3 py-1.5 bg-cyan-400 text-black text-[9px] font-black rounded-lg uppercase whitespace-nowrap shadow-[0_2px_0_#005a30] active:translate-y-[1px] active:shadow-none"
          >
            Visit Shop
          </button>
        </div>
      </div>

      {/* ─── Dynamic Content Area ─── */}
      <div className="px-4 mt-6 pb-32">
        <AnimatePresence mode="wait">
          {activeTab === 'reviews' && (
            <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {!hasOrdered && (
                <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Post Verified Feedback</p>
                    <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">Only buyers who have successfully received this product can post ratings and media reviews.</p>
                  </div>
                </div>
              )}
              <ReviewSystem reviews={[
                { id: "r2", userName: "Abir Hossain", rating: 5, comment: "Khub e valo product. Delivery o fast chilo.", createdAt: "১ দিন আগে", isVerifiedBuyer: true }
              ]} productId={product.id} />
            </motion.div>
          )}

          {activeTab === 'qna' && (
            <motion.div key="qna" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               <ProductQASection 
                  productId={product.id} 
                  questionsAnswers={[
                    { id: "q1", userName: "Rakib Ahmed", question: "এই প্রোডাক্টটি কি ওয়াটারপ্রুফ নাকি সাধারণ বৃষ্টি সহ্য করতে পারে?", answer: "জি, এটি ১০০% ওয়াটারপ্রুফ এবং প্রলেপযুক্ত। মোটরসাইকেল রাইডারদের জন্য বৃষ্টিতে রাইড করার জন্য এটি সর্বোত্তম পছন্দ।", createdAt: "২ দিন আগে" }
                  ]} 
                />
            </motion.div>
          )}

          {activeTab === 'comments' && (
            <motion.div key="comments" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="space-y-4">
                <div className="p-5 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 text-[10px] font-black">KA</div>
                    <div>
                      <h4 className="text-[11px] font-black text-white">Karim Ahmed</h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase">Community Guide</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    এই সেলারের জামদানি কালেকশন সবসময়ই সেরা। যারা অথেনটিক হ্যান্ডলুম খুঁজছেন তারা নিশ্চিন্তে নিতে পারেন।
                  </p>
                  <div className="flex items-center gap-4 pt-2 border-t border-white/5 mt-4">
                    <button className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase hover:text-cyan-400 transition-colors">
                      <Heart className="w-3.5 h-3.5" /> 12
                    </button>
                    <button className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase hover:text-cyan-400 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" /> Reply
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-[2.5rem] bg-white/[0.03] border border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400 text-[10px] font-black">SB</div>
                    <div>
                      <h4 className="text-[11px] font-black text-white">Sultana Begum</h4>
                      <p className="text-[9px] text-zinc-500 font-bold uppercase">Verified Buyer</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    প্যাকেজিং টা দারুণ ছিল। গিফট হিসেবে দেওয়ার জন্য একদম পারফেক্ট।
                  </p>
                  <div className="flex items-center gap-4 pt-2 border-t border-white/5 mt-4">
                    <button className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase hover:text-cyan-400 transition-colors">
                      <Heart className="w-3.5 h-3.5" /> 5
                    </button>
                    <button className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-black uppercase hover:text-cyan-400 transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" /> Reply
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── Role-Based Interaction Bar ─── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2 max-w-[480px] mx-auto">
         <div className="bg-[#0c1a12]/95 backdrop-blur-3xl border border-[#1e3425] rounded-[36px] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.05)] flex items-center gap-3 ring-1 ring-white/5">
            {activeTab === 'reviews' && !hasOrdered ? (
              <button className="w-full h-14 bg-cyan-400 text-black font-black uppercase tracking-widest text-[11px] rounded-[28px] shadow-[0_5px_0_#005a30] active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 hover:brightness-110 transition-all">
                <ShoppingCart className="w-4 h-4 shadow-sm" />
                Order Now to Post Review
              </button>
            ) : (
              <>
                <div className="h-12 w-12 rounded-[22px] bg-[#1e3425]/30 border border-[#1e3425] flex items-center justify-center shrink-0 shadow-inner">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Me" className="w-full h-full object-cover rounded-[20px]" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center">
                       <User className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 relative group">
                  <input 
                    placeholder={
                      activeTab === 'qna' ? "পণ্য সম্পর্কে প্রশ্ন করুন..." : 
                      activeTab === 'reviews' ? "আপনার মূল্যবান মতামত লিখুন..." : 
                      "আলোচনায় যোগ দিন..."
                    }
                    className="w-full h-12 bg-black/60 border border-[#1e3425] rounded-[24px] px-5 text-[13px] text-white font-bold placeholder:text-zinc-600 outline-none focus:border-cyan-400/50 focus:bg-black/90 transition-all shadow-inner"
                  />
                  {activeTab === 'reviews' && (
                    <button className="absolute right-3 top-3 text-zinc-500 hover:text-cyan-400 transition-colors p-1 hover:bg-cyan-400/10 rounded-lg">
                      <ImageIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => {
                    toast.success("Message Processed", { 
                      description: "Security check passed. Posting your comment.",
                      icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    });
                  }}
                  className="h-12 w-12 rounded-[22px] bg-cyan-400 text-black flex items-center justify-center shadow-[0_4px_0_#005a30] active:translate-y-[2px] active:shadow-none shrink-0 transition-all hover:shadow-[0_6px_0_#005a30] hover:-translate-y-[1px]"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Share2 className="w-5 h-5 -rotate-90 filter drop-shadow-sm" />
                  </motion.div>
                </button>
              </>
            )}
         </div>
      </div>
    </div>
  );
}
