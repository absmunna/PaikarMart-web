import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const FloatingNavButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/') return null;

  return (
    <div className="fixed bottom-24 right-4 md:right-6 z-40">
      <button 
        onClick={() => navigate(-1)}
        className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-[var(--pm-border)] flex items-center justify-center text-[var(--pm-text)] shadow-lg hover:bg-white/10 transition-all active:scale-95 cursor-pointer"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};
