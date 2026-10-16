'use client';

import { useCallback, useRef, type ReactNode } from 'react';

import { cn } from '@/utils/cn';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'article' | 'li';
}

/**
 * Glass surface with a cursor-tracked emerald rim. The pointer position is
 * written to CSS custom properties so no React state churn happens on move.
 */
export function GlowCard({ children, className, as: Tag = 'div' }: GlowCardProps) {
  const ref = useRef<HTMLElement | null>(null);

  const handleMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    el.style.setProperty('--my', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <Tag
      ref={ref as never}
      onMouseMove={handleMove}
      className={cn(
        'glow-ring glass relative overflow-hidden rounded-2xl',
        'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
        className,
      )}
    >
      <span aria-hidden className="glow-wash" />
      {children}
    </Tag>
  );
}
