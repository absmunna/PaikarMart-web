import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Send, Building2, Package,
  Target, Calendar, Phone, CheckCircle2,
  ShieldCheck, AlertCircle, Info, Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/Card';
import { portalsApi } from '../services/portalsApi';
import { toast } from 'sonner';

export const RFQPortal: React.FC = () => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    targetPrice: '',
    description: '',
    deadline: '',
    contactPhone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulation of RFQ submission
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)),
        {
          loading: 'Submitting your bulk request...',
          success: 'RFQ submitted! Wholesale sellers will contact you soon.',
          error: 'Failed to submit RFQ.'
        }
      );
      setFormData({
        productName: '',
        quantity: '',
        targetPrice: '',
        description: '',
        deadline: '',
        contactPhone: ''
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="relative rounded-[2.5rem] overflow-hidden bg-[#0c101c] border border-white/5 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-xl">
            <FileText className="w-10 h-10 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter">B2B Direct Request (RFQ)</h1>
            <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest mt-1">Submit bulk requirements & get factory direct quotes</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Form */}
        <div className="md:col-span-8">
          <Card className="bg-[#111625] border-white/5 p-8 rounded-[2.5rem] shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Product Name</label>
                   <Input
                    placeholder="e.g. 100% Cotton Plain T-shirts"
                    value={formData.productName}
                    onChange={(e) => setFormData({...formData, productName: e.target.value})}
                    required
                    className="bg-white/5 border-white/10 h-12 rounded-xl text-sm"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Quantity Needed</label>
                   <Input
                    type="number"
                    placeholder="e.g. 500"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    required
                    className="bg-white/5 border-white/10 h-12 rounded-xl text-sm"
                   />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Target Price (Optional)</label>
                   <Input
                    placeholder="e.g. ৳২৫০ / unit"
                    value={formData.targetPrice}
                    onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                    className="bg-white/5 border-white/10 h-12 rounded-xl text-sm"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Deadline for Quotes</label>
                   <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="bg-white/5 border-white/10 h-12 rounded-xl text-sm text-zinc-400"
                   />
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Detailed Description</label>
                <Textarea
                  placeholder="Mention size charts, GSM, material quality, and other specifics..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  className="bg-white/5 border-white/10 min-h-[120px] rounded-xl text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Contact Phone</label>
                <Input
                  placeholder="e.g. 017xxxxxxxx"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                  required
                  className="bg-white/5 border-white/10 h-12 rounded-xl text-sm"
                />
              </div>

              <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black text-sm uppercase tracking-widest h-14 rounded-2xl shadow-lg shadow-cyan-600/20 transition-all active:scale-95">
                <Send className="w-5 h-5 mr-2" /> Submit Bulk Request
              </Button>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="md:col-span-4 space-y-6">
           <Card className="bg-[#111625] border-white/5 p-6 rounded-[2rem]">
              <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2 mb-4">
                 <ShieldCheck className="w-4 h-4 text-emerald-400" /> Safe Sourcing
              </h4>
              <ul className="space-y-4">
                 {[
                   'Verified Manufacturers Only',
                   'Escrow Payment Support',
                   'Quality Inspection Check',
                   'Logistic & Export Assistance'
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-zinc-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      {item}
                   </li>
                 ))}
              </ul>
           </Card>

           <Card className="bg-orange-500/10 border-orange-500/20 p-6 rounded-[2rem]">
              <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                 <Info className="w-4 h-4" /> Need Help?
              </h4>
              <p className="text-[10px] text-zinc-400 font-bold leading-relaxed mb-4">
                Our sourcing experts can help you find the best factories and negotiate prices for you.
              </p>
              <Button variant="outline" className="w-full border-orange-500/30 text-orange-400 font-black text-[9px] uppercase tracking-widest h-10 rounded-xl hover:bg-orange-500/10">
                 Chat with Expert
              </Button>
           </Card>
        </div>
      </div>
    </div>
  );
};
