import { cn } from "@/lib/utils";
import { motion } from 'motion/react';

import { useLanguage } from "@/features/language/LanguageContext";
import { useTheme } from "@/features/theme/ThemeContext";
import { ChevronLeft, Settings2, ShieldCheck, HelpCircle, Bell, Info, PanelBottom, Palette, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNavSettingsStore } from "@/app/AppShell/useNavSettingsStore";
import { toast } from "sonner";

export default function SettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { mode, setMode, presets } = useTheme();
  const { navBehavior, setNavBehavior } = useNavSettingsStore();

  const preferencesItems = [
    { icon: Bell, label: 'Push Notifications', status: 'Enabled', color: 'text-blue-500' },
    { icon: ShieldCheck, label: 'Biometric Login', status: 'Disabled', color: 'text-green-500' },
    { icon: Info, label: 'Version Information', status: 'v2.4.0-build', color: 'text-zinc-500' }
  ];

  const supportItems = [
    { icon: HelpCircle, label: 'Help Center', path: '/faq' },
    { icon: Info, label: 'Terms of Use', path: '/terms' }
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-[480px] mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-card/50 border border-white/10 flex items-center justify-center hover:bg-card transition-all cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            {t('profile.settings')}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 pt-6 space-y-10">
        {/* Navigation Appearance Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 px-2">
             <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Navigation Apperance</h2>
             <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

             <div className="space-y-4">
                <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-primary">
                        <PanelBottom className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-sm font-bold text-foreground">Bottom Nav Behavior</span>
                         <span className="text-[10px] text-muted-foreground">Auto-hide on scroll vs Fixed</span>
                      </div>
                   </div>
                   
                   <div className="flex items-center gap-2 bg-background p-1 rounded-xl border border-border">
                     <button 
                       onClick={() => setNavBehavior('auto-hide')}
                       className={cn(
                         "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                         navBehavior === 'auto-hide' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                       )}
                     >
                       Responsive
                     </button>
                     <button 
                       onClick={() => setNavBehavior('fixed')}
                       className={cn(
                         "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                         navBehavior === 'fixed' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                       )}
                     >
                       Fixed
                     </button>
                   </div>
                </div>
            </div>
        </motion.div>

        {/* 🎨 Theme Presets Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 px-2">
             <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-1.5">
               <Palette className="w-3.5 h-3.5" />
               Theme Presets / থিম ও রঙ
             </h2>
             <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {presets.map((preset) => {
              const isSelected = mode === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setMode(preset.id);
                    toast.success(
                      `থিম পরিবর্তন: ${preset.labelBn}! / Theme set to ${preset.label}!`
                    );
                  }}
                  className={cn(
                    "flex flex-col items-start gap-2.5 p-4 rounded-2xl bg-card border text-left transition-all relative cursor-pointer group hover:bg-accent/40",
                    isSelected 
                      ? "border-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.15)] ring-1 ring-primary" 
                      : "border-border hover:border-border-hover"
                  )}
                >
                  {/* Swatch color indicators */}
                  <div className="flex items-center justify-between w-full">
                    <div className="flex gap-1">
                      {preset.swatch.map((color, i) => (
                        <div 
                          key={i} 
                          className="w-3.5 h-3.5 rounded-full border border-black/20" 
                          style={{ backgroundColor: color }} 
                        />
                      ))}
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-xs font-black block text-foreground group-hover:text-primary transition-colors">
                      {preset.labelBn}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground block">
                      {preset.label}
                    </span>
                    <p className="text-[9px] text-muted-foreground/80 leading-snug mt-1">
                      {preset.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 px-2">
             <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Permissions & Alerts</h2>
             <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

          <div className="space-y-4">
             {preferencesItems.map((item, idx) => {
               const Icon = item.icon;
               return (
                 <button key={idx} className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border hover:bg-accent transition-all cursor-pointer group">
                   <div className="flex items-center gap-4">
                      <div className={cn("w-10 h-10 rounded-xl bg-background flex items-center justify-center", item.color)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-bold text-foreground">{item.label}</span>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">{item.status}</span>
                 </button>
               );
             })}
          </div>
        </motion.div>

        {/* Support Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 px-2">
             <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Support & Feedback</h2>
             <div className="h-[1px] flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-3 pb-24">
             {supportItems.map((item, idx) => {
               const Icon = item.icon;
               return (
                 <button 
                   key={idx} 
                   onClick={() => navigate(item.path)}
                   className="flex flex-col items-center gap-3 p-6 rounded-3xl bg-card border border-border hover:border-primary/50 hover:bg-accent transition-all cursor-pointer"
                 >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-foreground">{item.label}</span>
                 </button>
               );
             })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
