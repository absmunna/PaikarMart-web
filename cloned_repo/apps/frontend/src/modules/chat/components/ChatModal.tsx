import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Sparkles, Loader2, Store, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/modules/auth';
import { getOrCreateConversation, sendChatMessage } from '../services/chatFirestoreService';
import { toast } from 'sonner';

interface ChatModalProps {
  vendorId: string;
  vendorName?: string;
  vendorAvatar?: string;
  productId?: string;
  productName?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatModal({ 
  vendorId, 
  vendorName = 'বিক্রেতা', 
  vendorAvatar,
  productId,
  productName,
  isOpen, 
  onClose 
}: ChatModalProps) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [initialMessage, setInitialMessage] = useState(
    productName 
      ? `আসসালামু আলাইকুম, "${productName}" পণ্যটি কি স্টকে আছে? পাইকারি দর কত রাখবেন?` 
      : 'আসসালামু আলাইকুম, আমি আপনার পণ্যের বিষয়ে কথা বলতে চাচ্ছি।'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentUserId = user?.id || 'guest_buyer';
  const currentUserName = user?.name || user?.fullName || 'সম্মানিত ক্রেতা';

  const handleStartChat = async () => {
    setIsSubmitting(true);
    try {
      const chatId = await getOrCreateConversation(
        {
          id: currentUserId,
          name: currentUserName,
          avatar: user?.avatar || user?.avatarUrl || '',
          role: user?.role || 'buyer',
        },
        {
          id: vendorId || 'seller_default',
          name: vendorName,
          avatar: vendorAvatar || '',
          role: 'seller',
        },
        {
          productId,
          productName,
        }
      );

      if (initialMessage.trim()) {
        await sendChatMessage(chatId, {
          senderId: currentUserId,
          senderName: currentUserName,
          text: initialMessage.trim(),
        });
      }

      toast.success('চ্যাট শুরু হয়েছে');
      onClose();
      navigate(`/messages/${chatId}`);
    } catch (err: any) {
      console.error('Failed to open chat:', err);
      // Fallback: navigate directly to messages
      toast.info('মেসেজ সেন্টারে রিডাইরেক্ট করা হচ্ছে...');
      onClose();
      navigate(`/messages/chat_${currentUserId}_${vendorId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-[#0c0d14] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-cyan-950/30 to-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              {vendorAvatar ? (
                <img src={vendorAvatar} alt={vendorName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Store className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                {vendorName}
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              </h3>
              <p className="text-[10px] text-zinc-400 font-medium">সরাসরি বিক্রেতার সাথে চ্যাট করুন</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {productName && (
            <div className="p-3 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase font-bold text-orange-400/80 tracking-wider">পণ্য ইনকোয়ারি</span>
                <p className="text-xs font-bold text-white truncate">{productName}</p>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              আপনার প্রাথমিক বার্তা
            </label>
            <textarea
              rows={3}
              value={initialMessage}
              onChange={(e) => setInitialMessage(e.target.value)}
              placeholder="আপনার বার্তা লিখুন..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-3.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400/50 resize-none transition-all"
            />
          </div>

          <div className="flex gap-2.5 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-2xl bg-white/[0.04] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.08] text-xs font-bold uppercase"
            >
              বাতিল
            </Button>
            <Button
              type="button"
              onClick={handleStartChat}
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-2xl bg-cyan-400 hover:bg-cyan-500 text-black text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  সংযুক্ত হচ্ছে...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  চ্যাট শুরু করুন
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
