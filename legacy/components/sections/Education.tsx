'use client';

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { education } from '@/constants/content';

export function Education() {
  return (
    <section id="education" className="relative bg-void py-24 md:py-36">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="container-x">
        <SectionHeading
          eyebrow="Education"
          title="Where the fundamentals came from."
        />

        <ol className="mt-14 flex flex-col md:mt-20">
          {education.map((item, i) => (
            <Reveal as="li" key={item.institution} delay={i * 0.06} y={30}>
              <div className="group grid gap-4 border-t border-white/8 py-8 transition-colors duration-500 hover:border-emerald-glow/40 md:grid-cols-12 md:items-baseline md:gap-8 md:py-10">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.2em] text-emerald-soft md:col-span-2">
                  {item.period}
                </p>

                <div className="md:col-span-6">
                  <h3 className="display-md max-w-[20ch] text-bone transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] md:group-hover:translate-x-2">
                    {item.qualification}
                  </h3>
                  <p className="mt-2 text-[0.95rem] text-mist">{item.institution}</p>
                </div>

                <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ash md:col-span-2">
                  {item.location}
                </p>

                <p className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-bone md:col-span-2 md:text-right">
                  {item.result}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="border-t border-white/8" />
      </div>
    </section>
  );
}
