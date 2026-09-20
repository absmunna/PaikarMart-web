import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Factory, MapPin, Globe, CheckCircle2, Search, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/features/language/LanguageContext';
import { Button } from '@/components/ui/button';

export interface FactoryDirectoryViewProps {
  onNavigate: (view: any, id?: string) => void;
  onBack: () => void;
}

export const FactoryDirectoryView: React.FC<FactoryDirectoryViewProps> = ({ onNavigate, onBack }) => {
  const { isBn } = useLanguage();
  const [search, setSearch] = useState('');

  const factories = [
    {
      id: 'fac-1',
      name: 'Bengal Weaving & Textiles Ltd.',
      nameBn: 'বেঙ্গল উইভিং অ্যান্ড টেক্সটাইলস লিমিটেড',
      location: 'Narayanganj Industrial Zone',
      locationBn: 'নারায়ণগঞ্জ শিল্প এলাকা',
      category: 'Garments & Apparel',
      categoryBn: 'পোশাক ও টেক্সটাইল',
      verified: true,
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400',
      employees: '1,500+',
      exportTo: 'EU, North America'
    },
    {
      id: 'fac-2',
      name: 'Padma Jute Spinners & Mills',
      nameBn: 'পদ্মা জুট স্পিনার্স অ্যান্ড মিলস',
      location: 'Khulna River Port Area',
      locationBn: 'খুলনা নদী বন্দর এলাকা',
      category: 'Jute & Packaging',
      categoryBn: 'পাট ও প্যাকেজিং',
      verified: true,
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=400',
      employees: '800+',
      exportTo: 'Global'
    },
    {
      id: 'fac-3',
      name: 'Jamuna Plastic Sourcing Hub',
      nameBn: 'যমুনা প্লাস্টিক সোর্সিং হাব',
      location: 'Tongia Industrial Area',
      locationBn: 'টঙ্গী শিল্প এলাকা',
      category: 'Bulk Plastic & Raw materials',
      categoryBn: 'বাল্ক প্লাস্টিক কাঁচামাল',
      verified: false,
      image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=400',
      employees: '350+',
      exportTo: 'Local & SAARC'
    }
  ];

  const filtered = factories.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    f.nameBn.includes(search) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="h-10 w-10 p-0 rounded-xl bg-white/5 border-white/10 hover:bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </Button>
        <div>
          <h2 className="text-base font-black text-white uppercase tracking-wider">
            {isBn ? "কারখানা ডিরেক্টরি" : "Industrial Factory Directory"}
          </h2>
          <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-0.5">
            {isBn ? "সরাসরি কারখানা থেকে বাল্ক অর্ডার" : "Direct Manufacturer Bulk Sourcing"}
          </p>
        </div>
      </div>

      {/* Search Input with min 44px touch target */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={isBn ? "কারখানা বা ক্যাটাগরি অনুসন্ধান করুন..." : "Search manufacturers or industrial segments..."}
          className="w-full h-12 bg-zinc-950 border border-white/5 rounded-2xl pl-12 pr-4 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500/50"
        />
      </div>

      {/* Directory list */}
      <div className="space-y-4">
        {filtered.map((f) => (
          <div 
            key={f.id}
            onClick={() => onNavigate('factory-profile', f.id)}
            className="bg-zinc-900/40 hover:bg-zinc-900 border border-white/5 hover:border-cyan-500/20 rounded-3xl overflow-hidden flex flex-col sm:flex-row gap-5 p-5 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-full sm:w-32 h-24 rounded-2xl overflow-hidden bg-zinc-950 shrink-0 border border-white/5 relative">
              <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded text-[8px] font-black text-white/80 border border-white/10 uppercase tracking-wider">
                {f.employees} Staff
              </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[8px] font-black uppercase text-cyan-400 tracking-widest px-1.5 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded">
                    {isBn ? f.categoryBn : f.category}
                  </span>
                  {f.verified && (
                    <span className="text-[8px] font-black uppercase text-emerald-400 tracking-widest flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" /> VERIFIED
                    </span>
                  )}
                </div>
                <h3 className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors tracking-tight line-clamp-1">
                  {isBn ? f.nameBn : f.name}
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 opacity-60 text-zinc-500" /> {isBn ? f.locationBn : f.location}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5 mt-3 sm:mt-0">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                  Exports to: <span className="text-zinc-300">{f.exportTo}</span>
                </span>
                <span className="text-[10px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {isBn ? "প্রোফাইল দেখুন" : "View profile"} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
