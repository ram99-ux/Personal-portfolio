'use client';

import { useRef, type ElementType } from 'react';

import { useSite } from '@/components/providers/SiteProvider';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { gsap, registerGsap, ScrollTrigger } from '@/lib/gsap';
import { cn } from '@/utils/cn';

interface SplitTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  /** 'ready' fires after the preloader; 'scroll' fires when it enters the viewport. */
  trigger?: 'ready' | 'scroll';
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Animate whole words instead of individual characters. */
  by?: 'char' | 'word';
}

export function SplitText({
  text,
  as: Tag = 'span',
  className,
  trigger = 'scroll',
  delay = 0,
  stagger = 0.026,
  duration = 1.05,
  by = 'char',
}: SplitTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { ready } = useSite();
  const reducedMotion = usePrefersReducedMotion();

  registerGsap();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    if (trigger === 'ready' && !ready) return;

    const targets = el.querySelectorAll<HTMLElement>('[data-split-unit]');
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      const tween = {
        yPercent: 118,
        rotate: by === 'char' ? 4 : 2,
        opacity: 0,
        duration,
        delay,
        ease: 'expo.out' as const,
        stagger: { each: stagger, from: 'start' as const },
      };

      if (trigger === 'ready') {
        gsap.from(targets, tween);
      } else {
        gsap.from(targets, {
          ...tween,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
        });
      }
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [ready, trigger, reducedMotion, by, delay, duration, stagger]);

  const words = text.split(' ');

  return (
    <Tag ref={ref} className={cn('inline-block', className)} aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={`${word}-${wi}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]"
        >
          {by === 'word' ? (
            <span data-split-unit className="inline-block whitespace-pre">
              {word}
              {wi < words.length - 1 ? ' ' : ''}
            </span>
          ) : (
            <>
              {Array.from(word).map((char, ci) => (
                <span
                  key={`${char}-${ci}`}
                  data-split-unit
                  className="inline-block whitespace-pre"
                >
                  {char}
                </span>
              ))}
              {wi < words.length - 1 ? (
                <span data-split-unit className="inline-block whitespace-pre">
                  {' '}
                </span>
              ) : null}
            </>
          )}
        </span>
      ))}
    </Tag>
  );
}
