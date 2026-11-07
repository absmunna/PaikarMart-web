import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop guarantees that whenever the user navigates to any new route/page,
 * the viewport, document, and main containers immediately reset scroll position to top (0, 0).
 */
export const ScrollToTop: React.FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const resetScroll = () => {
      // 1. Reset window scroll
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });

      // 2. Reset document scroll
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }

      // 3. Reset any scrollable main elements or containers
      const scrollContainers = document.querySelectorAll<HTMLElement>(
        'main, #root, [data-scroll-container], .overflow-y-auto, .overflow-y-scroll'
      );
      scrollContainers.forEach((container) => {
        container.scrollTop = 0;
      });
    };

    resetScroll();
    const frameId = requestAnimationFrame(resetScroll);
    return () => cancelAnimationFrame(frameId);
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
