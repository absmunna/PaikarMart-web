import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Home, ShoppingBag, Grid, ShieldAlert, Settings, LogOut, Check, LogIn, User, Store, Package, Heart, LayoutDashboard, PlusCircle } from 'lucide-react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuth } from '@/features/auth/AuthContext';
import { useAppStore } from '../../store/appStore';
import { useTranslation } from '../../lib/i18n';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout, isSeller } = useAuth();
  const { lang, setLang } = useAppStore();
  const navigate = useNavigate();

  const themes = [
    { id: 'deepDark', name: 'ডিপ ডার্ক', color: 'bg-slate-900 border-slate-700' },
    { id: 'colourful', name: 'কালারফুল', color: 'bg-gradient-to-r from-pink-500 to-indigo-500 border-white/20' },
    { id: 'nakshiLight', name: 'নকশী লাইট', color: 'bg-amber-50/80 border-amber-200' },
    { id: 'greenField', name: 'সবুজ মাঠ', color: 'bg-emerald-950 border-emerald-800' }
  ];

  const handleLogout = () => {
    logout();
    onClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute top-[60px] md:top-[64px] bottom-[64px] lg:bottom-0 left-0 right-0 bg-black/50 z-40"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="absolute top-[60px] md:top-[64px] bottom-[64px] lg:bottom-0 left-0 w-[260px] bg-[var(--pm-surface)]/80 backdrop-blur-2xl z-40 p-5 shadow-2xl border-r border-[var(--pm-border)] flex flex-col gap-4 overflow-y-auto hide-scrollbar"
          >
            <div className="flex items-start justify-between">
              {/* User Profile Card */}
              {isAuthenticated && user ? (
                <Link to="/profile" onClick={onClose} className="flex flex-col gap-2 group">
                  <div className="w-12 h-12 rounded-full border-2 border-[var(--pm-accent)] overflow-hidden shadow-md group-hover:scale-105 transition-transform">
                    <img src={user.avatar || user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Profile" className="w-full h-full object-cover bg-[var(--pm-bg)]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--pm-text)] leading-tight">{user.fullName || user.name || 'ইউজার'}</h3>
                    <span className="text-[10px] text-[var(--pm-accent)] font-medium uppercase tracking-wider">{user.role}</span>
                  </div>
                </Link>
              ) : (
                <Link to="/login" onClick={onClose} className="flex flex-col gap-2 group">
                  <div className="w-12 h-12 rounded-full border-2 border-[var(--pm-border)] border-dashed overflow-hidden shadow-md group-hover:border-[var(--pm-accent)] transition-all flex items-center justify-center bg-[var(--pm-surface-hover)]">
                    <User className="w-6 h-6 text-[var(--pm-text-muted)] group-hover:text-[var(--pm-accent)] transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[var(--pm-text)] leading-tight">{t('guest')}</h3>
                    <span className="text-[10px] text-[var(--pm-accent)] font-medium">{t('login')}</span>
                  </div>
                </Link>
              )}
              <button onClick={onClose} className="p-1 rounded-full bg-[var(--pm-surface-hover)] text-[var(--pm-text-muted)] hover:text-[var(--pm-text)] transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-full h-[1px] bg-[var(--pm-border)]/50 my-1" />

            {/* Navigation Links */}
            <nav className="flex-1 space-y-1">
              <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-sm font-medium text-[var(--pm-text)]" onClick={onClose}><Home className="w-4 h-4 text-[var(--pm-accent)]"/> {t('home')}</NavLink>
              
              {isSeller ? (
                <NavLink to="/seller" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-bold shadow-sm" onClick={onClose}>
                  <LayoutDashboard className="w-4 h-4"/> মার্চেন্ট হাব (Seller)
                </NavLink>
              ) : (
                <NavLink to="/become-seller" className="flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] border border-[var(--pm-accent)]/20 text-sm font-bold" onClick={onClose}>
                  <PlusCircle className="w-4 h-4"/> সেলার একাউন্ট খুলুন
                </NavLink>
              )}

              <NavLink to="/b2c" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-sm font-medium text-[var(--pm-text)]" onClick={onClose}><ShoppingBag className="w-4 h-4 text-[var(--pm-accent)]"/> {t('shop')}</NavLink>
              <NavLink to="/orders" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-sm font-medium text-[var(--pm-text)]" onClick={onClose}><Package className="w-4 h-4 text-[var(--pm-accent)]"/> আমার অর্ডার</NavLink>
              <NavLink to="/wishlist" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-sm font-medium text-[var(--pm-text)]" onClick={onClose}><Heart className="w-4 h-4 text-[var(--pm-accent)]"/> পছন্দের তালিকা</NavLink>
              <NavLink to="/portals" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-sm font-medium text-[var(--pm-text)]" onClick={onClose}><Grid className="w-4 h-4 text-[var(--pm-accent)]"/> {t('portals')}</NavLink>
              <NavLink to="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--pm-surface-hover)] transition-colors text-sm font-medium text-[var(--pm-text)]" onClick={onClose}><Settings className="w-4 h-4 text-[var(--pm-accent)]"/> {t('settings')}</NavLink>
            </nav>
            
            <div className="mt-auto flex flex-col gap-4">
              {/* Theme & Language Settings */}
              <div className="bg-[var(--pm-surface-hover)] p-3 rounded-2xl border border-[var(--pm-border)] flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">{t('themes')}</span>
                  <div className="flex gap-1.5">
                    {themes.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id as any)}
                        className={`w-6 h-6 rounded-full border-2 ${t.color} relative cursor-pointer transition-transform hover:scale-110 flex items-center justify-center shadow-sm`}
                        title={t.name}
                      >
                        {theme === t.id && <Check className="w-3 h-3 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]" />}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="w-full h-[1px] bg-[var(--pm-border)]/50" />

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--pm-text-muted)] uppercase tracking-wider">ভাষা</span>
                  <div className="flex bg-[var(--pm-bg)]/60 p-0.5 rounded-lg border border-[var(--pm-border)]/50">
                    <button
                      onClick={() => setLang('EN')}
                      className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${lang === 'EN' ? 'bg-[var(--pm-accent)] text-white shadow-sm' : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'}`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLang('BN')}
                      className={`px-3 py-1 rounded-md text-[10px] font-black transition-all ${lang === 'BN' ? 'bg-[var(--pm-accent)] text-white shadow-sm' : 'text-[var(--pm-text-muted)] hover:text-[var(--pm-text)]'}`}
                    >
                      বাংলা
                    </button>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              {isAuthenticated && (
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full py-3 text-red-400 font-bold border border-red-500/20 rounded-xl hover:bg-red-500/10 active:scale-95 transition-all text-sm"
                >
                  <LogOut className="w-4 h-4" /> লগআউট
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
