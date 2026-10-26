import { cn } from "@/lib/utils";
import { motion } from 'motion/react';
import { useLanguage } from "@/features/language/LanguageContext";
import { useTheme } from "@/features/theme/ThemeContext";
import { 
  ChevronLeft, Settings2, ShieldCheck, HelpCircle, Bell, Info, 
  Palette, Check, User, Lock, Eye, Link2, 
  Trash2, LogOut, ChevronRight, Smartphone, Mail
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function SettingsPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, setMode, presets } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    toast.success("Logged out successfully");
  };

  const accountSections = [
    {
      title: "Account Security",
      items: [
        { icon: Lock, label: "Change Password", desc: "Update your login password", color: "text-amber-500" },
        { icon: ShieldCheck, label: "Two-Factor Auth", desc: "Add extra security layer", color: "text-emerald-500", status: "Off" },
        { icon: Smartphone, label: "Trusted Devices", desc: "Manage your active sessions", color: "text-blue-500" },
      ]
    },
    {
      title: "Privacy & Data",
      items: [
        { icon: Eye, label: "Profile Visibility", desc: "Control who sees your profile", color: "text-purple-500", status: "Public" },
        { icon: Mail, label: "Email Notifications", desc: "Manage marketing emails", color: "text-rose-500", status: "On" },
      ]
    },
    {
      title: "Integrations",
      items: [
        { icon: Link2, label: "Linked Accounts", desc: "Google, Facebook, Twitter", color: "text-indigo-500" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/10">
        <div className="max-w-[600px] mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-2xl bg-card border border-white/10 flex items-center justify-center hover:bg-card transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h1 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            {t('profile.settings') || "Settings"}
          </h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-4 pt-6 space-y-10">
        {/* User Profile Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[2.5rem] bg-gradient-to-br from-card to-zinc-900 border border-border flex items-center gap-5 shadow-xl shadow-black/20"
        >
          <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center text-2xl font-black text-primary-foreground">
            {user?.name?.[0] || "U"}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-black text-white">{user?.name}</h2>
            <p className="text-xs font-bold text-zinc-500 tracking-tight">{user?.email}</p>
          </div>
          <button 
            onClick={() => navigate("/profile")}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider hover:bg-white/10 transition-all"
          >
            Edit Profile
          </button>
        </motion.div>

        {/* Dynamic Account Sections */}
        {accountSections.map((section, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 px-2">
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{section.title}</h2>
              <div className="h-[1px] flex-1 bg-zinc-800" />
            </div>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-3xl bg-card border border-border hover:bg-zinc-800/50 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2.5 rounded-2xl bg-zinc-900", item.color)}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">{item.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status && <span className="text-[10px] font-black text-zinc-600 uppercase">{item.status}</span>}
                    <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}

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
               Visual Experience
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
                    setMode(preset.id as any);
                    toast.success(
                      `Theme set to ${preset.label}!`
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

        {/* Danger Zone */}
        <div className="pt-6 space-y-4 pb-24">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-4 rounded-3xl bg-rose-500/5 border border-rose-500/10 text-rose-500 hover:bg-rose-500/10 transition-all font-bold text-sm group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-2xl bg-rose-500/10">
                <LogOut className="h-5 w-5" />
              </div>
              <span>Sign Out from PaikarMart</span>
            </div>
            <ChevronRight className="h-4 w-4" />
          </button>

          <button className="w-full flex items-center justify-between p-4 rounded-3xl bg-zinc-900 border border-zinc-800 text-zinc-600 hover:text-rose-600 hover:bg-rose-500/5 hover:border-rose-500/20 transition-all font-bold text-sm group">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-2xl bg-zinc-800 group-hover:bg-rose-500/10 transition-all">
                <Trash2 className="h-5 w-5" />
              </div>
              <span>Delete Account Permanently</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
