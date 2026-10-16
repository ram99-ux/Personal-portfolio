'use client';

import { useRef } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { gsap, registerGsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/utils/cn';

interface MarqueeProps {
  items: readonly string[];
  speed?: number;
  className?: string;
  /** Scroll velocity nudges the marquee direction. */
  reactive?: boolean;
}

export function Marquee({ items, speed = 42, className, reactive = true }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  registerGsap();

  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    const ctx = gsap.context(() => {
      const half = track.scrollWidth / 2;
      if (half <= 0) return;

      const tween = gsap.to(track, {
        x: -half,
        duration: half / speed,
        ease: 'none',
        repeat: -1,
        modifiers: {
          x: (value: string) => `${parseFloat(value) % half}px`,
        },
      });

      if (!reactive) return;

      ScrollTrigger.create({
        trigger: track,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const boost = 1 + Math.min(3.5, Math.abs(self.getVelocity()) / 900);
          gsap.to(tween, { timeScale: self.direction === 1 ? boost : -boost, duration: 0.4, overwrite: true });
        },
      });
    }, track);

    return () => ctx.revert();
  }, [speed, reducedMotion, reactive]);

  const rendered = [...items, ...items];

  return (
    <div className={cn('relative w-full overflow-hidden', className)} aria-hidden>
      <div ref={trackRef} className="flex w-max items-center gap-10 will-change-transform">
        {rendered.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-10">
            <span className="font-display text-[clamp(1.6rem,3.4vw,3.2rem)] uppercase leading-none text-bone/85">
              {item}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-glow" />
          </span>
        ))}
      </div>
    </div>
  );
}
