'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { useFrameVariant } from '@/hooks/useFrameVariant';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { getLoader } from '@/lib/frame-loader';
import { gsap, registerGsap, ScrollTrigger } from '@/lib/gsap';
import { sequences, type SequenceId } from '@/lib/sequences';
import { clamp } from '@/utils/math';
import { cn } from '@/utils/cn';

interface FrameSequenceProps {
  sequence: SequenceId;
  /** Total scroll distance of the section, e.g. '320vh'. */
  scrollLength?: string;
  /** Start loading immediately instead of waiting for the viewport. */
  eager?: boolean;
  /** Free memory once the section is well out of view. */
  releaseWhenAway?: boolean;
  /** 0 → untouched footage, 1 → black. */
  dim?: number;
  /** Extra classes on the outer <section>. */
  className?: string;
  /** Sticky overlay content rendered above the canvas. */
  children?: ReactNode;
  overlayClassName?: string;
  /** Scroll fraction reserved for the pinned canvas, 0–1. */
  scrubRange?: [number, number];
  id?: string;
  vignette?: boolean;
}

const DPR_CAP = 2;

export function FrameSequence({
  sequence,
  scrollLength = '320vh',
  eager = false,
  releaseWhenAway = true,
  dim = 0.35,
  className,
  children,
  overlayClassName,
  scrubRange = [0, 1],
  id,
  vignette = true,
}: FrameSequenceProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const frameRef = useRef({ index: 0 });
  const drawnRef = useRef(Number.NaN);
  const rafRef = useRef(0);

  const smallVariant = useFrameVariant();
  const reducedMotion = usePrefersReducedMotion();

  registerGsap();

  /* ----------------------------------------------------------------- */
  /*  Canvas painting                                                    */
  /* ----------------------------------------------------------------- */
  useEffect(() => {
    if (smallVariant === null) return;

    const canvas = canvasRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !sticky) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const loader = getLoader(sequence, smallVariant);
    let cancelled = false;

    const drawCover = (img: HTMLImageElement, alpha: number) => {
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.globalAlpha = alpha;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
      ctx.globalAlpha = 1;
    };

    /**
     * Draws the fractional frame position: the frame below the cursor at full
     * opacity, then the next one dissolved in on top by the fractional part.
     * That turns a 116-step slideshow into continuous motion.
     */
    const paint = (force = false) => {
      const position = frameRef.current.index;
      if (!force && Math.abs(position - drawnRef.current) < 0.006) return;

      const base = Math.floor(position);
      const blend = position - base;

      const current = loader.frameAt(base);
      if (!current) return;

      const next = blend > 0.012 ? loader.frameExact(base + 1) : null;

      drawnRef.current = position;

      ctx.globalAlpha = 1;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawCover(current, 1);
      if (next) drawCover(next, blend);
    };

    const tick = () => {
      paint();
      rafRef.current = requestAnimationFrame(tick);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const rect = sticky.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      paint(true);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(sticky);
    resize();

    // ---- loading -----------------------------------------------------
    const startLoading = () => {
      if (cancelled) return;
      void loader.loadFirst().then(() => paint(true));
      void loader.load(smallVariant ? 5 : 8);
    };

    const unsubscribe = loader.onProgress(() => paint(true));

    let io: IntersectionObserver | null = null;
    if (eager) {
      startLoading();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              startLoading();
              io?.disconnect();
              io = null;
            }
          }
        },
        { rootMargin: '150% 0px 150% 0px' },
      );
      if (sectionRef.current) io.observe(sectionRef.current);
    }

    // ---- memory release ---------------------------------------------
    let releaseObserver: IntersectionObserver | null = null;
    if (releaseWhenAway && sectionRef.current) {
      releaseObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting && loader.isComplete) {
              loader.dispose();
              drawnRef.current = Number.NaN;
            } else if (entry.isIntersecting && !loader.isComplete) {
              startLoading();
            }
          }
        },
        { rootMargin: '250% 0px 250% 0px' },
      );
      releaseObserver.observe(sectionRef.current);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      io?.disconnect();
      releaseObserver?.disconnect();
      unsubscribe();
    };
  }, [sequence, smallVariant, eager, releaseWhenAway]);

  /* ----------------------------------------------------------------- */
  /*  Scroll scrubbing                                                   */
  /* ----------------------------------------------------------------- */
  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const total = sequences[sequence].count - 1;

    if (reducedMotion) {
      frameRef.current.index = Math.round(total * 0.5);
      drawnRef.current = Number.NaN;
      return;
    }

    const [from, to] = scrubRange;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        // Small scrub lag on top of Lenis smoothing — enough to absorb a
        // jumpy trackpad without feeling detached from the scroll.
        scrub: 0.45,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const local = clamp((self.progress - from) / (to - from || 1), 0, 1);
          frameRef.current.index = local * total;
        },
      });
    }, section);

    return () => ctx.revert();
  }, [sequence, reducedMotion, scrubRange]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn('relative', className)}
      style={{ height: reducedMotion ? '100svh' : scrollLength }}
    >
      <div
        ref={stickyRef}
        className={cn('sticky top-0 h-[100svh] w-full overflow-hidden bg-void', vignette && 'vignette')}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label={sequences[sequence].alt}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-void"
          style={{ opacity: dim }}
        />
        {children ? (
          <div className={cn('absolute inset-0 z-10', overlayClassName)}>{children}</div>
        ) : null}
      </div>
    </section>
  );
}
