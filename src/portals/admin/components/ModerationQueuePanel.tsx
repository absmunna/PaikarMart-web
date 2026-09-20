import React, { useState } from 'react';
import { ShieldAlert, AlertCircle, CheckCircle2, XCircle, MoreVertical, Flag, MessageSquare, Box, User } from 'lucide-react';
import { useAdminGovernanceStore, ModerationItem } from '@/modules/admin/adminGovernanceStore';
import { adminGovernanceService } from '@/modules/admin/adminGovernanceService';
import { cn } from '@/lib/utils';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const ModerationQueuePanel: React.FC = () => {
  const { moderationQueue } = useAdminGovernanceStore();
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | 'suspend' | null>(null);

  const handleAction = (item: ModerationItem, action: 'approve' | 'reject' | 'suspend') => {
    setSelectedItem(item);
    setConfirmAction(action);
  };

  const executeAction = () => {
    if (selectedItem && confirmAction) {
        adminGovernanceService.resolveModeration(selectedItem.id, confirmAction);
        setSelectedItem(null);
        setConfirmAction(null);
    }
  };

  const TYPE_ICONS: Record<ModerationItem['type'], any> = {
    post: MessageSquare,
    product: Box,
    user: User,
    service: ShieldAlert
  };

  return (
    <div className="flex flex-col gap-6 w-full">
       <div className="flex items-center justify-between">
           <h3 className="text-xs uppercase tracking-wider text-rose-500 font-black flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> Moderation Control Queue
           </h3>
           <span className="text-[10px] font-black uppercase text-zinc-500">{moderationQueue.filter((i: any) => i.status === 'pending').length} Actions Required</span>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {moderationQueue.map((item: any) => {
               const Icon = TYPE_ICONS[item.type as keyof typeof TYPE_ICONS];
               if (item.status === 'resolved') return null;

               return (
                   <div key={item.id} className="p-5 rounded-3xl bg-[var(--pm-surface)]/40 border border-[var(--pm-border)] flex flex-col gap-4 group hover:border-rose-500/20 transition-all">
                       <div className="flex items-start justify-between">
                           <div className="flex items-center gap-3">
                               <div className="p-2 rounded-xl bg-zinc-900 border border-white/5 text-zinc-500">
                                   <Icon className="w-4 h-4" />
                               </div>
                               <div>
                                   <p className="text-[11px] font-black text-white uppercase tracking-tight">{item.type} Violation</p>
                                   <p className="text-[9px] text-zinc-500 font-bold uppercase mt-0.5">ID: {item.id}</p>
                               </div>
                           </div>
                           <span className={cn(
                               "px-2 py-0.5 rounded text-[8px] font-black uppercase border",
                               item.status === 'pending' ? "bg-amber-500/10 text-amber-500 border-amber-500/30" : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                           )}>
                               {item.status}
                           </span>
                       </div>

                       <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                           <p className="text-[10px] text-zinc-400 leading-relaxed italic truncate">
                              "{item.contentPreview}"
                           </p>
                       </div>

                       <div className="flex items-center gap-2 mt-2">
                            <button 
                                onClick={() => handleAction(item, 'approve')}
                                className="flex-1 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border border-cyan-500/20"
                            >
                                Allow
                            </button>
                            <button 
                                onClick={() => handleAction(item, 'reject')}
                                className="flex-1 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border border-rose-500/20"
                            >
                                Reject
                            </button>
                            <button 
                                onClick={() => handleAction(item, 'suspend')}
                                className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-black text-zinc-400 text-[9px] font-black uppercase transition-all cursor-pointer border border-white/5"
                            >
                                <XCircle className="w-3.5 h-3.5" />
                            </button>
                       </div>
                   </div>
               );
           })}
       </div>

       {/* CONFIRMATION MODAL */}
       <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
           <DialogContent className="bg-[#0c0f17] border-white/10 text-white">
               <DialogHeader>
                   <DialogTitle className="flex items-center gap-2 text-rose-500 uppercase font-black text-sm">
                       <AlertCircle className="w-5 h-5" /> Confirm Policy Execution
                   </DialogTitle>
                   <DialogDescription className="text-zinc-400 text-xs mt-2 uppercase font-bold tracking-tight">
                       You are about to perform a <span className="text-white">[{confirmAction}]</span> action on item <span className="text-white">#{selectedItem?.id}</span>. This will be logged in the permanent audit stream.
                   </DialogDescription>
               </DialogHeader>
               <DialogFooter className="mt-6 flex items-center gap-3">
                   <Button variant="outline" onClick={() => setSelectedItem(null)} className="flex-1 border-white/10 uppercase font-black text-[10px]">Cancel</Button>
                   <Button onClick={executeAction} className="flex-1 bg-rose-500 hover:bg-rose-600 text-white uppercase font-black text-[10px]">Execute Policy</Button>
               </DialogFooter>
           </DialogContent>
       </Dialog>
    </div>
  );
};
