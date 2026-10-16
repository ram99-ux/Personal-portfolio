'use client';

import { useEffect, useRef, useState } from 'react';

import { useSite } from '@/components/providers/SiteProvider';
import { useFrameVariant } from '@/hooks/useFrameVariant';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { getLoader } from '@/lib/frame-loader';
import { gsap, registerGsap } from '@/lib/gsap';
import { siteConfig } from '@/config/site';

const PHASES = ['Decoding frames', 'Compositing scenes', 'Calibrating motion', 'Ready'] as const;

export function Preloader() {
  const { markReady } = useSite();
  const smallVariant = useFrameVariant();
  const reducedMotion = usePrefersReducedMotion();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const displayed = useRef({ value: 0 });
  const doneRef = useRef(false);

  const [percent, setPercent] = useState(0);
  const [gone, setGone] = useState(false);

  registerGsap();

  /* Load the hero sequence and track progress. */
  useEffect(() => {
    if (smallVariant === null) return;

    const loader = getLoader('hero', smallVariant);
    let raf = 0;
    let target = 0;

    // Frames decode in order, so waiting for the first GATE of the sequence is
    // enough to scroll smoothly — the tail keeps streaming behind the reveal.
    const GATE = 0.5;

    const unsubscribe = loader.onProgress((ratio) => {
      target = Math.min(1, ratio / GATE);
    });

    void loader.load(smallVariant ? 6 : 10);

    // Fonts count for a slice of the bar so the reveal never flashes fallback type.
    let fontsReady = false;
    if (typeof document !== 'undefined' && 'fonts' in document) {
      void document.fonts.ready.then(() => {
        fontsReady = true;
      });
    } else {
      fontsReady = true;
    }

    const start = performance.now();

    const tick = () => {
      // Never let the bar finish faster than 900ms — a 3-frame flash reads as broken.
      const timeFloor = Math.min(1, (performance.now() - start) / 900);
      const goal = Math.min(target * (fontsReady ? 1 : 0.92), timeFloor);
      displayed.current.value += (goal - displayed.current.value) * 0.09;

      const pct = Math.min(100, Math.round(displayed.current.value * 100));
      setPercent(pct);
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${displayed.current.value})`;
      }

      if (target >= 1 && fontsReady && displayed.current.value > 0.995) {
        setPercent(100);
        if (barRef.current) barRef.current.style.transform = 'scaleX(1)';
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;

      if (reducedMotion) {
        setGone(true);
        markReady();
        return;
      }

      const root = rootRef.current;
      if (!root) {
        setGone(true);
        markReady();
        return;
      }

      gsap
        .timeline({
          defaults: { ease: 'expo.inOut' },
          onComplete: () => {
            setGone(true);
            markReady();
          },
        })
        .to('[data-preloader-fade]', { autoAlpha: 0, y: -18, duration: 0.7, stagger: 0.05 })
        .to(root, { yPercent: -100, duration: 1.15 }, '-=0.25')
        .set(root, { pointerEvents: 'none' });
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      unsubscribe();
    };
  }, [smallVariant, markReady, reducedMotion]);

  /* Intro animation for the loader itself. */
  useIsomorphicLayoutEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-preloader-mark] span', {
        yPercent: 120,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.055,
      });
      gsap.from('[data-preloader-meta]', {
        autoAlpha: 0,
        y: 12,
        duration: 0.9,
        delay: 0.25,
        ease: 'expo.out',
      });
    }, rootRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  if (gone) return null;

  const phase = PHASES[Math.min(PHASES.length - 1, Math.floor((percent / 100) * PHASES.length))];
  const mark = siteConfig.shortName.toUpperCase();

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-void px-6 py-8 md:px-12 md:py-12"
      role="status"
      aria-live="polite"
      aria-label={`Loading, ${percent} percent`}
    >
      <div
        data-preloader-fade
        className="eyebrow flex items-center justify-between"
        data-preloader-meta
      >
        <span>{siteConfig.role}</span>
        <span className="hidden sm:inline">{siteConfig.location}</span>
      </div>

      <div className="flex flex-col items-center justify-center gap-6">
        <h1
          data-preloader-mark
          className="display-xl flex overflow-hidden text-bone"
          aria-label={siteConfig.name}
        >
          {mark.split('').map((c, i) => (
            <span key={`${c}-${i}`} className="inline-block">
              {c}
            </span>
          ))}
        </h1>
        <div data-preloader-fade className="w-full max-w-md">
          <div className="h-px w-full overflow-hidden bg-white/10">
            <div
              ref={barRef}
              className="h-full w-full origin-left bg-emerald-glow"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>

      <div data-preloader-fade className="flex items-end justify-between">
        <span className="eyebrow tabular-nums">{phase}</span>
        <span
          ref={counterRef}
          className="font-display text-[clamp(2.5rem,9vw,7rem)] leading-[0.8] tabular-nums text-bone"
        >
          {String(percent).padStart(3, '0')}
        </span>
      </div>
    </div>
  );
}
