'use client';

import { useRef } from 'react';

import { FrameSequence } from '@/components/canvas/FrameSequence';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { gsap, registerGsap } from '@/lib/gsap';
import { about, stats } from '@/constants/content';

function Counter({ value, suffix }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  registerGsap();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;
    const target = Number(value);
    if (Number.isNaN(target)) return;

    const ctx = gsap.context(() => {
      const state = { n: 0 };
      gsap.to(state, {
        n: target,
        duration: 1.8,
        ease: 'expo.out',
        onUpdate: () => {
          el.textContent = String(Math.round(state.n));
        },
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [value, reducedMotion]);

  return (
    <span className="tabular-nums">
      <span ref={ref}>{value}</span>
      {suffix}
    </span>
  );
}

export function About() {
  return (
    <>
      <FrameSequence
        id="about"
        sequence="mid"
        scrollLength="300vh"
        dim={0.5}
        overlayClassName="flex items-center"
      >
        <div className="container-x relative z-10 w-full">
          <div className="max-w-4xl">
            <Reveal y={16} blur={false}>
              <p className="eyebrow mb-7 flex items-center gap-3">
                <span aria-hidden className="inline-block h-px w-8 bg-emerald-glow" />
                {about.eyebrow}
              </p>
            </Reveal>
            <SplitText
              as="h2"
              text={about.heading}
              by="word"
              stagger={0.055}
              className="display-lg text-gradient-bone"
            />
            <Reveal y={28} delay={0.1} className="mt-8 max-w-2xl">
              <p className="body-lg text-bone/70">{about.paragraphs[0]}</p>
            </Reveal>
          </div>
        </div>
      </FrameSequence>

      <section className="relative bg-void py-24 md:py-36" aria-label="About continued">
        <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-7">
              {about.paragraphs.slice(1).map((p, i) => (
                <Reveal key={i} delay={i * 0.06} y={30}>
                  <p className="body-lg text-mist">{p}</p>
                </Reveal>
              ))}
              <Reveal y={20} blur={false} delay={0.12}>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.24em] text-emerald-soft">
                  {about.signature}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal stagger={0.09} className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/[0.07]">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col gap-3 bg-void p-6 md:p-8"
                >
                  <p className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-none text-bone">
                    <Counter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="font-mono text-[0.65rem] uppercase leading-relaxed tracking-[0.18em] text-ash">
                    {stat.label}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
