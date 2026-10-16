'use client';

import { FrameSequence } from '@/components/canvas/FrameSequence';
import { GlowCard } from '@/components/ui/GlowCard';
import { Marquee } from '@/components/ui/Marquee';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { marqueeSkills, skillGroups } from '@/constants/content';

export function Skills() {
  return (
    <>
      <FrameSequence
        id="skills"
        sequence="skills"
        scrollLength="180vh"
        dim={0.55}
        overlayClassName="flex items-center"
      >
        <div className="container-x relative z-10 w-full">
          <Reveal y={16} blur={false}>
            <p className="eyebrow mb-7 flex items-center gap-3">
              <span aria-hidden className="inline-block h-px w-8 bg-emerald-glow" />
              Capabilities
            </p>
          </Reveal>
          <SplitText
            as="h2"
            text="The stack I actually ship with."
            by="word"
            stagger={0.055}
            className="display-lg max-w-[16ch] text-gradient-bone"
          />
          <Reveal y={26} delay={0.1} className="mt-8 max-w-xl">
            <p className="body-lg text-bone/70">
              Not a list of everything I have ever opened — these are the tools I have used to
              build, secure and deploy software that real people rely on.
            </p>
          </Reveal>
        </div>
      </FrameSequence>

      <section className="relative overflow-hidden bg-void py-20 md:py-28" aria-label="Core technologies">
        <div className="hairline absolute inset-x-0 top-0" />
        <Marquee items={marqueeSkills} className="py-4 opacity-90" />
        <div className="hairline absolute inset-x-0 bottom-0" />
      </section>

      <section className="relative bg-void pb-24 md:pb-36" aria-label="Skills by discipline">
        <div className="container-x">
          <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {skillGroups.map((group, i) => (
              <Reveal as="li" key={group.title} delay={(i % 3) * 0.06} y={38}>
                <GlowCard as="div" className="h-full p-7 md:p-8">
                  <div className="relative z-10 flex h-full flex-col gap-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="display-md text-bone">{group.title}</h3>
                      <span className="font-mono text-[0.65rem] tracking-[0.2em] text-ash">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <ul className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-mist transition-colors duration-400 hover:border-emerald-soft/45 hover:text-bone"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
