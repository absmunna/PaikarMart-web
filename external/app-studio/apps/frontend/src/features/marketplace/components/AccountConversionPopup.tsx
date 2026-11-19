import React, { useState } from 'react';
import { X, Sparkles, UserPlus } from 'lucide-react';

interface AccountConversionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConvert: (password: string) => void;
  guestEmail?: string;
  guestPhone?: string;
}

export const AccountConversionPopup: React.FC<AccountConversionPopupProps> = ({
  isOpen,
  onClose,
  onConvert,
  guestEmail,
  guestPhone,
}) => {
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  const handleRegister = () => {
    if (!password) return;
    setIsRegistering(true);
    setTimeout(() => {
      onConvert(password);
      setIsRegistering(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[var(--pm-card)] text-[var(--pm-text)] border border-[var(--pm-border)] rounded-3xl p-6 w-full max-w-sm shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-2xl bg-[var(--pm-accent)] text-[var(--pm-accent-fg)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <button onClick={onClose} className="text-[var(--pm-muted)] hover:text-[var(--pm-text)] cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-[var(--pm-text)]">
            Save your order history!
          </h3>
          <p className="text-xs text-[var(--pm-muted)]">
            Create an account with your details to track this order and speed up future checkouts.
          </p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Your Identifier</label>
            <input
              type="text"
              readOnly
              value={guestEmail || guestPhone || 'Guest'}
              className="w-full px-4 py-3 rounded-xl bg-[var(--pm-surface)] text-xs text-[var(--pm-muted)] font-mono border border-[var(--pm-border)]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-[var(--pm-muted)] uppercase">Set Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--pm-input)] text-xs text-[var(--pm-text)] placeholder:text-[var(--pm-muted)] border border-[var(--pm-border)] focus:outline-none focus:border-[var(--pm-accent)]"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={!password || isRegistering}
          className="w-full py-3 rounded-xl bg-[var(--pm-accent)] hover:bg-[var(--pm-accent-hover)] disabled:opacity-50 text-[var(--pm-accent-fg)] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
        >
          {isRegistering ? 'Creating Account...' : (
            <>
              <UserPlus className="w-4 h-4" />
              Create Account
            </>
          )}
        </button>
      </div>
    </div>
  );
};
