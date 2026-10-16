'use client';

import type { ReactNode } from 'react';

import { Reveal } from '@/components/ui/Reveal';
import { SplitText } from '@/components/ui/SplitText';
import { cn } from '@/utils/cn';

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-6',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      <Reveal y={18} blur={false}>
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden className="inline-block h-px w-8 bg-emerald-glow/70" />
          {eyebrow}
        </p>
      </Reveal>

      <SplitText
        as="h2"
        text={title}
        by="word"
        stagger={0.05}
        className={cn('display-lg max-w-[18ch] text-gradient-bone', align === 'center' && 'max-w-[22ch]', titleClassName)}
      />

      {description ? (
        <Reveal y={26} delay={0.08}>
          <div className={cn('body-lg max-w-[62ch]', align === 'center' && 'mx-auto')}>
            {description}
          </div>
        </Reveal>
      ) : null}
    </header>
  );
}
