import React, { useState } from 'react';
import { MapPin, Plus, X, Globe, Save } from 'lucide-react';
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useLanguage } from "@/features/language/LanguageContext";

interface Area {
  id: string;
  nameEn: string;
  nameBn: string;
}

export function ServiceAreaSettings() {
  const { isBn } = useLanguage();
  const [areas, setAreas] = useState<Area[]>([
    { id: '1', nameEn: 'Dhanmondi', nameBn: 'ধানমণ্ডি' },
    { id: '2', nameEn: 'Mohammadpur', nameBn: 'মোহাম্মদপুর' }
  ]);
  const [newAreaEn, setNewAreaEn] = useState("");
  const [newAreaBn, setNewAreaBn] = useState("");
  const [isSameDayEnabled, setIsSameDayEnabled] = useState(true);

  const addArea = () => {
    if (!newAreaEn || !newAreaBn) {
      toast.error(isBn ? "সব ফিল্ড পূরণ করুন" : "Please fill all fields");
      return;
    }
    const newId = Math.random().toString(36).substr(2, 9);
    setAreas([...areas, { id: newId, nameEn: newAreaEn, nameBn: newAreaBn }]);
    setNewAreaEn("");
    setNewAreaBn("");
    toast.success(isBn ? "এরিয়া যোগ হয়েছে" : "Area added successfully");
  };

  const removeArea = (id: string) => {
    setAreas(areas.filter(a => a.id !== id));
    toast.info(isBn ? "এরিয়া সরানো হয়েছে" : "Area removed");
  };

  const saveSettings = () => {
    toast.success(isBn ? "সেটিংস সেভ হয়েছে" : "Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-white uppercase tracking-tight">
            {isBn ? "ডেলিভারি এলাকা নিয়ন্ত্রণ" : "Delivery Area Control"}
          </h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            {isBn ? "লোকাল শপের জন্য ডেলিভারি এরিয়া ম্যানেজ করুন" : "Manage delivery radius for local shop"}
          </p>
        </div>
        <Button onClick={saveSettings} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] h-9 px-4 font-black uppercase">
          <Save className="w-3.5 h-3.5 mr-2" />
          {isBn ? "সেভ করুন" : "Save All"}
        </Button>
      </div>

      <GlassCard className="p-5 border-emerald-500/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-white uppercase">{isBn ? "সেম-ডে ডেলিভারি" : "Same Day Delivery"}</h4>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-tight">{isBn ? "অর্ডারের দিনেই ডেলিভারি সুবিধা" : "Instant local fulfilment option"}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSameDayEnabled(!isSameDayEnabled)}
            className={`w-12 h-6 rounded-full transition-all relative ${isSameDayEnabled ? 'bg-emerald-600' : 'bg-zinc-800'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isSameDayEnabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="space-y-4">
          <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            {isBn ? "ডেলিভারি এরিয়া লিস্ট" : "Active Delivery Areas"}
          </h5>
          <div className="flex flex-wrap gap-2">
            {areas.map(area => (
              <div key={area.id} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-xl group transition-all hover:border-emerald-500/30">
                <span className="text-[10px] font-black text-white">
                  {isBn ? area.nameBn : area.nameEn}
                </span>
                <button onClick={() => removeArea(area.id)} className="text-zinc-600 hover:text-rose-500 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex flex-col md:flex-row gap-3">
          <div className="flex-1 grid grid-cols-2 gap-2">
            <Input 
              placeholder="Area (English)" 
              value={newAreaEn}
              onChange={(e) => setNewAreaEn(e.target.value)}
              className="bg-zinc-900 border-white/5 text-[10px] font-bold h-10 px-4 rounded-xl"
            />
            <Input 
              placeholder="এরিয়া (বাংলা)" 
              value={newAreaBn}
              onChange={(e) => setNewAreaBn(e.target.value)}
              className="bg-zinc-900 border-white/5 text-[10px] font-bold h-10 px-4 rounded-xl"
            />
          </div>
          <Button onClick={addArea} className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl px-6 h-10 text-[10px] font-black uppercase">
            <Plus className="w-4 h-4 mr-2" />
            {isBn ? "যোগ করুন" : "Add Area"}
          </Button>
        </div>
      </GlassCard>

      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
        <p className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest leading-relaxed">
          {isBn 
            ? "সতর্কতা: শুধুমাত্র আপনার সিলেক্ট করা এরিয়া থেকেই কাস্টমাররা সেম-ডে ডেলিভারি অর্ডার করতে পারবেন।" 
            : "Note: Real-time rider matching is only available within your manually verified service areas."}
        </p>
      </div>
    </div>
  );
}
