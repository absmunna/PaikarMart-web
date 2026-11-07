import React, { useState, useRef, useEffect } from 'react';
import { Film, X, Upload, Sparkles, ShoppingBag, Plus, AlertCircle, Clock, Check, FileVideo, Lock, ExternalLink, Link2, Store } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { useVideoStore } from '../store/useVideoStore';
import { useAuth } from '@/modules/auth';
import { PERMISSIONS } from '@/config/roles.config';
import { VideoCategoryType, ProductLinkConfig } from '../types';
import { ECOMMERCE_PRODUCTS } from '@/modules/product';
import { validateVideoFile, validateVideoDuration } from '../utils/videoValidator';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({ isOpen, onClose }) => {
  const { addVideo } = useVideoStore();
  const { hasPermission, promoteToCreator, isSeller } = useAuth();

  const canPostCreatorContent = hasPermission(PERMISSIONS.CAN_POST_VIDEO_CONTENT);
  const canPostSellerContent = hasPermission(PERMISSIONS.CAN_SELL) || isSeller;
  const canMonetizeContent = hasPermission(PERMISSIONS.CAN_MONETIZE_CONTENT);

  // 3 Category System State
  const [categoryType, setCategoryType] = useState<VideoCategoryType>('creator');

  // Initialize category based on permission
  useEffect(() => {
    if (!canPostCreatorContent && canPostSellerContent) {
      setCategoryType('seller_product');
    }
  }, [canPostCreatorContent, canPostSellerContent]);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category 2: Product Selling Link Config State
  const [linkType, setLinkType] = useState<'paikarmart' | 'daraz' | 'amazon' | 'website'>('paikarmart');
  const [selectedPaikarmartProductId, setSelectedPaikarmartProductId] = useState(ECOMMERCE_PRODUCTS[0]?.id.toString() || '1');
  const [externalProductUrl, setExternalProductUrl] = useState('');
  const [externalProductTitle, setExternalProductTitle] = useState('');
  const [externalProductPrice, setExternalProductPrice] = useState('');

  // Category 3: Paid Vlog Options State
  const [isPaidContent, setIsPaidContent] = useState(false);
  const [priceAmount, setPriceAmount] = useState('20');

  // Video duration state & detection
  const [durationSeconds, setDurationSeconds] = useState<number | null>(null);
  const [durationFormatted, setDurationFormatted] = useState<string>('');
  const [durationError, setDurationError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Detect whether link is external (YouTube / Facebook)
  const isExternalLink = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('facebook.com') || videoUrl.includes('fb.watch');

  // Reset duration errors and defaults when Category changes
  useEffect(() => {
    setDurationError(null);
  }, [categoryType]);

  // Handle duration validation logic based on the selected Category Option
  useEffect(() => {
    if (durationSeconds === null) {
      setDurationError(null);
      return;
    }

    const minutes = Math.floor(durationSeconds / 60);
    const secs = Math.floor(durationSeconds % 60);
    const formatted = `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    setDurationFormatted(formatted);

    if (categoryType === 'creator') {
      // Category 1: Content Creator - max 3 minutes (180s)
      if (durationSeconds > 180) {
        setDurationError(`কনটেন্ট ক্রিয়েটর ভিডিওর সর্বোচ্চ সময়সীমা ৩ মিনিট (১৮০ সেকেন্ড)। আপনার ভিডিও ${formatted} মিনিট।`);
      } else {
        setDurationError(null);
      }
    } else if (categoryType === 'seller_product') {
      // Category 2: Product Selling - 30 to 60 seconds
      if (durationSeconds > 60) {
        setDurationError(`প্রোডাক্ট সেলিং ভিডিওর সময়সীমা ৩০ থেকে ৬০ সেকেন্ড। আপনার ভিডিও ${formatted} মিনিট।`);
      } else if (durationSeconds < 30) {
        setDurationError(`প্রোডাক্ট সেলিং ভিডিওর সর্বনিম্ন সময়সীমা ৩০ সেকেন্ড। আপনার ভিডিও ${formatted} মিনিট।`);
      } else {
        setDurationError(null);
      }
    } else if (categoryType === 'vlog_premium') {
      // Category 3: Personal Vlog / Paid Content - 3 to 10 minutes (180s to 600s)
      if (durationSeconds > 600) {
        setDurationError(`পার্সোনাল ব্লগ ভিডিওর সর্বোচ্চ সময়সীমা ১০ মিনিট। আপনার ভিডিও ${formatted} মিনিট।`);
      } else if (durationSeconds < 180) {
        setDurationError(`পার্সোনাল ব্লগ ভিডিওর সর্বনিম্ন সময়সীমা ৩ মিনিট (১৮০ সেকেন্ড)। আপনার ভিডিও ${formatted} মিনিট।`);
      } else {
        setDurationError(null);
      }
    }
  }, [durationSeconds, categoryType]);

  if (!isOpen) return null;

  // Handle local file selection with automated duration & 1:1 ratio validation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setVideoUrl(fileUrl);

      const result = await validateVideoFile(file, categoryType);
      setDurationSeconds(result.durationSeconds);
      if (result.error) {
        setDurationError(result.error);
        toast.error(result.error);
      } else {
        setDurationError(null);
        if (result.warning) {
          toast.info(result.warning);
        }
      }
    }
  };

  const handleUrlChange = (urlVal: string) => {
    setVideoUrl(urlVal);
    if (!urlVal) {
      setDurationSeconds(null);
      return;
    }

    if (urlVal.includes('youtube.com') || urlVal.includes('youtu.be') || urlVal.includes('facebook.com') || urlVal.includes('fb.watch')) {
      // Default valid fallback duration for YouTube/Facebook links
      if (categoryType === 'creator') setDurationSeconds(120); // 2 mins
      else if (categoryType === 'seller_product') setDurationSeconds(45); // 45s
      else setDurationSeconds(300); // 5 mins
      return;
    }

    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = urlVal;
    tempVideo.onloadedmetadata = () => {
      setDurationSeconds(tempVideo.duration);
    };
    tempVideo.onerror = () => {
      setDurationSeconds(categoryType === 'seller_product' ? 45 : 120);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("ভিডিওর শিরোনাম প্রদান করুন");
      return;
    }

    if (durationError) {
      toast.error(durationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

      let productConfig: ProductLinkConfig | undefined;
      let categoryName = 'কনটেন্ট ক্রিয়েটর (৩ মি:)';

      if (categoryType === 'creator') {
        categoryName = 'কনটেন্ট ক্রিয়েটর (৩ মি:)';
      } else if (categoryType === 'seller_product') {
        categoryName = 'প্রোডাক্ট সেলিং (৩০-৬০ সে:)';
        if (linkType === 'paikarmart') {
          const selectedProd = ECOMMERCE_PRODUCTS.find(p => p.id.toString() === selectedPaikarmartProductId);
          productConfig = {
            type: 'paikarmart',
            productId: selectedPaikarmartProductId,
            title: selectedProd?.name || 'পাইকারমার্ট অফিশিয়াল প্রোডাক্ট',
            price: selectedProd?.price || 500,
            image: selectedProd?.image,
            storeName: selectedProd?.sellerName || 'পাইকারমার্ট সেলার'
          };
        } else {
          productConfig = {
            type: linkType,
            url: externalProductUrl || (linkType === 'daraz' ? 'https://www.daraz.com.bd' : linkType === 'amazon' ? 'https://www.amazon.com' : 'https://www.paikarmart.com'),
            title: externalProductTitle || `${linkType.toUpperCase()} অ্যাফিলিয়েট প্রোডাক্ট`,
            price: externalProductPrice ? Number(externalProductPrice) : 990
          };
        }
      } else if (categoryType === 'vlog_premium') {
        categoryName = 'পার্সোনাল ব্লগ ও পেড শো';
      }

      await addVideo({
        title,
        description: description || "পাইকারমার্ট স্পেশাল কমার্স কন্টেন্ট",
        categoryType,
        category: categoryName,
        videoUrl: videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail: thumbnail || "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800",
        durationSeconds: durationSeconds || 120,
        productLinkConfig: productConfig,
        linkedProductId: linkType === 'paikarmart' ? selectedPaikarmartProductId : undefined,
        isPaidContent: categoryType === 'vlog_premium' ? isPaidContent : false,
        priceAmount: categoryType === 'vlog_premium' && isPaidContent ? Number(priceAmount) : 0,
        tags
      });

      toast.success("ভিডিও সফলভাবে পাইকারমার্ট ভিডিও হাব-এ পাবলিশ হয়েছে!");
      onClose();
    } catch (err) {
      toast.error("ভিডিও পাবলিশ করতে সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="w-full max-w-2xl bg-[#121422] border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto no-scrollbar text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-[#FF7A00]/20 text-[#FF7A00] border border-[#FF7A00]/30">
              <Film className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-black text-white">ভিডিও ক্যাটাগরি ও কন্টেন্ট পাবলিশিং ককপিট</h3>
              <p className="text-xs text-zinc-400">৩টি নির্দিষ্ট ভিডিও ক্যাটাগরি ও অটোমেটেড এম্বেড ফিচার</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Option Tabs (The 3 distinct categories required by user) */}
        <div className="mt-4 space-y-2">
          <label className="block text-xs font-black text-zinc-300 uppercase tracking-wider">
            ভিডিও ক্যাটাগরি নির্বাচন করুন (৩টি মোড):
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Category 1: Creator 3 Mins */}
            <button
              type="button"
              onClick={() => canPostCreatorContent && setCategoryType('creator')}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                !canPostCreatorContent ? 'opacity-60 grayscale cursor-not-allowed border-zinc-800' : 'cursor-pointer'
              } ${
                categoryType === 'creator'
                  ? 'border-[#FF7A00] bg-[#FF7A00]/20 text-white shadow-lg shadow-[#FF7A00]/10'
                  : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs text-white flex items-center gap-1">🎬 ক্রিয়েটর</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">৩ মি:</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">ইউটিউব/ফেসবুক বা ডিরেক্ট ৩ মিনিটের ভিডিও</p>
              {!canPostCreatorContent && <Lock className="absolute bottom-2 right-2 w-3 h-3 text-zinc-600" />}
            </button>

            {/* Category 2: Merchant Product Selling 30-60s */}
            <button
              type="button"
              onClick={() => canPostSellerContent && setCategoryType('seller_product')}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                !canPostSellerContent ? 'opacity-60 grayscale cursor-not-allowed border-zinc-800' : 'cursor-pointer'
              } ${
                categoryType === 'seller_product'
                  ? 'border-[#FF7A00] bg-[#FF7A00]/20 text-white shadow-lg shadow-[#FF7A00]/10'
                  : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs text-white flex items-center gap-1">🛍️ সেলিং</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">৩০-৬০ সে:</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">দারাজ, অ্যামাজন, নিজস্ব ওয়েবসাইট বা পাইকারমার্ট লিংক</p>
              {!canPostSellerContent && <Lock className="absolute bottom-2 right-2 w-3 h-3 text-zinc-600" />}
            </button>

            {/* Category 3: Personal Vlog & Paid Content 3-10 mins */}
            <button
              type="button"
              onClick={() => canPostCreatorContent && setCategoryType('vlog_premium')}
              className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                !canPostCreatorContent ? 'opacity-60 grayscale cursor-not-allowed border-zinc-800' : 'cursor-pointer'
              } ${
                categoryType === 'vlog_premium'
                  ? 'border-[#FF7A00] bg-[#FF7A00]/20 text-white shadow-lg shadow-[#FF7A00]/10'
                  : 'border-white/10 bg-zinc-900/60 text-zinc-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-black text-xs text-white flex items-center gap-1">⭐ ব্লগ/পেড</span>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">৩-১০ মি:</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">ফ্রি বা পেড ব্লগ (৩০ সেকেন্ড ফ্রি প্রিভিউ)</p>
              {!canPostCreatorContent && <Lock className="absolute bottom-2 right-2 w-3 h-3 text-zinc-600" />}
            </button>
          </div>

          {!canPostCreatorContent && (
            <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] text-pink-300">
                <Sparkles className="w-4 h-4" />
                <span>আপনি কি একজন কনটেন্ট ক্রিয়েটর হতে চান?</span>
              </div>
              <button
                type="button"
                onClick={() => promoteToCreator()}
                className="px-3 py-1 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-[10px] font-black transition-all active:scale-95"
              >
                ক্রিয়েটর প্রোফাইল চালু করুন
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Category Description Guidelines */}
        <div className="mt-3 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs">
          {categoryType === 'creator' && (
            <p className="text-[11px] text-blue-300 font-medium leading-relaxed">
              <strong>১. কনটেন্ট ক্রিয়েটর মোড:</strong> সর্বোচ্চ ৩ মিনিট সময়সীমা। ইউটিউব বা ফেসবুকের ফুল ভিডিও লিংক যুক্ত করতে পারবেন।
            </p>
          )}
          {categoryType === 'seller_product' && (
            <p className="text-[11px] text-amber-300 font-medium leading-relaxed">
              <strong>২. প্রোডাক্ট সেলিং সেলারস মোড:</strong> সময়সীমা ৩০ থেকে ৬০ সেকেন্ড। ভিডিওর সাথে পণ্য লিংক (দারাজ, অ্যামাজন, নিজস্ব ওয়েবসাইট বা পাইকারমার্ট অ্যাপ প্রোডাক্ট) যুক্ত করা যাবে।
            </p>
          )}
          {categoryType === 'vlog_premium' && (
            <p className="text-[11px] text-rose-300 font-medium leading-relaxed">
              <strong>৩. পার্সোনাল ব্লগ ও পেড শো মোড:</strong> সময়সীমা ৩ থেকে ১০ মিনিট। ফ্রি অথবা ফি দিয়ে (Pay-to-watch) কন্টেন্ট দেখার অপশন। পেড কন্টেন্টের প্রথম <strong>৩০ সেকেন্ড ফ্রি প্রিভিউ</strong> হিসেবে প্লে হবে।
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 text-xs">

          {/* CATEGORY 2 CONFIG: Product Link Type & Selector */}
          {categoryType === 'seller_product' && (
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <label className="block text-amber-400 font-black flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" /> পণ্যের লিংক নির্বাচন করুন:
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'paikarmart', label: 'পাইকারমার্ট অ্যাপ', desc: 'মাই সেলার অ্যাকাউন্ট' },
                  { id: 'daraz', label: 'Daraz', desc: 'অ্যাফিলিয়েট লিংক' },
                  { id: 'amazon', label: 'Amazon', desc: 'অ্যাফিলিয়েট লিংক' },
                  { id: 'website', label: 'নিজস্ব সাইট', desc: 'ওয়েবসাইট লিংক' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLinkType(item.id as any)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      linkType === item.id
                        ? 'border-amber-400 bg-amber-400/20 text-white font-black'
                        : 'border-white/10 bg-zinc-900 text-zinc-400'
                    }`}
                  >
                    <span className="block text-xs font-bold">{item.label}</span>
                    <span className="text-[9px] text-zinc-400 block">{item.desc}</span>
                  </button>
                ))}
              </div>

              {linkType === 'paikarmart' ? (
                <div>
                  <label className="block text-zinc-300 font-bold mb-1">আপনার পাইকারমার্ট সেলার স্টোর থেকে প্রোডাক্ট বেছে নিন:</label>
                  <select
                    value={selectedPaikarmartProductId}
                    onChange={(e) => setSelectedPaikarmartProductId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    {ECOMMERCE_PRODUCTS.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.name} - ৳{prod.price} ({prod.sellerName})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <div>
                    <label className="block text-zinc-300 font-bold mb-1">{linkType.toUpperCase()} প্রোডাক্ট URL *</label>
                    <input 
                      type="url"
                      required
                      value={externalProductUrl}
                      onChange={(e) => setExternalProductUrl(e.target.value)}
                      placeholder={`https://www.${linkType}.com/...`}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text"
                      value={externalProductTitle}
                      onChange={(e) => setExternalProductTitle(e.target.value)}
                      placeholder="প্রোডাক্ট টাইটেল (ঐচ্ছিক)"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                    />
                    <input 
                      type="number"
                      value={externalProductPrice}
                      onChange={(e) => setExternalProductPrice(e.target.value)}
                      placeholder="দাম ৳ (ঐচ্ছিক)"
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CATEGORY 3 CONFIG: Free vs Paid Video & Pricing */}
          {categoryType === 'vlog_premium' && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-rose-300 font-black flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-rose-400" /> ভিডিও অ্যাক্সেস টাইপ নির্বাচন করুন:
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPaidContent(false)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      !isPaidContent ? 'bg-emerald-500 text-white font-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    ফ্রি কন্টেন্ট
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPaidContent(true)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      isPaidContent ? 'bg-rose-500 text-white font-black' : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    পেড (Pay-to-Watch)
                  </button>
                </div>
              </div>

              {isPaidContent && (
                <div className="space-y-2 pt-1 border-t border-rose-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-300 font-bold">ভিডিও আনলক প্রাইস (টাকা):</span>
                    <div className="flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5">
                      <span className="text-amber-400 font-black">৳</span>
                      <input 
                        type="number"
                        min="5"
                        max="500"
                        value={priceAmount}
                        onChange={(e) => setPriceAmount(e.target.value)}
                        className="w-16 bg-transparent text-white font-black text-xs outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400 shrink-0" />
                    পেড ভিডিওর প্রথম <strong>৩০ সেকেন্ড ফ্রি প্রিভিউ</strong> হিসেবে প্রদর্শিত হবে। এরপর ওয়ালেট পেমেন্ট আনলক ডায়ালগ শো করবে।
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Video URL or Direct File Selection */}
          <div className="space-y-3">
            <div>
              <label className="block text-zinc-400 font-bold mb-1">
                ভিডিও লিংক (ইউটিউব, ফেসবুক বা ডিরেক্ট URL) *
              </label>
              <input 
                type="url" 
                value={videoUrl}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... বা https://www.facebook.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00]"
              />
            </div>

            <div className="relative text-center my-1">
              <span className="px-2 text-[10px] font-bold text-zinc-500 bg-[#121422] relative z-10">অথবা সরাসরি আপলোড করুন</span>
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
            </div>

            {/* Direct Upload Box (Screen ratio rule note) */}
            <div>
              <label className="border-2 border-dashed border-white/15 rounded-2xl p-3 text-center bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors cursor-pointer block">
                <FileVideo className="w-6 h-6 text-[#FF7A00] mx-auto mb-1" />
                <span className="text-xs font-bold text-white block">
                  {selectedFile ? selectedFile.name : "কম্পিউটার/মোবাইল থেকে সরাসরি ভিডিও আপলোড"}
                </span>
                <span className="text-[10px] text-amber-400 font-bold block mt-0.5">
                  * অ্যাপে সরাসরি আপলোড করা ভিডিও ১:১ (Square Ratio) স্ক্রিন সাইজে সেভ হবে
                </span>
                <input 
                  type="file" 
                  accept="video/mp4,video/webm"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-zinc-400 font-bold mb-1">ভিডিওর শিরোনাম (Title) *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="উদাঃ ইসলামপুর পাইকারি কাপড়ের নতুন কালেকশন..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-400 font-bold mb-1">বিবরণ (Description)</label>
            <textarea 
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ভিডিও ও পণ্যের বিস্তারিত বিবরণ..."
              className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF7A00] resize-none"
            />
          </div>

          {/* Duration Error Warning */}
          {durationError && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{durationError}</span>
            </div>
          )}

          {/* Screen Ratio & Embed Notification Box */}
          <div className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF7A00]" />
              <div>
                <p className="font-bold text-white">
                  স্ক্রিন সাইজ: {isExternalLink ? "ইউটিউব/ফেসবুক ডিফল্ট এম্বেড রেশিও" : "১:১ স্কয়ার ডিরেক্ট রেশিও"}
                </p>
                <p className="text-[10px] text-zinc-400">
                  {isExternalLink ? "ইউটিউব ও ফেসবুক লিঙ্ক অটোমেটেড ইন-অ্যাপ এম্বেড প্লেয়ারে চলবে।" : "ডিরেক্ট ফাইল ১:১ স্কয়ার স্ক্রিনে প্লে হবে।"}
                </p>
              </div>
            </div>
            {durationFormatted && (
              <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-mono font-black">
                {durationFormatted}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-bold cursor-pointer transition-colors"
            >
              বাতিল
            </button>
            <button 
              type="submit"
              disabled={isSubmitting || Boolean(durationError)}
              className="px-6 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white font-black shadow-lg shadow-[#FF7A00]/25 transition-all active:scale-95 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>{isSubmitting ? "আপলোড হচ্ছে..." : "পাবলিশ করুন"}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
