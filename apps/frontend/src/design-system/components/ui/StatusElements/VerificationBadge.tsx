import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  verified?: boolean;
}

export const VerificationBadge: React.FC<Props> = ({ verified = true }) => {
  if (!verified) return null;
  return (
    <span className="inline-flex items-center justify-center bg-cyan-500/20 text-cyan-400 rounded-full p-0.5 border border-cyan-500/30">
      <Check size={10} className="stroke-[3]" />
    </span>
  );
};
