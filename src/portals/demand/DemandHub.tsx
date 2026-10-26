import React, { useState } from "react";
import { PlusCircle, MapPin, Tag, Briefcase, MessageSquare, Send, CheckCircle2, Search, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface DemandPost {
  id: string;
  title: string;
  category: string;
  quantity: string;
  budget: string;
  location: string;
  buyerName: string;
  buyerAvatar: string;
  timeAgo: string;
  status: "Active" | "Fulfilled";
}

const MOCK_DEMANDS: DemandPost[] = [
  {
    id: "d1",
    title: "Looking for 500kg Premium Miniket Rice for wholesale store",
    category: "Wholesale Grocery",
    quantity: "500 kg",
    budget: "৳32,000",
    location: "Khatunganj, Chattogram",
    buyerName: "Rahim Traders",
    buyerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
    timeAgo: "1 hour ago",
    status: "Active",
  },
  {
    id: "d2",
    title: "Need 50 pieces Executive Cotton Panjabi for Eid stock",
    category: "Wholesale Apparel",
    quantity: "50 pcs",
    budget: "৳65,000",
    location: "Gulistan, Dhaka",
    buyerName: "Al-Madina Fashion",
    buyerAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
    timeAgo: "3 hours ago",
    status: "Active",
  },
  {
    id: "d3",
    title: "Urgent: 10 units Smart Security Cameras with installation",
    category: "Electronics",
    quantity: "10 units",
    budget: "৳30,000",
    location: "Dhanmondi, Dhaka",
    buyerName: "Nazmul Karim",
    buyerAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    timeAgo: "Yesterday",
    status: "Active",
  },
];

export default function DemandHub() {
  const [demands, setDemands] = useState<DemandPost[]>(MOCK_DEMANDS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Wholesale");
  const [quantity, setQuantity] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleCreateDemand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !quantity || !budget) {
      toast.error("Please fill in all required demand details.");
      return;
    }

    const newDemand: DemandPost = {
      id: Date.now().toString(),
      title,
      category,
      quantity,
      budget: `৳${budget}`,
      location: location || "Dhaka, Bangladesh",
      buyerName: "You (Verified Buyer)",
      buyerAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
      timeAgo: "Just now",
      status: "Active",
    };

    setDemands([newDemand, ...demands]);
    setIsCreateModalOpen(false);
    setTitle("");
    setQuantity("");
    setBudget("");
    setLocation("");
    toast.success("Demand post published successfully! Verified sellers can now respond.");
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 text-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            <Tag className="h-6 w-6 text-[#FF7A00]" /> Buyer Demand & Sourcing Hub
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Post what products, bulk quantities, or services you are looking for. Verified sellers and manufacturers will respond with offers.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black shadow-lg shadow-[#FF7A00]/25 transition-all active:scale-95"
        >
          <PlusCircle className="h-4 w-4" /> Post a Demand
        </button>
      </div>

      {/* Demand Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demands.map((demand) => (
          <motion.div
            key={demand.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#141624] border border-white/5 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-white/10 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#FF7A00]/10 text-[#FF7A00] border border-[#FF7A00]/20 text-[10px] font-black uppercase">
                  {demand.category}
                </span>
                <span className="text-[10px] text-zinc-400 font-bold">{demand.timeAgo}</span>
              </div>

              <h3 className="text-sm font-bold text-white mb-3 leading-snug">
                {demand.title}
              </h3>

              <div className="space-y-2 mb-6 bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Required Quantity:</span>
                  <span className="font-bold text-white">{demand.quantity}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Target Budget:</span>
                  <span className="font-bold text-[#FF7A00]">{demand.budget}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Delivery Location:</span>
                  <span className="font-bold text-zinc-200 flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-rose-400" /> {demand.location}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2.5">
                <img 
                  src={demand.buyerAvatar} 
                  alt={demand.buyerName} 
                  className="h-8 w-8 rounded-full object-cover border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="text-xs font-bold text-white">{demand.buyerName}</p>
                  <p className="text-[10px] text-emerald-400">Verified Buyer</p>
                </div>
              </div>

              <button
                onClick={() => navigate("/messages")}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <MessageSquare className="h-3.5 w-3.5 text-[#FF7A00]" /> Send Offer
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Demand Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141624] border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <h3 className="text-base font-black text-white">Post Buyer Demand</h3>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-zinc-400 hover:text-white text-xs font-bold"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleCreateDemand} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1">What are you looking for?</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Looking for 200kg Basmati Rice..." 
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Category</label>
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                    >
                      <option value="Wholesale Grocery">Wholesale Grocery</option>
                      <option value="Wholesale Apparel">Wholesale Apparel</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Services">Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Required Quantity</label>
                    <input 
                      type="text" 
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="e.g. 500 kg" 
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Target Budget (BDT)</label>
                    <input 
                      type="text" 
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g. 35000" 
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 mb-1">Delivery Location</label>
                    <input 
                      type="text" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Uttara, Dhaka" 
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-[#FF7A00]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-black shadow-lg shadow-[#FF7A00]/25"
                  >
                    Publish Demand
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
