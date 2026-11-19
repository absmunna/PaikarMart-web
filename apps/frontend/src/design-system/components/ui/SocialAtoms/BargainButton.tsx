import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  onClick?: () => void;
}

export const BargainButton: React.FC<Props> = ({ onClick }) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick}
      className="gap-2 border-[var(--pm-accent)]/30 text-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/10"
    >
      <MessageCircle className="w-4 h-4" />
      দরদাম করুন
    </Button>
  );
};
