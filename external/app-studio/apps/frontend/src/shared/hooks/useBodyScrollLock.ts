import { useEffect } from 'react';

interface SavedBodyStyles {
  htmlOverflow: string;
  htmlOverscrollBehavior: string;
  bodyOverflow: string;
  bodyOverscrollBehavior: string;
  bodyPaddingRight: string;
}

const OVERLAY_SELECTOR = '.fixed.inset-0, [role="dialog"][aria-modal="true"]';
const TOUCH_PASSTHROUGH_SELECTOR = '.gm-style, canvas, input[type="range"], [data-allow-touch="true"]';

let explicitLockCount = 0;
let domOverlayActive = false;
let isLocked = false;
let savedStyles: SavedBodyStyles | null = null;
let lastTouchX = 0;
let lastTouchY = 0;

function isVisibleOverlay(el: Element): el is HTMLElement {
  if (!(el instanceof HTMLElement)) return false;
  const style = window.getComputedStyle(el);
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    style.pointerEvents === 'none' ||
    style.position !== 'fixed'
  ) {
    return false;
  }
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function getActiveOverlays(): HTMLElement[] {
  if (typeof document === 'undefined' || !document.body) return [];
  const candidates = document.body.querySelectorAll(OVERLAY_SELECTOR);
  const active: HTMLElement[] = [];
  for (let i = 0; i < candidates.length; i += 1) {
    const node = candidates[i];
    if (isVisibleOverlay(node)) {
      active.push(node);
    }
  }
  return active;
}

function findContainingOverlay(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Node)) return null;
  const overlays = getActiveOverlays();
  for (let i = overlays.length - 1; i >= 0; i -= 1) {
    if (overlays[i].contains(target)) {
      return overlays[i];
    }
  }
  return null;
}

function canScrollInDirection(
  target: Element,
  stopAt: HTMLElement,
  axis: 'x' | 'y',
  delta: number
): boolean {
  if (delta === 0) return false;
  let el: HTMLElement | null = target instanceof HTMLElement ? target : target.parentElement;

  while (el && el !== document.body && el !== document.documentElement) {
    const style = window.getComputedStyle(el);
    if (axis === 'y') {
      const overflowY = style.overflowY;
      const isScrollableY =
        (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') &&
        el.scrollHeight > el.clientHeight + 1;
      if (isScrollableY) {
        if (delta < 0 && el.scrollTop > 0) return true;
        if (delta > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) return true;
      }
    } else {
      const overflowX = style.overflowX;
      const isScrollableX =
        (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay') &&
        el.scrollWidth > el.clientWidth + 1;
      if (isScrollableX) {
        if (delta < 0 && el.scrollLeft > 0) return true;
        if (delta > 0 && el.scrollLeft + el.clientWidth < el.scrollWidth - 1) return true;
      }
    }

    if (el === stopAt) break;
    el = el.parentElement;
  }

  return false;
}

function handleWheel(e: WheelEvent) {
  if (e.ctrlKey) return;
  const target = e.target;
  if (!(target instanceof Element)) {
    e.preventDefault();
    return;
  }
  if (target.closest(TOUCH_PASSTHROUGH_SELECTOR)) return;

  const overlay = findContainingOverlay(target);
  if (!overlay) {
    e.preventDefault();
    return;
  }

  const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
  if (isHorizontal) {
    if (!canScrollInDirection(target, overlay, 'x', e.deltaX)) {
      e.preventDefault();
    }
    return;
  }

  if (!canScrollInDirection(target, overlay, 'y', e.deltaY)) {
    e.preventDefault();
  }
}

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    lastTouchX = e.touches[0].clientX;
    lastTouchY = e.touches[0].clientY;
  }
}

function handleTouchMove(e: TouchEvent) {
  if (e.touches.length !== 1) return;
  const touch = e.touches[0];
  const deltaX = lastTouchX - touch.clientX;
  const deltaY = lastTouchY - touch.clientY;
  lastTouchX = touch.clientX;
  lastTouchY = touch.clientY;

  const target = e.target;
  if (!(target instanceof Element)) {
    e.preventDefault();
    return;
  }
  if (target.closest(TOUCH_PASSTHROUGH_SELECTOR)) return;

  const overlay = findContainingOverlay(target);
  if (!overlay) {
    e.preventDefault();
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (!canScrollInDirection(target, overlay, 'x', deltaX)) {
      e.preventDefault();
    }
    return;
  }

  if (!canScrollInDirection(target, overlay, 'y', deltaY)) {
    e.preventDefault();
  }
}

function syncScrollLock() {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const shouldLock = explicitLockCount > 0 || domOverlayActive;
  if (shouldLock === isLocked) return;

  const html = document.documentElement;
  const body = document.body;

  if (shouldLock) {
    const scrollbarWidth = Math.max(0, window.innerWidth - html.clientWidth);
    savedStyles = {
      htmlOverflow: html.style.overflow,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      bodyOverflow: body.style.overflow,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyPaddingRight: body.style.paddingRight,
    };

    html.classList.add('pm-scroll-locked');
    html.setAttribute('data-scroll-locked', 'true');
    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';

    if (scrollbarWidth > 0) {
      const computedPadding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${computedPadding + scrollbarWidth}px`;
    }

    window.addEventListener('wheel', handleWheel, { passive: false, capture: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false, capture: true });
    isLocked = true;
  } else {
    window.removeEventListener('wheel', handleWheel, { capture: true });
    window.removeEventListener('touchstart', handleTouchStart, { capture: true });
    window.removeEventListener('touchmove', handleTouchMove, { capture: true });

    html.classList.remove('pm-scroll-locked');
    html.removeAttribute('data-scroll-locked');

    if (savedStyles) {
      html.style.overflow = savedStyles.htmlOverflow;
      html.style.overscrollBehavior = savedStyles.htmlOverscrollBehavior;
      body.style.overflow = savedStyles.bodyOverflow;
      body.style.overscrollBehavior = savedStyles.bodyOverscrollBehavior;
      body.style.paddingRight = savedStyles.bodyPaddingRight;
      savedStyles = null;
    } else {
      html.style.overflow = '';
      html.style.overscrollBehavior = '';
      body.style.overflow = '';
      body.style.overscrollBehavior = '';
      body.style.paddingRight = '';
    }
    isLocked = false;
  }
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    explicitLockCount += 1;
    syncScrollLock();

    return () => {
      explicitLockCount = Math.max(0, explicitLockCount - 1);
      syncScrollLock();
    };
  }, [locked]);
}

/**
 * Root-level watcher mounted once in AppInner.
 * Automatically locks document/body scrolling whenever ANY modal, drawer,
 * backdrop, or full-page overlay (`fixed inset-0` / `aria-modal="true"`) is active.
 */
export function useGlobalOverlayScrollLock() {
  useEffect(() => {
    if (typeof document === 'undefined' || !document.body) return;

    const evaluateOverlays = () => {
      domOverlayActive = getActiveOverlays().length > 0;
      syncScrollLock();
    };

    evaluateOverlays();

    const observer = new MutationObserver(() => {
      evaluateOverlays();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style', 'hidden', 'aria-hidden', 'aria-modal'],
    });

    window.addEventListener('resize', evaluateOverlays, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', evaluateOverlays);
      domOverlayActive = false;
      syncScrollLock();
    };
  }, []);
}
