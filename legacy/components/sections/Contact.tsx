'use client';

import { useState, type FormEvent } from 'react';

import { Particles } from '@/components/atmosphere/Particles';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { contact } from '@/constants/content';
import { siteConfig } from '@/config/site';

const channels = [
  { label: 'Email', value: siteConfig.email, href: siteConfig.links.email, external: false },
  { label: 'LinkedIn', value: 'in/ram-kumar04', href: siteConfig.links.linkedin, external: true },
  { label: 'GitHub', value: 'ram99-ux', href: siteConfig.links.github, external: true },
  { label: 'Phone', value: siteConfig.phone, href: `tel:${siteConfig.phoneHref}`, external: false },
] as const;

const fieldClass =
  'w-full rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3.5 text-[0.95rem] text-bone placeholder:text-ash/70 transition-colors duration-400 focus:border-emerald-soft/60 focus:bg-white/[0.04] focus:outline-none';

export function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const company = String(data.get('company') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const subject = `New enquiry from ${name}${company ? ` — ${company}` : ''}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : null,
      '',
      message,
    ]
      .filter((line) => line !== null)
      .join('\n');

    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    setSent(true);
    window.setTimeout(() => setSent(false), 7000);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="hairline absolute inset-x-0 top-0" />
      <Particles className="opacity-70" density={0.00005} />

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-45 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(20,184,122,0.24) 0%, rgba(10,92,60,0.09) 45%, transparent 70%)',
        }}
      />

      <div className="container-x relative z-10">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="flex flex-col gap-8 lg:col-span-6">
            <Reveal y={16} blur={false}>
              <p className="eyebrow flex items-center gap-3">
                <span aria-hidden className="inline-block h-px w-8 bg-emerald-glow" />
                {contact.eyebrow}
              </p>
            </Reveal>

            <SplitText
              as="h2"
              text={contact.heading}
              by="word"
              stagger={0.06}
              className="display-lg max-w-[14ch] text-gradient-bone"
            />

            <Reveal y={26} delay={0.08}>
              <p className="body-lg max-w-[48ch]">{contact.body}</p>
            </Reveal>

            <Reveal as="ul" stagger={0.07} className="mt-2 flex flex-col">
              {channels.map((channel) => (
                <li key={channel.label} className="border-t border-white/8 last:border-b">
                  <a
                    href={channel.href}
                    {...(channel.external
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group flex items-center justify-between gap-6 py-5 transition-colors duration-400 hover:text-emerald-soft"
                  >
                    <span className="font-mono text-[0.66rem] uppercase tracking-[0.2em] text-ash">
                      {channel.label}
                    </span>
                    <span className="flex items-center gap-3 text-[0.95rem] text-bone transition-colors duration-400 group-hover:text-emerald-soft">
                      {channel.value}
                      <span
                        aria-hidden
                        className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </Reveal>

            <Reveal y={18} blur={false} delay={0.1}>
              <p className="font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ash">
                {siteConfig.location} · {siteConfig.availability}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal y={44}>
              <form
                onSubmit={handleSubmit}
                className="glass flex flex-col gap-5 rounded-2xl p-7 md:p-9"
                aria-label="Contact form"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="name"
                      className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash"
                    >
                      Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className={fieldClass}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="email"
                      className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash"
                    >
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      className={fieldClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="company"
                    className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash"
                  >
                    Company
                  </label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    placeholder="Optional"
                    className={fieldClass}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="message"
                    className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-ash"
                  >
                    Project details *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder="What are you building, and what does done look like?"
                    className={`${fieldClass} resize-y`}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <MagneticButton type="submit" variant="solid" strength={0.22}>
                    {contact.cta}
                    <span aria-hidden>→</span>
                  </MagneticButton>

                  <p
                    aria-live="polite"
                    className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-ash"
                  >
                    {sent ? 'Opening your mail client…' : 'Opens in your mail app'}
                  </p>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
