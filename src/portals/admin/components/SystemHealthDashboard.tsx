import React from 'react';
import { Activity, Server, Database, Globe, Zap, AlertTriangle } from 'lucide-react';
import { useAdminGovernanceStore } from '@/modules/admin/adminGovernanceStore';
import { cn } from '@/lib/utils';

export const SystemHealthDashboard: React.FC = () => {
  const { health } = useAdminGovernanceStore();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 select-none">
      <HealthCard 
        label="API Latency" 
        value={`${health.apiLatency}ms`} 
        icon={Zap} 
        status={health.apiLatency < 100 ? 'healthy' : 'warning'}
        subValue="P99: 142ms"
      />
      <HealthCard 
        label="Throughput" 
        value={`${health.throughput}/s`} 
        icon={Activity} 
        status={health.throughput > 500 ? 'healthy' : 'warning'}
        subValue="Peak: 1.8k/s"
      />
      <HealthCard 
        label="Database Load" 
        value={`${health.dbLoad}%`} 
        icon={Database} 
        status={health.dbLoad < 70 ? 'healthy' : 'warning'}
        subValue="QPS: 840"
      />
      <HealthCard 
        label="Error Rate" 
        value={`${health.errorRate}%`} 
        icon={AlertTriangle} 
        status={health.errorRate < 0.1 ? 'healthy' : 'critical'}
        subValue="0 failures in 10m"
      />
      <HealthCard 
        label="Active Sessions" 
        value={String(health.activeSessions)} 
        icon={Globe} 
        status="healthy"
        subValue="14% Inc (24h)"
      />
    </div>
  );
};

const HealthCard = ({ label, value, icon: Icon, status, subValue }: any) => (
  <div className="p-4 rounded-2xl bg-[var(--pm-surface)]/20 border border-[var(--pm-border)] flex flex-col gap-3 group transition-all">
    <div className="flex items-center justify-between">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center border",
        status === 'healthy' ? "bg-cyan-500/10 border-cyan-500/20 text-cyan-400" :
        status === 'warning' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
        "bg-rose-500/10 border-rose-500/20 text-rose-400"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <span className={cn(
          "w-1.5 h-1.5 rounded-full animate-pulse",
          status === 'healthy' ? "bg-cyan-400" : "bg-rose-400"
      )} />
    </div>
    <div>
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{label}</span>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-lg font-mono font-black text-white">{value}</p>
        <span className="text-[8px] font-bold text-zinc-600 uppercase whitespace-nowrap">{subValue}</span>
      </div>
    </div>
  </div>
);
