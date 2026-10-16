'use client';

import { useRef } from 'react';

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { gsap, registerGsap } from '@/lib/gsap';
import { certifications, experience } from '@/constants/content';

export function Experience() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  registerGsap();

  /* The timeline spine draws itself as you scroll the section. */
  useIsomorphicLayoutEffect(() => {
    const el = railRef.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top 72%',
            end: 'bottom 82%',
            scrub: 0.4,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section id="experience" className="relative bg-ink py-24 md:py-36">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="container-x">
        <SectionHeading
          eyebrow="Experience"
          title="Where the practice happened."
          description="Three roles, one throughline: take responsibility for the part of the system nobody else wants to own."
        />

        <div className="relative mt-16 pl-6 md:mt-24 md:pl-0">
          {/* spine */}
          <div className="absolute left-0 top-2 h-full w-px bg-white/8 md:left-[calc(28%-1px)]">
            <div ref={railRef} className="h-full w-px origin-top bg-emerald-glow/70" />
          </div>

          <ol className="flex flex-col gap-16 md:gap-24">
            {experience.map((job, i) => (
              <Reveal as="li" key={job.company} y={48} delay={0.04} className="relative">
                <span
                  aria-hidden
                  className="absolute -left-6 top-2 h-2.5 w-2.5 rounded-full bg-emerald-glow shadow-[0_0_0_5px_rgba(20,184,122,0.14)] md:left-[calc(28%-5px)]"
                />

                <div className="grid gap-6 md:grid-cols-[28%_1fr] md:gap-12">
                  <div className="flex flex-col gap-2 md:pr-12 md:text-right">
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-emerald-soft">
                      {job.period}
                    </p>
                    <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ash">
                      {job.location}
                    </p>
                    <p className="font-mono text-[0.65rem] tracking-[0.18em] text-ash/60">
                      {String(i + 1).padStart(2, '0')} / {String(experience.length).padStart(2, '0')}
                    </p>
                  </div>

                  <div className="flex flex-col gap-5 md:pl-12">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="display-md text-bone">{job.role}</h3>
                      <p className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-mist">
                        {job.company}
                      </p>
                    </div>

                    <p className="body-lg max-w-[58ch] text-mist">{job.summary}</p>

                    <ul className="flex flex-col gap-3 border-l border-white/8 pl-5">
                      {job.highlights.map((h) => (
                        <li
                          key={h}
                          className="relative max-w-[62ch] text-[0.94rem] leading-relaxed text-mist/90"
                        >
                          {h}
                        </li>
                      ))}
                    </ul>

                    <ul className="flex flex-wrap gap-2 pt-1">
                      {job.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-white/10 px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ash"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>

        {/* Certifications */}
        <div className="mt-20 md:mt-28">
          <Reveal y={20} blur={false}>
            <p className="eyebrow mb-8 flex items-center gap-3">
              <span aria-hidden className="inline-block h-px w-8 bg-emerald-glow/70" />
              Certifications
            </p>
          </Reveal>
          <Reveal as="ul" stagger={0.07} className="grid gap-px overflow-hidden rounded-2xl bg-white/[0.07] sm:grid-cols-3">
            {certifications.map((cert) => (
              <li key={cert.title} className="flex flex-col gap-2 bg-ink p-6 md:p-7">
                <p className="text-[0.98rem] leading-snug text-bone">{cert.title}</p>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ash">
                  {cert.issuer}
                </p>
                <p className="mt-auto pt-3 font-mono text-[0.65rem] tracking-[0.16em] text-emerald-soft/80">
                  {cert.date}
                </p>
              </li>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
