import React from 'react';
import { Terminal, Shield, Hash, Clock, User, HardDrive } from 'lucide-react';
import { format } from 'date-fns';
import { useAdminGovernanceStore, AuditLog } from '@/modules/admin/adminGovernanceStore';
import { cn } from '@/lib/utils';

export const AuditLogStream: React.FC = () => {
  const { logs } = useAdminGovernanceStore();

  return (
    <div className="flex flex-col gap-6 w-full select-none">
      <div className="flex items-center justify-between">
         <h3 className="text-xs uppercase tracking-wider text-[var(--pm-text-secondary)] font-bold flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" /> Operational Audit Stream
         </h3>
         <div className="flex bg-black/30 p-1 rounded-xl border border-white/5">
            <button className="px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-[9px] font-black uppercase">Live</button>
            <button className="px-3 py-1.5 rounded-lg text-zinc-600 text-[9px] font-black uppercase">Historic</button>
         </div>
      </div>

      <div className="bg-black/20 border border-[var(--pm-border)] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-zinc-900/40 grid grid-cols-12 text-[10px] font-black uppercase tracking-widest text-zinc-500">
           <div className="col-span-2">Timestamp</div>
           <div className="col-span-2">Actor</div>
           <div className="col-span-3">Action</div>
           <div className="col-span-4">Target Resource</div>
           <div className="col-span-1 text-right">Sev</div>
        </div>
        
        <div className="flex flex-col max-h-[400px] overflow-y-auto">
           {logs.length === 0 ? (
               <div className="p-12 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest italic">
                  Waiting for system telemetry...
               </div>
           ) : (
               logs.map((log: any) => (
                   <div key={log.id} className="p-4 grid grid-cols-12 text-[11px] font-mono hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
                       <div className="col-span-2 text-zinc-600 flex items-center gap-2">
                           <Clock className="w-3 h-3 group-hover:text-cyan-400" />
                           {format(new Date(log.timestamp), 'HH:mm:ss.SS')}
                       </div>
                       <div className="col-span-2 text-white font-bold flex items-center gap-2">
                           <User className="w-3 h-3 text-zinc-700" />
                           {log.actor}
                       </div>
                       <div className="col-span-3 text-cyan-400 font-black flex items-center gap-2">
                           <Hash className="w-3 h-3 text-cyan-900" />
                           {log.action}
                       </div>
                       <div className="col-span-4 text-zinc-400 truncate flex items-center gap-2">
                           <HardDrive className="w-3 h-3 text-zinc-800" />
                           {log.target}
                       </div>
                       <div className="col-span-1 text-right">
                           <span className={cn(
                               "px-1.5 py-0.5 rounded text-[8px] font-black uppercase",
                               log.severity === 'info' ? "bg-zinc-800 text-zinc-400" :
                               log.severity === 'warning' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                               "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                           )}>
                               {log.severity}
                           </span>
                       </div>
                   </div>
               ))
           )}
        </div>
      </div>
    </div>
  );
};
