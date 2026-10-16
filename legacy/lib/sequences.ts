import type { SequenceConfig } from '@/types';

/**
 * Frame sequences live in /public/frames/<id>/0001.webp (1280px) and
 * /public/frames/<id>/m/0001.webp (960px, used on phones and low-RAM devices).
 *
 * Source footage was motion-interpolated with ffmpeg's `minterpolate` filter
 * (motion-compensated, bidirectional) so consecutive frames sit close enough
 * together for the canvas cross-fade to read as continuous movement.
 *
 * Counts are authoritative — they must match what is on disk.
 */
export const sequences = {
  hero: {
    id: 'hero',
    count: 116,
    alt: 'Portrait of Ramkumar Ramar emerging from emerald smoke and drifting particles.',
  },
  mid: {
    id: 'mid',
    count: 116,
    alt: 'Ramkumar Ramar standing inside a room of glowing cyan wireframe geometry.',
  },
  skills: {
    id: 'skills',
    count: 36,
    alt: 'Ramkumar Ramar at a workstation surrounded by floating React, Node, JavaScript and AWS holograms.',
  },
} as const satisfies Record<string, SequenceConfig>;

export type SequenceId = keyof typeof sequences;

/** Zero-padded public URL for a single frame (1-indexed). */
export function framePath(id: SequenceId, index: number, mobile: boolean): string {
  const n = String(index).padStart(4, '0');
  return mobile ? `/frames/${id}/m/${n}.webp` : `/frames/${id}/${n}.webp`;
}

/**
 * Picks the lighter variant on phones, coarse pointers, small viewports and
 * devices that report 4 GB of RAM or less. Keeps peak decoded-bitmap memory
 * in check without penalising desktops.
 */
export function preferSmallVariant(isMobile: boolean): boolean {
  if (typeof window === 'undefined') return isMobile;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof memory === 'number' && memory <= 4) return true;
  return isMobile || window.innerWidth < 1100;
}
