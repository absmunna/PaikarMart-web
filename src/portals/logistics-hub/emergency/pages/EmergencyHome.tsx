import React, { useState } from 'react';
import { 
  AlertTriangle, Phone, MapPin, Search, 
  ShieldAlert, Activity, HeartPulse, 
  Flame, Shield, LifeBuoy, Info, 
  Navigation, Clock, ChevronRight, PhoneCall,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { StoryBar } from '@/shared/StoryBar';
import { PortalIconBar } from '@/shared/PortalIconBar';
import { toast } from 'sonner';

// Mock Emergency Contacts
const EMERGENCY_SERVICES = [
  { id: 'national', nameEn: 'National Emergency', nameBn: 'জাতীয় জরুরি সেবা', number: '999', icon: ShieldAlert, color: 'bg-rose-500' },
  { id: 'ambulance', nameEn: 'Ambulance Service', nameBn: 'অ্যাম্বুলেন্স সার্ভিস', number: '01712345678', icon: HeartPulse, color: 'bg-red-500' },
  { id: 'fire', nameEn: 'Fire Service', nameBn: 'ফায়ার সার্ভিস', number: '16163', icon: Flame, color: 'bg-orange-500' },
  { id: 'police', nameEn: 'Police Control', nameBn: 'পুলিশ কন্ট্রোল রুম', number: '100', icon: Shield, color: 'bg-blue-600' },
  { id: 'women', nameEn: 'Women/Child Helpline', nameBn: 'নারী ও শিশু হেল্পলাইন', number: '109', icon: LifeBuoy, color: 'bg-purple-500' },
];

const NEARBY_HOSPITALS = [
  { id: 'h1', nameEn: 'Evercare Hospital', nameBn: 'এভারকেয়ার হাসপাতাল', area: 'Bashundhara R/A', status: 'Open 24/7', phone: '10678', rating: '4.5' },
  { id: 'h2', nameEn: 'Square Hospital', nameBn: 'স্কয়ার হাসপাতাল', area: 'Panthapath', status: 'Open 24/7', phone: '10616', rating: '4.7' },
  { id: 'h3', nameEn: 'Dhaka Medical College', nameBn: 'ঢাকা মেডিকেল কলেজ', area: 'Bakshibazar', status: 'Open 24/7', phone: '02-55165088', rating: '4.2' },
];

export default function EmergencyHome() {
  const [isBilingual, setIsBilingual] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const t = (en: string, bn: string) => isBilingual ? bn : en;

  const handleCall = (number: string) => {
    toast.success(`${t('Dialing', 'কল করা হচ্ছে')}: ${number}`);
    // In real mobile: window.location.href = `tel:${number}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pb-32">
      {/* Portal Header Rule */}
      <section className="pt-4 px-2 space-y-1">
        <StoryBar context="emergency" />
        <PortalIconBar context="logistics" />
      </section>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-8">
        {/* Urgent Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-950/40 via-[#0a0a0a] to-black border border-rose-500/20 p-8 shadow-2xl"
        >
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                {t('Emergency Hub', 'জরুরি সেবা হাব')}
              </span>
              <button 
                onClick={() => setIsBilingual(!isBilingual)}
                className="text-[10px] text-zinc-500 hover:text-white underline underline-offset-4"
              >
                {isBilingual ? 'English' : 'বাংলা'}
              </button>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {t('Immediate Assistance', 'তাত্ক্ষণিক সহায়তা')} <br />
              <span className="text-rose-500">{t('Within Reach', 'আপনার পাশেই')}</span>
            </h1>
            
            <p className="text-zinc-500 text-sm max-w-lg">
              {t(
                'Connect with verifyed emergency services, hospitals, and critical responders across Bangladesh in seconds.',
                'সারা বাংলাদেশের ভেরিফাইড জরুরি সেবা, হাসপাতাল এবং রেসপন্ডারদের সাথে মুহূর্তেই যোগাযোগ করুন।'
              )}
            </p>

            <div className="pt-4">
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input 
                  type="text"
                  placeholder={t('Search hospitals or services...', 'হাসপাতাল বা সেবা খুঁজুন...')}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:border-rose-500/50 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Dial Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {EMERGENCY_SERVICES.map((service, idx) => (
            <motion.button
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleCall(service.number)}
              className="group relative p-5 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-rose-500/30 transition-all text-center"
            >
              <div className={`${service.color} w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-lg shadow-rose-500/10 group-hover:scale-110 transition-transform`}>
                <service.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xs font-bold text-white mb-1">{t(service.nameEn, service.nameBn)}</h3>
              <p className="text-xl font-black text-rose-500">{service.number}</p>
              <PhoneCall className="absolute top-4 right-4 h-3 w-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Hospital Directory */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
                <Activity className="h-5 w-5 text-rose-500" />
                {t('Verified Hospitals Nearby', 'নিকটস্থ ভেরিফাইড হাসপাতাল')}
              </h2>
              <Button variant="link" className="text-rose-500 text-xs">{t('See All', 'সব দেখুন')}</Button>
            </div>

            <div className="grid gap-4">
              {NEARBY_HOSPITALS.map((hospital) => (
                <div 
                  key={hospital.id}
                  className="group p-5 rounded-[2rem] bg-zinc-900/20 border border-white/5 hover:bg-zinc-900/40 transition-all flex items-center justify-between"
                >
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-rose-500">
                      <Navigation className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{t(hospital.nameEn, hospital.nameBn)}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase font-black">
                        <MapPin className="h-3 w-3" />
                        {hospital.area}
                        <span className="w-1 h-1 rounded-full bg-zinc-700" />
                        <Clock className="h-3 w-3" />
                        {hospital.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleCall(hospital.phone)}
                      className="rounded-xl border-white/10 hover:bg-rose-500 hover:text-white"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {hospital.phone}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips / Guides */}
          <div className="space-y-4">
            <h2 className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
              <Info className="h-5 w-5 text-rose-500" />
              {t('First Aid Guides', 'ফার্স্ট এইড গাইড')}
            </h2>
            
            <div className="space-y-3">
              {[
                { title: 'Choking', titleBn: 'শ্বাসরোধ বা গলায় কিছু আটকানো', icon: AlertTriangle },
                { title: 'Severe Bleeding', titleBn: 'তীব্র রক্তপাত', icon: Activity },
                { title: 'Heat Stroke', titleBn: 'হিট স্ট্রোক', icon: Flame },
              ].map((tip, idx) => (
                <button 
                  key={idx}
                  className="w-full p-4 rounded-2xl bg-zinc-900/40 border border-white/5 flex items-center justify-between hover:bg-zinc-900/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
                      <tip.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-zinc-300">{t(tip.title, tip.titleBn)}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-600" />
                </button>
              ))}
            </div>

            <div className="p-6 rounded-[2rem] bg-rose-500/10 border border-rose-500/20 space-y-4">
              <div className="flex items-center gap-2 text-rose-500">
                <UserCheck className="h-5 w-5" />
                <span className="text-xs font-black uppercase">{t('Emergency ID', 'জরুরি আইডি')}</span>
              </div>
              <p className="text-[10px] text-zinc-400 leading-relaxed">
                {t(
                  'Set up your Medical ID to allow responders to view critical health information from your lock screen.',
                  'আপনার মেডিকেল আইডি সেট আপ করুন যাতে জরুরি সময়ে আপনার জরুরি স্বাস্থ্য তথ্য দেখা যায়।'
                )}
              </p>
              <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold h-10">
                {t('Setup Medical ID', 'মেডিকেল আইডি সেটআপ')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
