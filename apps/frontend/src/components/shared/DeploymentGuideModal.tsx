import React, { useState } from 'react';
import { 
  X, 
  Cloud, 
  Server, 
  Globe, 
  Database, 
  Key, 
  Copy, 
  Check, 
  ExternalLink,
  Layers,
  Terminal,
  ShieldCheck
} from 'lucide-react';

interface DeploymentGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentGuideModal: React.FC<DeploymentGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'render' | 'hosting' | 'supabase' | 'firebase'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-[var(--pm-border)]">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--pm-accent)] uppercase tracking-wider mb-1">
              <Cloud className="w-4 h-4" />
              <span>Agreed Free-Tier Cloud Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--pm-text)]">
              PaikarMart Production Deployment Guide
            </h2>
            <p className="text-xs sm:text-sm text-[var(--pm-muted)] mt-0.5">
              Production configuration for Render (Backend), Firebase Hosting (Frontend), Supabase (PostgreSQL), and Firebase Auth.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar border-b border-[var(--pm-border)]">
          {[
            { id: 'overview', label: '1. Architecture', icon: Layers },
            { id: 'render', label: '2. Render Backend', icon: Server },
            { id: 'hosting', label: '3. Firebase Hosting', icon: Globe },
            { id: 'supabase', label: '4. Supabase DB', icon: Database },
            { id: 'firebase', label: '5. Firebase Auth', icon: Key },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[var(--pm-accent)] text-[var(--pm-accent-fg)] shadow-xs'
                    : 'text-[var(--pm-muted)] hover:bg-[var(--pm-surface)] hover:text-[var(--pm-text)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-[var(--pm-text)]">
              Selected Topology & Free Tier Stack Breakdown
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--pm-success)] font-bold text-xs uppercase">
                  <Server className="w-4 h-4" />
                  <span>Backend (Render Free Tier)</span>
                </div>
                <h4 className="text-sm font-bold text-[var(--pm-text)]">Node.js + Express API</h4>
                <p className="text-xs text-[var(--pm-muted)]">
                  Runs on Render Web Service. Configured with <code className="font-mono text-[var(--pm-success)]">render.yaml</code>, CORS, and Gemini AI catalog auditor.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1.5">
                <div className="flex items-center gap-2 text-teal-500 font-bold text-xs uppercase">
                  <Database className="w-4 h-4" />
                  <span>SQL Database (Supabase Free)</span>
                </div>
                <h4 className="text-sm font-bold text-[var(--pm-text)]">PostgreSQL + PostgREST</h4>
                <p className="text-xs text-[var(--pm-muted)]">
                  500MB free PostgreSQL storage, Row-Level Security (RLS), and schema defined in <code className="font-mono text-teal-500">supabase/schema.sql</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--pm-warning)] font-bold text-xs uppercase">
                  <Globe className="w-4 h-4" />
                  <span>Frontend (Firebase Hosting)</span>
                </div>
                <h4 className="text-sm font-bold text-[var(--pm-text)]">Vite + React 19 SPA</h4>
                <p className="text-xs text-[var(--pm-muted)]">
                  High-speed global CDN, automatic SSL certificates, and fast SPA rewrites configured in <code className="font-mono text-[var(--pm-warning)]">firebase.json</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-1.5">
                <div className="flex items-center gap-2 text-[var(--pm-accent)] font-bold text-xs uppercase">
                  <Key className="w-4 h-4" />
                  <span>Auth (Firebase Spark Plan)</span>
                </div>
                <h4 className="text-sm font-bold text-[var(--pm-text)]">Firebase Authentication</h4>
                <p className="text-xs text-[var(--pm-muted)]">
                  50,000 MAU free tier. Pre-provisioned in this project with Google One-Tap/Popup Sign-In and secure session tokens.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Render Backend */}
        {activeTab === 'render' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-[var(--pm-text)] flex items-center justify-between">
              <span>Deploy Backend API to Render Free Tier</span>
              <a 
                href="https://dashboard.render.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-[var(--pm-accent)] flex items-center gap-1 hover:underline"
              >
                <span>Render Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-[var(--pm-border)] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>render.yaml (Pre-configured in Root)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`buildCommand: npm install && npm run build\nstartCommand: node server.js`, 'render_cmd')}
                  className="hover:text-white cursor-pointer"
                >
                  {copiedKey === 'render_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-emerald-400"># Step 1: Connect your repository to Render (Blueprint or Web Service)</p>
              <p>Type: <span className="text-blue-400">Web Service</span></p>
              <p>Environment: <span className="text-blue-400">Node</span></p>
              <p>Build Command: <span className="text-blue-400">npm install && npm run build</span></p>
              <p>Start Command: <span className="text-blue-400">node server.js</span></p>
              <p>Plan: <span className="text-emerald-400">Free</span></p>
              <div className="pt-2 border-t border-slate-800 text-slate-400">
                <p>Environment Variables to set in Render Dashboard:</p>
                <p className="text-yellow-400">SUPABASE_URL=https://your-app.supabase.co</p>
                <p className="text-yellow-400">SUPABASE_ANON_KEY=your-supabase-anon-key</p>
                <p className="text-yellow-400">GEMINI_API_KEY=your-gemini-key</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Firebase Hosting */}
        {activeTab === 'hosting' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-[var(--pm-text)] flex items-center justify-between">
              <span>Deploy Frontend to Firebase Hosting (Spark Plan)</span>
              <a 
                href="https://console.firebase.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-[var(--pm-warning)] flex items-center gap-1 hover:underline"
              >
                <span>Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-[var(--pm-border)] font-mono text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>firebase.json (Pre-configured in Root)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`npm run build\nfirebase deploy --only hosting`, 'firebase_deploy')}
                  className="hover:text-white cursor-pointer"
                >
                  {copiedKey === 'firebase_deploy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-emerald-400"># Deploying Hosting + Hardened Firestore Rules:</p>
              <p><span className="text-slate-500">$</span> npm run build</p>
              <p><span className="text-slate-500">$</span> firebase deploy --only hosting,firestore:rules</p>
              <div className="pt-2 border-t border-slate-800 text-slate-400">
                <p>Public Directory: <span className="text-blue-400">apps/frontend/dist</span> (matched in <span className="text-blue-400">firebase.json</span> & <span className="text-blue-400">vercel.json</span>)</p>
                <p>Firestore Rules: <span className="text-blue-400">firestore.rules</span> (Zero-Trust + Zero-PII @handle isolation)</p>
                <p>SPA Routing: <span className="text-blue-400">Single Page App rewrites enabled</span></p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Supabase PostgreSQL */}
        {activeTab === 'supabase' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-[var(--pm-text)] flex items-center justify-between">
              <span>Execute PostgreSQL Schema in Supabase</span>
              <a 
                href="https://supabase.com/dashboard" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-[var(--pm-accent)] flex items-center gap-1 hover:underline"
              >
                <span>Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h3>

            <p className="text-xs text-[var(--pm-muted)]">
              Open the SQL Editor in your Supabase project dashboard and paste the tables from <code className="font-mono text-[var(--pm-accent)]">supabase/schema.sql</code>.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 border border-[var(--pm-border)] font-mono text-xs space-y-1.5 max-h-56 overflow-y-auto">
              <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
                <span>SQL Schema Tables (supabase/schema.sql)</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(`create table public.profiles (...); create table public.stores (...); create table public.products (...);`, 'sql_code')}
                  className="hover:text-white cursor-pointer"
                >
                  {copiedKey === 'sql_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-teal-400">-- PostgreSQL Tables & Zero-Trust RLS Policies (1:1 with Prisma):</p>
              <p className="text-slate-300">✓ public.profiles & private_user_details (Owner-only PII isolation)</p>
              <p className="text-slate-300">✓ public.public_handle_profiles (Zero-PII @handle showcase view)</p>
              <p className="text-slate-300">✓ public.stores, master_products, seller_listings (PMIN 1:N & Geofence)</p>
              <p className="text-slate-300">✓ public.shipment_waybills, return_pickups, escrow_records, wallet_transactions</p>
              <p className="text-slate-300">✓ public.orders, service_bookings, social_posts & social_comments</p>
            </div>
          </div>
        )}

        {/* Tab 5: Firebase Auth */}
        {activeTab === 'firebase' && (
          <div className="space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-[var(--pm-text)] flex items-center justify-between">
              <span>Firebase Authentication (Configured & Provisioned)</span>
              <a 
                href="https://console.firebase.google.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-xs text-[var(--pm-warning)] flex items-center gap-1 hover:underline"
              >
                <span>Firebase Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </h3>

            <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] space-y-2">
              <div className="flex items-center gap-2 text-[var(--pm-success)] font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Project Provisioned Successfully</span>
              </div>
              <p className="text-xs text-[var(--pm-muted)]">
                Your Firebase project is provisioned with configuration stored in <code className="font-mono text-[var(--pm-warning)] font-bold">firebase-applet-config.json</code>.
              </p>
              <ul className="text-xs text-[var(--pm-muted)] space-y-1 list-disc list-inside">
                <li>Google OAuth Sign-In with popup is enabled.</li>
                <li>Hardened Firestore Security Rules deployed via <code className="font-mono text-[var(--pm-accent)]">firestore.rules</code>.</li>
                <li>User session and profile synchronization configured in <code className="font-mono text-[var(--pm-accent)]">AuthContext.tsx</code>.</li>
              </ul>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
