import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { safeBack } from '@/lib/navigation';

interface BackButtonProps {
  fallback?: string;
  className?: string;
  label?: string;
  showLabel?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  fallback = '/',
  className = '',
  label = 'ফিরে যান',
  showLabel = false
}) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => safeBack(navigate, fallback)}
      className={`inline-flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-[var(--pm-surface)] hover:bg-[var(--pm-surface-hover)] border border-[var(--pm-border)] text-[var(--pm-text)] active:scale-95 transition-all cursor-pointer shadow-xs ${className}`}
      title={label}
      aria-label={label}
    >
      <ArrowLeft className="w-5 h-5 shrink-0" />
      {showLabel && <span className="text-xs font-bold">{label}</span>}
    </button>
  );
};

export default BackButton;
