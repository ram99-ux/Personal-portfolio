'use client';

import { useEffect, useState } from 'react';

import { useIsMobile } from '@/hooks/useMediaQuery';
import { preferSmallVariant } from '@/lib/sequences';

/**
 * Which frame variant this device should download.
 *
 * Returns `null` on the very first render — consumers must wait for that to
 * resolve before requesting anything, otherwise a phone would briefly start
 * pulling the 1280px sequence before switching.
 */
export function useFrameVariant(): boolean | null {
  const isMobile = useIsMobile();
  const [small, setSmall] = useState<boolean | null>(null);

  useEffect(() => {
    setSmall(preferSmallVariant(isMobile));
  }, [isMobile]);

  return small;
}
