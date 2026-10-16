'use client';

import { useRef } from 'react';

import { GlowCard } from '@/components/ui/GlowCard';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { gsap, registerGsap } from '@/lib/gsap';
import { projects } from '@/constants/content';
import type { ProjectItem } from '@/types';

/** Abstract system panel — no fake screenshots, just the shape of the build. */
function ProjectVisual({ project, index }: { project: ProjectItem; index: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  registerGsap();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to('[data-visual-layer]', {
        yPercent: (i) => -8 - i * 5,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      });
    }, el);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={ref}
      className="relative aspect-[16/11] w-full overflow-hidden rounded-xl border border-white/8 bg-carbon"
      aria-hidden
    >
      {/* mesh */}
      <div
        data-visual-layer
        className="absolute inset-[-15%] opacity-70"
        style={{
          background:
            'radial-gradient(60% 60% at 22% 18%, rgba(20,184,122,0.22), transparent 62%), radial-gradient(50% 55% at 82% 78%, rgba(87,224,172,0.12), transparent 60%)',
        }}
      />
      {/* grid */}
      <div
        data-visual-layer
        className="absolute inset-[-15%] opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.35) 1px, transparent 1px)',
          backgroundSize: '46px 46px',
          maskImage: 'radial-gradient(75% 75% at 50% 50%, #000 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(75% 75% at 50% 50%, #000 30%, transparent 100%)',
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <span className="font-display text-[clamp(3.5rem,9vw,7rem)] leading-[0.78] text-white/8">
            {String(index + 1).padStart(2, '0')}
          </span>
          {project.metric ? (
            <div className="text-right">
              <p className="font-display text-[clamp(1.8rem,3.4vw,2.75rem)] leading-none text-emerald-soft">
                {project.metric.value}
              </p>
              <p className="mt-1.5 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ash">
                {project.metric.label}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
          {project.stack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/35"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-glow/50 to-transparent" />
    </div>
  );
}

export function Projects() {
  return (
    <section id="work" className="relative bg-void py-24 md:py-36">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="container-x">
        <SectionHeading
          eyebrow="Selected work"
          title="Things I built that went live."
          description="Client platforms, an institutional records system, and an LLM product that had to behave itself. Each one shipped, deployed and maintained."
        />

        <ul className="mt-16 flex flex-col gap-8 md:mt-24 md:gap-14">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.slug} y={54}>
              <GlowCard as="article" className="p-6 md:p-10">
                <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:gap-14">
                  <div className="lg:col-span-6 xl:col-span-7">
                    <ProjectVisual project={project} index={i} />
                  </div>

                  <div className="flex flex-col gap-6 lg:col-span-6 xl:col-span-5">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-emerald-soft">
                        {project.category}
                      </span>
                      <span aria-hidden className="h-px w-6 bg-white/15" />
                      <span className="font-mono text-[0.65rem] tracking-[0.2em] text-ash">
                        {project.year}
                      </span>
                    </div>

                    <h3 className="display-md max-w-[16ch] text-bone">{project.title}</h3>

                    <p className="body-lg max-w-[52ch] text-mist">{project.summary}</p>

                    <ul className="flex flex-col gap-2.5">
                      {project.highlights.map((h) => (
                        <li
                          key={h}
                          className="flex gap-3 text-[0.9rem] leading-relaxed text-mist/85"
                        >
                          <span
                            aria-hidden
                            className="mt-2 h-1 w-1 shrink-0 rounded-full bg-emerald-glow"
                          />
                          {h}
                        </li>
                      ))}
                    </ul>

                    <ul className="flex flex-wrap gap-2 pt-1">
                      {project.stack.map((tech) => (
                        <li
                          key={tech}
                          className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-ash"
                        >
                          {tech}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-4">
                      {project.demo ? (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full bg-bone px-5 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-void transition-colors duration-400 hover:bg-emerald-soft"
                        >
                          Live demo
                          <span aria-hidden>↗</span>
                        </a>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-white/12 px-5 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ash">
                          Client-owned · private
                        </span>
                      )}

                      {project.repo ? (
                        <a
                          href={project.repo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.18em] text-bone transition-colors duration-400 hover:border-emerald-soft/60 hover:text-emerald-soft"
                        >
                          GitHub
                          <span aria-hidden>↗</span>
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
