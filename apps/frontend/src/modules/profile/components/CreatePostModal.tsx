import React, { useState } from 'react';
import {
  X, Camera, Plus, ShoppingBag,
  Tag, Package, MapPin, SlidersHorizontal,
  Globe, Info, ChevronDown, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card } from '@/components/ui/Card';
import { toast } from 'sonner';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName: string;
  sellerAvatar: string;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose, sellerName, sellerAvatar }) => {
  const [activeTab, setActiveTab] = useState<'content' | 'product'>('content');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    price: '',
    stock: '',
    category: '',
    moq: '1',
    radius: '5',
    media: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Product post published successfully! Syncing to global feeds...');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <Card className="w-full max-w-lg bg-[#111625] border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Create Product Post</h3>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-white/5 text-zinc-500">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Seller Identity */}
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10">
               <img src={sellerAvatar} alt={sellerName} className="w-full h-full object-cover" />
             </div>
             <div>
               <h4 className="text-xs font-black text-white uppercase tracking-tight">{sellerName}</h4>
               <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">
                 <Globe className="w-3 h-3" /> Public Feed
                 <ChevronDown className="w-2.5 h-2.5" />
               </div>
             </div>
          </div>

          {/* Media Dropzone (1:1 Ratio Simulation) */}
          <div className="aspect-square w-full rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 group hover:border-sky-500/30 transition-all cursor-pointer">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
               <ImageIcon className="w-8 h-8 text-zinc-600 group-hover:text-sky-400" />
             </div>
             <div className="text-center space-y-1">
               <p className="text-[10px] font-black text-white uppercase tracking-widest">Add Photos/Video</p>
               <p className="text-[9px] text-zinc-500 font-bold uppercase">1:1 Aspect Ratio Recommended</p>
             </div>
          </div>

          {/* Content Inputs */}
          <div className="space-y-4">
            <Textarea
              placeholder="Write a catchy description for your product..."
              className="bg-transparent border-none p-0 focus-visible:ring-0 text-sm font-bold placeholder:text-zinc-600 min-h-[60px] resize-none"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
            />

            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Product Title</label>
                 <Input
                   placeholder="e.g. Premium Polo"
                   className="bg-white/5 border-white/10 h-10 text-xs font-bold rounded-xl"
                   value={formData.title}
                   onChange={(e) => setFormData({...formData, title: e.target.value})}
                   required
                 />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Price (৳)</label>
                 <Input
                   type="number"
                   placeholder="450"
                   className="bg-white/5 border-white/10 h-10 text-xs font-bold rounded-xl"
                   value={formData.price}
                   onChange={(e) => setFormData({...formData, price: e.target.value})}
                   required
                 />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Stock Quantity</label>
                 <Input
                   type="number"
                   placeholder="100"
                   className="bg-white/5 border-white/10 h-10 text-xs font-bold rounded-xl"
                   value={formData.stock}
                   onChange={(e) => setFormData({...formData, stock: e.target.value})}
                 />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Portal Category</label>
                 <Select onValueChange={(val) => setFormData({...formData, category: val})}>
                   <SelectTrigger className="bg-white/5 border-white/10 h-10 text-xs font-bold rounded-xl">
                     <SelectValue placeholder="Select Portal" />
                   </SelectTrigger>
                   <SelectContent className="bg-[#111625] border-white/10">
                     <SelectItem value="retail">B2C Retail</SelectItem>
                     <SelectItem value="wholesale">B2B Wholesale</SelectItem>
                     <SelectItem value="hyperlocal">Hyperlocal Nearby</SelectItem>
                     <SelectItem value="service">Services Hub</SelectItem>
                     <SelectItem value="digital">Digital & OTT</SelectItem>
                     <SelectItem value="export">Export Hub</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Min. Order (MOQ)</label>
                 <Input
                   type="number"
                   value={formData.moq}
                   onChange={(e) => setFormData({...formData, moq: e.target.value})}
                   className="bg-white/5 border-white/10 h-10 text-xs font-bold rounded-xl"
                 />
               </div>
               <div className="space-y-1.5">
                 <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Delivery Radius (KM)</label>
                 <Input
                   type="number"
                   value={formData.radius}
                   onChange={(e) => setFormData({...formData, radius: e.target.value})}
                   className="bg-white/5 border-white/10 h-10 text-xs font-bold rounded-xl"
                 />
               </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
             <div className="flex gap-2">
               <Button type="button" variant="ghost" size="icon" className="w-9 h-9 rounded-xl bg-white/5 text-sky-400">
                 <MapPin className="w-4 h-4" />
               </Button>
               <Button type="button" variant="ghost" size="icon" className="w-9 h-9 rounded-xl bg-white/5 text-amber-400">
                 <Tag className="w-4 h-4" />
               </Button>
               <Button type="button" variant="ghost" size="icon" className="w-9 h-9 rounded-xl bg-white/5 text-emerald-400">
                 <Package className="w-4 h-4" />
               </Button>
             </div>
             <Button type="submit" className="bg-sky-500 hover:bg-sky-400 text-black font-black text-xs uppercase tracking-widest px-8 rounded-xl shadow-lg shadow-sky-500/20 transition-all active:scale-95 h-11">
               Publish Now
             </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
