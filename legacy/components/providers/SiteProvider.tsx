'use client';

import Lenis from 'lenis';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { gsap, registerGsap, ScrollTrigger } from '@/lib/gsap';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

interface SiteContextValue {
  /** True once the preloader has handed control to the page. */
  ready: boolean;
  markReady: () => void;
  scrollTo: (target: string | number, offset?: number) => void;
  lockScroll: (locked: boolean) => void;
}

const SiteContext = createContext<SiteContextValue | null>(null);

export function useSite(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>');
  return ctx;
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  registerGsap();

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      syncTouch: false,
      autoRaf: false,
    });
    lenisRef.current = lenis;

    const onLenisScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onLenisScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off('scroll', onLenisScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Hold the page still until the preloader is done.
  useEffect(() => {
    const el = document.documentElement;
    if (ready) {
      el.style.removeProperty('overflow');
      document.body.style.removeProperty('overflow');
      lenisRef.current?.start();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    } else {
      el.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      lenisRef.current?.stop();
    }
  }, [ready]);

  const markReady = useCallback(() => setReady(true), []);

  const lockScroll = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (!lenis) {
      document.body.style.overflow = locked ? 'hidden' : '';
      return;
    }
    if (locked) lenis.stop();
    else lenis.start();
  }, []);

  const scrollTo = useCallback(
    (target: string | number, offset = 0) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
        return;
      }
      if (typeof target === 'number') {
        window.scrollTo({ top: target + offset, behavior: 'smooth' });
        return;
      }
      const el = document.querySelector(target);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({ top, behavior: 'smooth' });
    },
    [],
  );

  const value = useMemo(
    () => ({ ready, markReady, scrollTo, lockScroll }),
    [ready, markReady, scrollTo, lockScroll],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
