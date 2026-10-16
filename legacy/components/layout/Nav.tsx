'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useSite } from '@/components/providers/SiteProvider';
import { navLinks, siteConfig } from '@/config/site';
import { gsap, registerGsap } from '@/lib/gsap';
import { cn } from '@/utils/cn';

export function Nav() {
  const { ready, scrollTo, lockScroll } = useSite();
  const headerRef = useRef<HTMLElement | null>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  registerGsap();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > 320 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!ready || !headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, { y: -40, autoAlpha: 0, duration: 1.2, delay: 0.35, ease: 'expo.out' });
    }, headerRef);
    return () => ctx.revert();
  }, [ready]);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lockScroll]);

  const go = useCallback(
    (href: string) => {
      setOpen(false);
      // Let the menu close before Lenis takes over.
      window.setTimeout(() => scrollTo(href, -1), open ? 240 : 0);
    },
    [scrollTo, open],
  );

  return (
    <>
      <a
        href="#about"
        onClick={(e) => {
          e.preventDefault();
          go('#about');
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[95] focus:rounded-full focus:bg-bone focus:px-5 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-void"
      >
        Skip to content
      </a>

      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 top-0 z-[75] transition-[transform,background-color,backdrop-filter,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          scrolled && 'border-b border-white/[0.06] bg-void/70 backdrop-blur-xl',
          hidden && !open && '-translate-y-full',
        )}
      >
        <nav
          aria-label="Primary"
          className="container-x flex h-[68px] items-center justify-between md:h-[76px]"
        >
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              go('#top');
            }}
            className="group flex items-center gap-2.5"
            aria-label={`${siteConfig.name} — back to top`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-glow opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-glow" />
            </span>
            <span className="font-display text-lg uppercase leading-none tracking-wide text-bone md:text-xl">
              Ramkumar
            </span>
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(link.href);
                  }}
                  className="group relative block px-4 py-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mist transition-colors duration-300 hover:text-bone"
                >
                  {link.label}
                  <span className="absolute inset-x-4 bottom-1 h-px origin-left scale-x-0 bg-emerald-glow transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={siteConfig.links.email}
              className="hidden rounded-full border border-white/15 px-5 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors duration-400 hover:border-emerald-soft/60 hover:text-emerald-soft sm:inline-block"
            >
              Hire me
            </a>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="relative z-[91] flex h-10 w-10 items-center justify-center rounded-full border border-white/15 lg:hidden"
            >
              <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
              <span
                aria-hidden
                className={cn(
                  'absolute h-px w-4 bg-bone transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  open ? 'rotate-45' : '-translate-y-1',
                )}
              />
              <span
                aria-hidden
                className={cn(
                  'absolute h-px w-4 bg-bone transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  open ? '-rotate-45' : 'translate-y-1',
                )}
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className={cn(
          'fixed inset-0 z-[85] flex flex-col justify-center bg-void/95 backdrop-blur-2xl transition-opacity duration-500 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <ul className="container-x flex flex-col gap-2">
          {navLinks.map((link, i) => (
            <li key={link.href} className="overflow-hidden">
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  go(link.href);
                }}
                style={{ transitionDelay: open ? `${120 + i * 55}ms` : '0ms' }}
                className={cn(
                  'block py-3 font-display text-[clamp(2.4rem,11vw,4rem)] uppercase leading-[0.95] text-bone transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0',
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="container-x mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-mist">
          <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a href={siteConfig.links.email}>Email</a>
        </div>
      </div>
    </>
  );
}
