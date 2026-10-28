import { useEffect } from 'react';
import { useDomainViewStore } from '@/store/domainViewStore';

export interface DomainViewMode {
  isWwwDomain: boolean;
  isDesktopView: boolean;
  hostname: string;
  toggleViewMode: () => void;
  setDesktopView: (value: boolean) => void;
}

/**
 * Custom hook to detect and switch domain routing for Paikar Mart:
 * - www.paikarmart.com -> Desktop Web Experience
 * - paikarmart.com -> Mobile App Screen / Super App UI
 */
export const useDomainViewMode = (): DomainViewMode => {
  const isDesktopView = useDomainViewStore((s) => s.isDesktopView);
  const isWwwDomain = useDomainViewStore((s) => s.isWwwDomain);
  const hostname = useDomainViewStore((s) => s.hostname);
  const initDomainView = useDomainViewStore((s) => s.initDomainView);
  const toggleViewMode = useDomainViewStore((s) => s.toggleViewMode);
  const setDesktopView = useDomainViewStore((s) => s.setDesktopView);

  useEffect(() => {
    initDomainView();
  }, []);

  return {
    isWwwDomain,
    isDesktopView,
    hostname,
    toggleViewMode,
    setDesktopView
  };
};
