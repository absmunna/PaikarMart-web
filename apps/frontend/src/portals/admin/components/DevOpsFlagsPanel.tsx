import React, { useState } from 'react';
import { 
  GitBranch, Terminal, Sliders, Shield, Zap, Server, 
  CheckCircle2, AlertCircle, RefreshCw, Layers, Database, Lock
} from 'lucide-react';
import { useAdminGovernanceStore, FeatureFlagItem } from '@/modules/admin';
import { toast } from 'sonner';

export const DevOpsFlagsPanel: React.FC = () => {
  const { featureFlags, toggleFeatureFlagAction, health, logs, isLoading, fetchAllAdminData } = useAdminGovernanceStore();
  const [updatingKey, setUpdatingKey] = useState<string | null>(null);

  const handleToggle = async (flag: FeatureFlagItem) => {
    setUpdatingKey(flag.key);
    try {
      const nextState = !flag.enabled;
      const ok = await toggleFeatureFlagAction(flag.key, nextState, flag.rolloutPercentage);
      if (ok) {
        toast.success(`ফিচার ফ্ল্যাগ "${flag.label}" এখন ${nextState ? 'সক্রিয় (ENABLED)' : 'নিষ্ক্রিয় (DISABLED)'}`);
      }
    } catch (e) {
      toast.error('ফিচার ফ্ল্যাগ আপডেট করতে ত্রুটি হয়েছে');
    } finally {
      setUpdatingKey(null);
    }
  };

  const handleRolloutChange = async (flag: FeatureFlagItem, newPercentage: number) => {
    setUpdatingKey(flag.key);
    try {
      await toggleFeatureFlagAction(flag.key, flag.enabled, newPercentage);
      toast.success(`${flag.key} রোলআউট পার্সেন্টেজ ${newPercentage}% করা হয়েছে`);
    } catch (e) {
      toast.error('রোলআউট আপডেট ব্যর্থ হয়েছে');
    } finally {
      setUpdatingKey(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* DevOps CI/CD & Infrastructure Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--pm-text-muted)] font-medium">Git Production Branch</p>
            <p className="text-sm font-mono font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
              <GitBranch className="w-4 h-4" /> {health.gitCommit || 'main@8e4f1a2'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Render + Vercel Webhook Auto-Sync</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--pm-text-muted)] font-medium">Supabase Pooler Latency</p>
            <p className="text-sm font-mono tabular-nums font-bold text-[var(--pm-text)] mt-1">
              {health.apiLatency} ms (PgBouncer: 6543)
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Status: {health.dbStatus || 'Connected'}</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Database className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--pm-text-muted)] font-medium">Active User Traffic</p>
            <p className="text-sm font-mono tabular-nums font-bold text-[var(--pm-text)] mt-1">
              {health.activeSessions} Sessions
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Error Rate: {health.errorRate}%</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <Server className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--pm-text-muted)] font-medium">System Uptime SLA</p>
            <p className="text-sm font-mono font-bold text-amber-400 mt-1">
              {health.uptime || '99.98%'}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1">Zero-Downtime Rollout</p>
          </div>
          <button 
            onClick={() => fetchAllAdminData()}
            className="p-2 rounded-xl bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh DevOps State"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Developer Operations Knowledge Callout */}
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs space-y-2">
        <div className="flex items-center gap-2 text-zinc-200 font-bold">
          <Terminal className="w-4 h-4 text-[var(--pm-accent)]" />
          <span>Global Social-Commerce DevOps Architecture Guide</span>
        </div>
        <p className="text-zinc-400 leading-relaxed">
          বিশ্বমানের মাল্টি-ভেন্ডর প্ল্যাটফর্ম (যেমন Shopee বা Tokopedia) সরাসরি প্রোডাকশন কোড এডিটের ঝুঁকি না নিয়ে <strong>Trunk-Based CI/CD + Feature Flags + Remote Schema Migrations</strong> ব্যবহার করে। নতুন ফিচার ব্যাকএন্ডে চালু করার পূর্বে ফ্ল্যাগ দিয়ে রোলআউট পার্সেন্টেজ নির্ধারণ করা হয়, যাতে কোড রিলিজ ছাড়াই যেকোনো মুহূর্ত ক্র্যাশ থেকে সিস্টেম রক্ষা করা যায়।
        </p>
      </div>

      {/* Dynamic Feature Flags Management */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--pm-accent)]" />
            <h3 className="text-sm font-bold text-[var(--pm-text)]">লাইভ ফিচার ফ্ল্যাগস ও রিমোট কন্ট্রোল (Feature Flags)</h3>
          </div>
          <span className="text-xs text-zinc-500">
            {featureFlags.filter(f => f.enabled).length} টি ফিচার প্রোডাকশনে সক্রিয়
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featureFlags.map((flag) => (
            <div 
              key={flag.key}
              className={`p-5 rounded-2xl bg-[var(--pm-surface)] border transition-all ${
                flag.enabled 
                  ? 'border-emerald-500/30 bg-emerald-500/[0.02]' 
                  : 'border-[var(--pm-border)] opacity-85'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-bold text-[var(--pm-text)]">{flag.label}</h4>
                    <span className="text-xs text-zinc-500 font-mono">({flag.key})</span>
                  </div>
                  <p className="text-xs text-[var(--pm-text-muted)] leading-relaxed">
                    {flag.description}
                  </p>
                </div>

                {/* Hot-Toggle Switch Button */}
                <button
                  onClick={() => handleToggle(flag)}
                  disabled={updatingKey === flag.key}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${
                    flag.enabled ? 'bg-emerald-500' : 'bg-zinc-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                    flag.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Rollout percentage and metadata */}
              <div className="mt-4 pt-3 border-t border-[var(--pm-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                  <span>রোলআউট পরিধি:</span>
                  <select
                    value={flag.rolloutPercentage}
                    onChange={(e) => handleRolloutChange(flag, Number(e.target.value))}
                    disabled={!flag.enabled || updatingKey === flag.key}
                    className="bg-black/30 border border-zinc-700 rounded px-2 py-0.5 text-xs text-white outline-none"
                  >
                    <option value={10}>১০% ইউজার ট্রাফিক</option>
                    <option value={25}>২৫% ইউজার ট্রাফিক</option>
                    <option value={50}>৫০% ইউজার ট্রাফিক</option>
                    <option value={100}>১০০% সর্বজনীন সক্রিয়</option>
                  </select>
                </div>

                <span className="text-[11px] text-zinc-500 font-mono">
                  আপডেট: {new Date(flag.updatedAt).toLocaleTimeString('bn-BD')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Stream */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-bold text-[var(--pm-text)]">অ্যাডমিন অ্যাকশন অডিট ট্রেইল (Immutable Audit Logs)</h3>
        </div>

        <div className="rounded-2xl bg-[var(--pm-surface)] border border-[var(--pm-border)] divide-y divide-[var(--pm-border)] max-h-72 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-4 text-center text-xs text-zinc-500">কোনো লগ রেকর্ড পাওয়া যায়নি।</div>
          ) : (
            logs.slice(0, 15).map((log) => (
              <div key={log.id} className="p-3 text-xs flex items-center justify-between gap-4">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold text-[var(--pm-text)]">{log.action}</span>
                    <span className="text-zinc-500">·</span>
                    <span className="text-zinc-400 truncate">{log.target}</span>
                  </div>
                  {log.details && (
                    <p className="text-[11px] text-zinc-500 truncate">{log.details}</p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString('bn-BD')}
                  </span>
                  <p className="text-[10px] text-zinc-400">{log.actor}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
