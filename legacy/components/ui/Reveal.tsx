'use client';

import { useRef, type ElementType, type ReactNode } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { gsap, registerGsap } from '@/lib/gsap';
import { cn } from '@/utils/cn';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  scale?: number;
  /** Stagger direct children instead of animating the wrapper. */
  stagger?: number;
  start?: string;
}

export function Reveal({
  children,
  as: Tag = 'div',
  className,
  delay = 0,
  y = 44,
  blur = true,
  scale = 1,
  stagger,
  start = 'top 86%',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  registerGsap();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const targets = stagger ? Array.from(el.children) : el;
    if (Array.isArray(targets) && targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y,
        opacity: 0,
        scale,
        filter: blur ? 'blur(10px)' : 'none',
        duration: 1.2,
        delay,
        ease: 'expo.out',
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start, once: true },
        clearProps: 'filter',
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion, delay, y, blur, scale, stagger, start]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
