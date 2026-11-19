import { useState, useEffect } from 'react';

export interface UseScrollVisibilityOptions {
  threshold?: number;
}

export function useScrollVisibility({ threshold = 400 }: UseScrollVisibilityOptions = {}): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial position
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isVisible;
}

export default useScrollVisibility;
