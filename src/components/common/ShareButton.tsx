import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ShareButtonProps {
  url: string;
  title: string;
  className?: string;
  variant?: 'ghost' | 'default' | 'outline' | 'secondary' | 'destructive' | 'link' | null | undefined;
  size?: 'default' | 'sm' | 'lg' | 'icon' | null | undefined;
  children?: React.ReactNode;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ url, title, className, variant = "ghost", size = "icon", children }) => {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <Button variant={variant} size={size} onClick={handleShare} className={cn(className)}>
      {children || <Share2 className="w-4 h-4" />}
    </Button>
  );
};
