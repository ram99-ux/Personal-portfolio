'use client';

import { useCallback, useRef, type ReactNode } from 'react';

import { useIsCoarsePointer, usePrefersReducedMotion } from '@/hooks/useMediaQuery';
import { gsap } from '@/lib/gsap';
import { cn } from '@/utils/cn';

type Variant = 'solid' | 'outline' | 'ghost';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  strength?: number;
  external?: boolean;
  ariaLabel?: string;
  type?: 'button' | 'submit';
}

const variants: Record<Variant, string> = {
  solid:
    'bg-bone text-void hover:bg-emerald-soft border border-transparent',
  outline:
    'border border-white/18 text-bone hover:border-emerald-soft/70 hover:text-emerald-soft bg-white/[0.02]',
  ghost: 'text-mist hover:text-bone border border-transparent',
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className,
  strength = 0.32,
  external = false,
  ariaLabel,
  type = 'button',
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLSpanElement | null>(null);
  const coarse = useIsCoarsePointer();
  const reducedMotion = usePrefersReducedMotion();
  const disabled = coarse || reducedMotion;

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      const wrap = wrapRef.current;
      const inner = innerRef.current;
      if (!wrap || !inner) return;

      const rect = wrap.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(wrap, { x: x * strength, y: y * strength, duration: 0.7, ease: 'power3.out' });
      gsap.to(inner, { x: x * strength * 0.4, y: y * strength * 0.4, duration: 0.7, ease: 'power3.out' });
    },
    [disabled, strength],
  );

  const handleLeave = useCallback(() => {
    if (disabled) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    gsap.to([wrap, inner], { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.4)' });
  }, [disabled]);

  const classes = cn(
    'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-7 py-4',
    'font-mono text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500',
    'will-change-transform',
    variants[variant],
    className,
  );

  const content = (
    <span ref={innerRef} className="relative z-10 inline-flex items-center gap-3">
      {children}
    </span>
  );

  return (
    <div
      ref={wrapRef}
      className="inline-block will-change-transform"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {href ? (
        <a
          href={href}
          className={classes}
          aria-label={ariaLabel}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {content}
        </a>
      ) : (
        <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
          {content}
        </button>
      )}
    </div>
  );
}
