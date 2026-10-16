'use client';

import { useEffect, useState } from 'react';

import { useSite } from '@/components/providers/SiteProvider';
import { siteConfig } from '@/config/site';

const socials = [
  { label: 'GitHub', href: siteConfig.links.github },
  { label: 'LinkedIn', href: siteConfig.links.linkedin },
  { label: 'Email', href: siteConfig.links.email },
] as const;

export function Footer() {
  const { scrollTo } = useSite();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(
        new Intl.DateTimeFormat('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Kolkata',
        }).format(new Date()),
      );
    };
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className="relative overflow-hidden bg-void pt-20 md:pt-28">
      <div className="hairline absolute inset-x-0 top-0" />

      <div className="container-x flex flex-col gap-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <button
            type="button"
            onClick={() => scrollTo('#top')}
            className="group flex flex-col items-start gap-2 text-left"
            aria-label="Back to top"
          >
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-ash transition-colors duration-400 group-hover:text-emerald-soft">
              ↑ Back to top
            </span>
            <span className="display-lg text-gradient-bone">Let’s talk</span>
          </button>

          <ul className="flex flex-wrap gap-x-7 gap-y-3">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  {...(social.href.startsWith('http')
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  className="group relative inline-block font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mist transition-colors duration-400 hover:text-bone"
                >
                  {social.label}
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-emerald-glow transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:origin-left group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/8 py-8 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ash md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="flex items-center gap-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-glow opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-glow" />
            </span>
            Chennai {time || '—'} IST
          </p>
          <p>Built with Next.js, GSAP &amp; Lenis</p>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div aria-hidden className="relative -mb-[0.18em] select-none overflow-hidden">
        <p className="whitespace-nowrap text-center font-display text-[19vw] leading-[0.78] uppercase text-white/[0.045]">
          {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
