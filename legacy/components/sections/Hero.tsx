'use client';

import { useRef } from 'react';

import { FrameSequence } from '@/components/canvas/FrameSequence';
import { Particles } from '@/components/atmosphere/Particles';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SplitText } from '@/components/ui/SplitText';
import { useSite } from '@/components/providers/SiteProvider';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { gsap, registerGsap, ScrollTrigger } from '@/lib/gsap';
import { hero } from '@/constants/content';
import { siteConfig } from '@/config/site';

export function Hero() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const { ready, scrollTo } = useSite();
  const reducedMotion = usePrefersReducedMotion();

  registerGsap();

  /* Fade + lift the hero copy as the sequence takes over. */
  useIsomorphicLayoutEffect(() => {
    const el = overlayRef.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(el, {
        yPercent: -12,
        autoAlpha: 0,
        filter: 'blur(8px)',
        ease: 'none',
        scrollTrigger: {
          trigger: el.closest('section'),
          start: 'top top',
          end: '55% top',
          scrub: 0.5,
        },
      });
    }, el);

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [reducedMotion]);

  /* Entrance for the non-split elements once the preloader clears. */
  useIsomorphicLayoutEffect(() => {
    if (!ready || reducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-fade]', {
        y: 26,
        autoAlpha: 0,
        duration: 1.2,
        delay: 0.55,
        stagger: 0.1,
        ease: 'expo.out',
      });
    }, overlayRef);
    return () => ctx.revert();
  }, [ready, reducedMotion]);

  return (
    <FrameSequence
      id="top"
      sequence="hero"
      scrollLength="270vh"
      eager
      releaseWhenAway={false}
      dim={0.42}
      overlayClassName="flex items-end md:items-center"
    >
      <Particles className="z-0" density={0.00008} />

      <div
        ref={overlayRef}
        className="container-x relative z-10 flex w-full flex-col gap-8 pb-24 md:pb-0"
      >
        <p data-hero-fade className="eyebrow flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-8 bg-emerald-glow" />
          {hero.eyebrow}
        </p>

        <h1 className="display-xl text-gradient-bone" aria-label={siteConfig.name}>
          <span className="block">
            <SplitText text={hero.name[0]} trigger="ready" delay={0.15} stagger={0.05} />
          </span>
          <span className="block pl-[0.06em] text-bone/55">
            <SplitText text={hero.name[1]} trigger="ready" delay={0.28} stagger={0.05} />
          </span>
        </h1>

        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="flex max-w-xl flex-col gap-5">
            <p
              data-hero-fade
              className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-soft"
            >
              {hero.title}
            </p>
            <p data-hero-fade className="body-lg text-bone/75">
              {hero.intro}
            </p>
          </div>

          <div data-hero-fade className="flex flex-wrap items-center gap-3">
            <MagneticButton onClick={() => scrollTo('#work', -1)} variant="solid">
              View work
              <span aria-hidden className="text-base leading-none">↓</span>
            </MagneticButton>
            <MagneticButton href={siteConfig.links.email} variant="outline">
              Get in touch
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center md:flex"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.32em] text-mist">
            Scroll
          </span>
          <span className="relative h-12 w-px overflow-hidden bg-white/12">
            <span className="absolute inset-x-0 top-0 h-4 animate-[scrollHint_2.2s_ease-in-out_infinite] bg-emerald-glow" />
          </span>
        </div>
      </div>

      <style>{`
        @keyframes scrollHint {
          0% { transform: translateY(-100%); }
          55% { transform: translateY(300%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </FrameSequence>
  );
}
