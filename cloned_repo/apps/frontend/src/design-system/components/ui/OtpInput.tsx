import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const OtpInput: React.FC<OtpInputProps> = ({ length = 6, value, onChange, className }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newValue = value.split('');
    newValue[index] = val.slice(-1);
    const updatedValue = newValue.join('');
    onChange(updatedValue);

    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').slice(0, length);
    if (!/^\d+$/.test(paste)) return;
    onChange(paste);
    inputRefs.current[Math.min(paste.length, length - 1)]?.focus();
  };

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-10 h-12 text-center text-lg font-black text-[var(--pm-text)] bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl focus:border-[var(--pm-accent)] outline-none transition-all font-mono"
        />
      ))}
    </div>
  );
};
