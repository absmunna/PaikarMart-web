import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const GlobalNavigation: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === '/';

  return (
    <React.Fragment>
      {/* Edge Swipe - Left for Back Navigation */}
      <div 
        className="fixed left-0 top-0 bottom-0 w-6 z-[600] touch-none select-none"
        onPointerDown={(e) => {
          const startX = e.clientX;
          const handlePointerUp = (upEvent: PointerEvent) => {
            const diff = upEvent.clientX - startX;
            if (diff > 100) navigate(-1);
            window.removeEventListener('pointerup', handlePointerUp);
          };
          window.addEventListener('pointerup', handlePointerUp);
        }}
      />
    </React.Fragment>
  );
};
