'use client';

import { useEffect, useRef, useState } from 'react';

import { useIsCoarsePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';

/**
 * Two-layer cursor: a small solid dot that tracks 1:1 and a lagging ring that
 * expands over interactive elements. Hidden entirely on touch devices.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const coarse = useIsCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || coarse || reducedMotion) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { ...target };
    let raf = 0;
    let visible = false;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
      dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;

      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest('a, button, input, textarea, [data-cursor="grow"]');
      ring.dataset.state = interactive ? 'grow' : 'idle';
    };

    const onLeave = () => {
      visible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const loop = () => {
      ringPos.x += (target.x - ringPos.x) * 0.16;
      ringPos.y += (target.y - ringPos.y) * 0.16;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, [mounted, coarse, reducedMotion]);

  if (!mounted || coarse || reducedMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[80] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-emerald-soft opacity-0 transition-opacity duration-300"
      />
      <div
        ref={ringRef}
        data-state="idle"
        className="fixed left-0 top-0 h-9 w-9 rounded-full border border-white/30 opacity-0 transition-[width,height,border-color,opacity,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] data-[state=grow]:h-16 data-[state=grow]:w-16 data-[state=grow]:border-emerald-soft/60 data-[state=grow]:bg-emerald-soft/5"
      />
    </div>
  );
}
