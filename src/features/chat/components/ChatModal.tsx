import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export function ChatModal({ vendorId, vendorName, isOpen, onClose }: { vendorId: string; vendorName?: string; isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#050D08] border border-[#1e3425] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
            <MessageSquare className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
            {vendorName || 'বিক্রেতা'}-এর সাথে চ্যাট করুন
          </h3>
          <p className="text-sm text-zinc-400 mb-6">Chat with vendor (ID: {vendorId}) is coming soon.</p>
          <Button 
            onClick={onClose}
            className="w-full bg-cyan-400 hover:bg-[#00c853] text-black font-black uppercase py-6 rounded-xl"
          >
            বন্ধ করুন
          </Button>
        </div>
      </div>
    </div>
  );
}
