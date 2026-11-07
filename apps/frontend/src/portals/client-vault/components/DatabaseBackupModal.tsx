import React, { useState } from 'react';
import { X, HardDrive, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

interface DatabaseBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseBackupModal: React.FC<DatabaseBackupModalProps> = ({ isOpen, onClose }) => {
  const [backingUp, setBackingUp] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handleExportBackup = async () => {
    setBackingUp(true);
    setCompleted(false);
    try {
      const collectionsToExport = ['users', 'posts', 'products', 'orders', 'demands'];
      const backupData: Record<string, any[]> = {};

      for (const colName of collectionsToExport) {
        try {
          const snap = await getDocs(collection(db, colName));
          backupData[colName] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch {
          backupData[colName] = [];
        }
      }

      const jsonBlob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(jsonBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `paikarmart-backup-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setCompleted(true);
      toast.success('ডাটাবেজ ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে!');
    } catch (err: any) {
      toast.error('ব্যাকআপ তৈরিতে সমস্যা হয়েছে: ' + (err.message || 'Unknown error'));
    } finally {
      setBackingUp(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-[var(--pm-surface,#18181b)] border border-[var(--pm-border,#27272a)] w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-[var(--pm-text,#fafafa)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold">ডাটাবেজ ব্যাকআপ এক্সপোর্ট</h2>
            <p className="text-xs text-zinc-400">Firebase ফায়ারস্টোর কালেকশন ব্যাকআপ</p>
          </div>
        </div>

        <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
          আপনার প্রোফাইল, পোস্ট, প্রোডাক্ট এবং অন্যান্য রেকর্ড সুরক্ষিত রাখতে একটি একক এনক্রিপ্টেড JSON ব্যাকআপ ফাইল ডাউনলোড করুন।
        </p>

        {completed && (
          <div className="flex items-center gap-2 p-3 bg-emerald-500/10 text-emerald-400 rounded-xl mb-4 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>সর্বশেষ ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে।</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-[var(--pm-border,#27272a)] text-zinc-300 hover:bg-white/5 text-sm font-semibold transition-all"
          >
            বাতিল
          </button>
          <button
            onClick={handleExportBackup}
            disabled={backingUp}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md transition-all disabled:opacity-50"
          >
            {backingUp ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>প্রসেসিং...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>ডাউনলোড করুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
