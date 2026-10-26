import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/design-system/components/ui/dialog';
import { Button } from '@/design-system/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthBarrierProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  title?: string;
  description?: string;
}

export const AuthBarrier: React.FC<AuthBarrierProps> = ({
  children,
  fallback,
  title = "Authentication Required",
  description = "Please log in or register to continue with this action."
}) => {
  const { isAuthenticated } = useAuth();
  const [showModal, setShowModal] = React.useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <>{children}</>;
  }

  const handleRestrictedAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  if (fallback) {
    return <div onClickCapture={handleRestrictedAction}>{fallback}</div>;
  }

  return (
    <>
      <div onClickCapture={handleRestrictedAction} className="contents">
        {children}
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px] bg-[var(--pm-surface)] border-[var(--pm-border)] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
              <LogIn className="h-5 w-5 text-[var(--pm-accent)]" />
              {title}
            </DialogTitle>
            <DialogDescription className="text-[var(--pm-muted)]">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              onClick={() => {
                setShowModal(false);
                navigate('/auth/login');
              }}
              className="bg-[var(--pm-accent)] hover:opacity-90 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" /> Login
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                navigate('/auth/register');
              }}
              className="border-[var(--pm-border)] text-[var(--pm-accent)] hover:bg-[var(--pm-accent)]/10 font-bold h-12 rounded-xl flex items-center justify-center gap-2"
            >
              <UserPlus className="h-4 w-4" /> Register
            </Button>
          </div>

          <div className="mt-2 text-center">
            <p className="text-[10px] text-[var(--pm-muted)] uppercase tracking-widest font-black">
              PaikarMart Secure Session
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
