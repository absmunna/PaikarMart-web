import React, { useState } from 'react';
import { BusinessDocument } from '@/types';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  X, 
  Plus,
  Eye,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { uploadUserAsset } from '@/lib/firebase';

interface DocumentsVaultProps {
  documents: BusinessDocument[];
  ownerId: string;
  onUploadDocument: (newDoc: BusinessDocument) => void;
}

export const DocumentsVault: React.FC<DocumentsVaultProps> = ({
  documents,
  ownerId,
  onUploadDocument
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [docType, setDocType] = useState<BusinessDocument['type']>('Trade License');
  const [fileName, setFileName] = useState('');
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submittedFileName = documentFile?.name || fileName.trim();
    if (!submittedFileName) return;
    setUploadError(null);

    let fileUrl: string | null = null;
    try {
      if (documentFile) {
        fileUrl = await uploadUserAsset(documentFile, ownerId, 'documents');
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Document upload failed.');
      return;
    }

    const newDoc: BusinessDocument = {
      id: `doc_${Date.now()}`,
      type: docType,
      fileName: submittedFileName,
      ...(fileUrl ? { fileUrl } : {}),
      ...(documentFile ? { contentType: documentFile.type, sizeBytes: documentFile.size } : {}),
      status: 'pending',
      uploadedAt: 'Just now'
    };

    onUploadDocument(newDoc);
    setFileName('');
    setDocumentFile(null);
    setIsModalOpen(false);
  };

  const getStatusBadge = (status: BusinessDocument['status']) => {
    switch (status) {
      case 'verified':
        return (
          <span className="text-xs font-bold text-[var(--pm-success)] bg-[var(--pm-success-soft)] px-2.5 py-0.5 rounded-full border border-[var(--pm-success)]/30 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            {isBn ? 'ভেরিফাইড' : 'Verified'}
          </span>
        );
      case 'rejected':
        return (
          <span className="text-xs font-bold text-[var(--pm-danger)] bg-[var(--pm-danger-soft)] px-2.5 py-0.5 rounded-full border border-[var(--pm-danger)]/30 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {isBn ? 'পুনরায় আপলোড প্রয়োজন' : 'Rejected'}
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="text-xs font-bold text-[var(--pm-warning)] bg-[var(--pm-warning-soft)] px-2.5 py-0.5 rounded-full border border-[var(--pm-warning)]/30 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {isBn ? 'যাচাইকরণ প্রক্রিয়াধীন' : 'Pending Review'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[var(--pm-card)] p-5 rounded-3xl border border-[var(--pm-border)] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[var(--pm-accent)]" />
            <h3 className="text-base font-black text-[var(--pm-text)]">
              {isBn ? 'ব্যবসার আইনি ডকুমেন্টস ও ভেরিফিকেশন' : 'Legal Business Documents & Compliance'}
            </h3>
          </div>
          <p className="text-xs text-[var(--pm-muted)] mt-0.5">
            {isBn ? 'ট্রেড লাইসেন্স, এনআইডি, টিআইএন ও গাড়ি রেজিস্ট্রেশন ফাইল জমা দিন' : 'Manage Trade License, National ID, TIN certificate & Vehicle permits'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>{isBn ? 'নতুন ডকুমেন্ট আপলোড' : 'Upload Document'}</span>
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-2xl bg-[var(--pm-card)] border border-[var(--pm-border)] shadow-xs space-y-3 hover:border-[var(--pm-accent-border)] transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-[var(--pm-accent-soft)] text-[var(--pm-accent)] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-[var(--pm-text)] truncate">
                    {doc.type}
                  </h4>
                  <p className="text-[11px] text-[var(--pm-muted)] font-mono truncate">
                    {doc.fileName}
                  </p>
                </div>
              </div>

              {getStatusBadge(doc.status)}
            </div>

            <div className="pt-2 border-t border-[var(--pm-border)] flex items-center justify-between text-[11px] text-[var(--pm-muted)] font-mono">
              <span>Uploaded: {doc.uploadedAt}</span>
              <button
                type="button"
                onClick={() => doc.fileUrl && window.open(doc.fileUrl, '_blank', 'noopener,noreferrer')}
                disabled={!doc.fileUrl}
                className="text-[var(--pm-accent)] font-bold hover:underline flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View File</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
          <form onSubmit={handleFormSubmit} className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--pm-border)]">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[var(--pm-accent)]" />
                <h3 className="text-base font-bold text-[var(--pm-text)]">
                  {isBn ? 'ডকুমেন্ট ফাইল জমা দিন' : 'File Business Document'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--pm-muted)] hover:text-[var(--pm-text)] p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[var(--pm-text)] block mb-1.5">
                  Document Category
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] focus:outline-none focus:border-[var(--pm-accent)]"
                >
                  <option value="Trade License">Trade License (ব্যবসায়িক ট্রেড লাইসেন্স)</option>
                  <option value="NID / Passport">National ID / Passport (জাতীয় পরিচয়পত্র)</option>
                  <option value="TIN Certificate">TIN Certificate (ই-টিআইএন সার্টিফিকেট)</option>
                  <option value="Vehicle Registration">Vehicle Registration (গাড়ির কাগজপত্র)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-[var(--pm-text)] block mb-1.5">
                  Select Document File
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    const selected = e.target.files?.[0] || null;
                    setDocumentFile(selected);
                    if (selected) setFileName(selected.name);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--pm-accent-soft)] file:px-2 file:py-1 file:text-xs file:font-bold"
                />
                <p className="mt-1.5 text-[10px] text-[var(--pm-muted)]">PDF, JPG, PNG অথবা WebP</p>
              </div>

              <div>
                <label className="font-bold text-[var(--pm-text)] block mb-1.5">
                  Document Reference / File Name (fallback)
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g., Trade_License_2026_Dhaka.pdf or NID_Front_Back.jpg"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--pm-input)] border border-[var(--pm-border)] text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] focus:outline-none focus:border-[var(--pm-accent)]"
                />
              </div>
            </div>

            {uploadError && (
              <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-500">
                {uploadError}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--pm-border)]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-[var(--pm-surface)] border border-[var(--pm-border)] text-[var(--pm-text)] font-bold text-xs hover:bg-[var(--pm-card-hover)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] text-[var(--pm-accent-fg)] font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Submit Document
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
