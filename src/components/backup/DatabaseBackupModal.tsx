import React, { useState } from 'react';
import { X, Database, HardDrive, Download, UploadCloud, CheckCircle2, Loader2, AlertCircle, ShieldCheck, FileCode } from 'lucide-react';
import { backupService } from '../../services/backupService';
import { useAuth } from '../../context/AuthContext';

interface DatabaseBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseBackupModal: React.FC<DatabaseBackupModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user } = useAuth();
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleCreateBackup = async () => {
    setBackingUp(true);
    setStatusMsg(null);
    try {
      const { backupName, itemCount } = await backupService.createBackupSnapshot();
      setStatusMsg({
        type: 'success',
        text: `সফলভাবে ব্যাকআপ সম্পন্ন হয়েছে! ${itemCount} টি রেকর্ড ফাইল (${backupName}) হিসেবে ডাউনলোড এবং ফায়ারবেস স্টোরেজে সেভ হয়েছে।`
      });
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'ব্যাকআপ তৈরি করা সম্ভব হয়নি।'
      });
    } finally {
      setBackingUp(false);
    }
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    setRestoring(true);
    setStatusMsg(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const { restoredCount } = await backupService.restoreFromJSON(content);
          setStatusMsg({
            type: 'success',
            text: `সফলভাবে ${restoredCount} টি রেকর্ড ফায়ারবেস ডাটাবেসে রিস্টোর করা হয়েছে!`
          });
        } catch (error: any) {
          setStatusMsg({
            type: 'error',
            text: 'অকার্যকর ব্যাকআপ ফাইল বা ডিকোডিং ব্যর্থ হয়েছে।'
          });
        } finally {
          setRestoring(false);
        }
      };
      reader.readAsText(file);
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.message || 'ফাইল পড়া সম্ভব হয়নি।'
      });
      setRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                Firebase Database & Storage Backup
              </h3>
              <p className="text-xs text-zinc-400">
                ডাটাবেস ফাইল ও প্রোডাক্ট ক্লাউড ব্যাকআপ সিস্টেম
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {statusMsg && (
            <div className={`flex items-start gap-3 p-4 rounded-2xl text-xs font-medium border ${
              statusMsg.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {statusMsg.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
              )}
              <div className="leading-relaxed">{statusMsg.text}</div>
            </div>
          )}

          {/* Cloud Storage Information */}
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-[#FF7A00]" />
              ফায়ারবেস ক্লাউড স্টোরেজ সুরক্ষিত ব্যাকআপ
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              আপনার সমস্ত প্রোডাক্ট লিস্টিং, ফিড পোস্ট, ভল্ট ডকুমেন্ট এবং মিডিয়া ফাইল এক ক্লিকে ফায়ারবেস স্টোরেজে ব্যাকআপ রাখুন এবং ডাইরেক্ট JSON ব্যাকআপ ফাইল হিসেবে ডাউনলোড করুন।
            </p>
          </div>

          {/* Backup Action Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-[#FF7A00]/40 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="p-2.5 w-fit rounded-xl bg-[#FF7A00]/10 text-[#FF7A00]">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">১. ব্যাকআপ ডাউনলোড করুন</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  আপনার সম্পূর্ণ অ্যাকাউন্ট ডাটাবেসের একটি কপি ফায়ারবেসে ক্লাউড ব্যাকআপ করুন ও JSON ফাইলে সেভ করুন।
                </p>
              </div>
              <button
                onClick={handleCreateBackup}
                disabled={backingUp}
                className="w-full py-2.5 rounded-xl bg-[#FF7A00] hover:bg-[#e06b00] text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
              >
                {backingUp ? <Loader2 className="w-4 h-4 animate-spin" /> : <HardDrive className="w-4 h-4" />}
                {backingUp ? 'ব্যাকআপ হচ্ছে...' : 'Create Backup Snapshot'}
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-950 border border-white/10 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">২. ফাইল রিস্টোর করুন</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  পূর্বে ডাউনলোড করা JSON ব্যাকআপ ফাইল নির্বাচন করে ডাটাবেসে পুনরায় ইম্পোর্ট করুন।
                </p>
              </div>
              <label className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10">
                {restoring ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileCode className="w-4 h-4 text-emerald-400" />}
                {restoring ? 'রিস্টোর হচ্ছে...' : 'Restore JSON File'}
                <input 
                  type="file" 
                  accept=".json,application/json" 
                  onChange={handleRestoreFile} 
                  disabled={restoring}
                  className="hidden" 
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
