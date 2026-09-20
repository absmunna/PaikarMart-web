import React, { useState } from 'react';
import { ShieldCheck, Calendar, FileCheck, CheckCircle2, AlertCircle, Upload, Check } from 'lucide-react';
import { toast } from 'sonner';

export function PersonalVerificationTab() {
  const [nidFile, setNidFile] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setNidFile('nid_scanned_front.png');
      setIsUploading(false);
      toast.success('জাতীয় পরিচয়পত্র সফলভাবে আপলোড হয়েছে! / NID uploaded successfully.');
    }, 1200);
  };

  const handleManualUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setNidFile('nid_certified_front.png');
      setIsUploading(false);
      toast.success('ম্যানুয়াল ভেরিফিকেশন ফাইল আপলোড সম্পন্ন! / Document Uploaded!');
    }, 1000);
  };

  const verifications = [
    { name: 'এনআইডি ও আইডেন্টিটি / Identity & NID', desc: 'জাতীয় পরিচয়পত্র এনআইডি দ্বারা ভেরিফাইড', status: 'verified', enStatus: 'Verified (Level 2 Trust)' },
    { name: 'ব্যবসায়ী লাইসেন্স / Trade License', desc: 'সিটি কর্পোরেশন বা স্থানীয় কাউন্সিল ট্রেড লাইসেন্স নং', status: 'verified', enStatus: 'Verified Shop Owner' },
    { name: 'ট্যাক্স ভেরিফিকেশন / TIN & Tax', desc: '১২ ডিজিটের বৈধ ই-টিন নম্বর ভেরিফিকেশন বিবরণ', status: 'pending', enStatus: 'Awaiting Tax Review (Pending)' },
    { name: 'ফ্যাক্টরি বা ডিলারশিপ ভেরিফিকেশন / Business Verification', desc: 'উৎপাদন কারখানা বা বিটুবি সরবরাহ অনুমতিপত্র', status: 'unverified', enStatus: 'Click to Submit Factory Docs' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 text-left">
      {/* List of verifications statuses */}
      <div className="space-y-4">
        {verifications.map((v, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-xs md:text-sm font-black text-white">{v.name}</h4>
              <p className="text-[11px] text-zinc-400 font-medium">{v.desc}</p>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider ${
                v.status === 'verified' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                v.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                'bg-zinc-800 text-zinc-400 border border-white/5'
              }`}>
                {v.status === 'verified' ? 'ভেরিফাইড / Verified' : v.status === 'pending' ? 'রিভিউধীন / Pending' : 'দাখিল করুন / Unverified'}
              </span>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider hidden md:block">
                ({v.enStatus})
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Identity file upload segment */}
      <div className="space-y-6">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 space-y-4">
          <h3 className="text-xs font-black uppercase text-white border-b border-white/5 pb-2">
            অতিরিক্ত ডকুমেন্ট আপলোড / Submit Licensing Docs
          </h3>

          {/* Drag & drop trigger */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-white/10 hover:border-cyan-500/45 bg-zinc-950/40 py-8 px-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all gap-2"
          >
            <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center">
              <Upload className="w-5 h-5 text-zinc-400" />
            </div>
            {isUploading ? (
              <span className="text-[10px] text-zinc-400 font-bold animate-pulse">ফাইল প্রক্রিয়াকরণ হচ্ছে... / Uploading...</span>
            ) : nidFile ? (
              <div className="space-y-1">
                <span className="text-[10px] text-cyan-400 font-black flex items-center gap-1 justify-center">
                  <Check className="w-3.5 h-3.5" />
                  {nidFile}
                </span>
                <span className="text-[8px] text-zinc-500 block">পুনরায় আপলোড করতে ড্রপ করুন</span>
              </div>
            ) : (
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-300 font-black block">নতুন ফাইল ড্র্যাগ ও ড্রপ করুন</span>
                <span className="text-[8px] text-zinc-500 block font-semibold uppercase">PDF, JPG, PNG up to 10MB</span>
              </div>
            )}
          </div>

          <button
            onClick={handleManualUpload}
            className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer"
          >
            ম্যানুয়ালি ফাইল সিলেক্ট করুন / Browse Files
          </button>
        </div>
      </div>
    </div>
  );
}
