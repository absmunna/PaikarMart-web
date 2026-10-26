import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const FloatingNavButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <div className="fixed top-1/2 left-2 z-40">
      <button 
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full glass border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-text)] shadow-lg hover:bg-[var(--pm-surface-hover)] transition-all active:scale-95"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
    </div>
  );
};
