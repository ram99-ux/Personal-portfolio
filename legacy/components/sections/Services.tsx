'use client';

import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services } from '@/constants/content';

export function Services() {
  return (
    <section id="services" className="relative bg-ink py-24 md:py-36">
      <div className="hairline absolute inset-x-0 top-0" />
      <div className="container-x">
        <SectionHeading
          eyebrow="Services"
          title="What you can hand me."
          description="Whether it is a greenfield build or an existing app that has quietly gotten slow, these are the pieces I take responsibility for."
        />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl bg-white/[0.07] md:mt-24 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => (
            <Reveal
              as="li"
              key={service.index}
              delay={(i % 3) * 0.05}
              y={34}
              className="group relative bg-ink"
            >
              <div className="relative flex h-full flex-col gap-5 p-8 transition-colors duration-600 group-hover:bg-carbon md:p-10">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-emerald-glow transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                />

                <span className="font-mono text-[0.68rem] tracking-[0.24em] text-emerald-soft">
                  {service.index}
                </span>

                <h3 className="display-md max-w-[14ch] text-bone transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5">
                  {service.title}
                </h3>

                <p className="max-w-[44ch] text-[0.94rem] leading-relaxed text-mist">
                  {service.description}
                </p>

                <ul className="mt-auto flex flex-col gap-2 pt-4">
                  {service.deliverables.map((d) => (
                    <li
                      key={d}
                      className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ash"
                    >
                      <span aria-hidden className="h-px w-4 bg-white/20" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
