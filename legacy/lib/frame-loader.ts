import { framePath, sequences, type SequenceId } from '@/lib/sequences';

type ProgressHandler = (loadedRatio: number) => void;

/**
 * Loads a numbered image sequence into memory with bounded concurrency,
 * reports progress, and can release every decoded bitmap on demand.
 *
 * One instance owns one sequence. Instances are cached per (id, variant)
 * so two components mounting the same sequence share the same decoded frames.
 */
export class FrameSequenceLoader {
  readonly id: SequenceId;
  readonly count: number;
  readonly mobile: boolean;

  private frames: (HTMLImageElement | null)[];
  private loadedCount = 0;
  private pending: Promise<void> | null = null;
  private disposed = false;
  private handlers = new Set<ProgressHandler>();

  constructor(id: SequenceId, mobile: boolean) {
    this.id = id;
    this.mobile = mobile;
    this.count = sequences[id].count;
    this.frames = new Array(this.count).fill(null);
  }

  get progress(): number {
    return this.count === 0 ? 1 : this.loadedCount / this.count;
  }

  get isComplete(): boolean {
    return this.loadedCount >= this.count;
  }

  onProgress(handler: ProgressHandler): () => void {
    this.handlers.add(handler);
    handler(this.progress);
    return () => this.handlers.delete(handler);
  }

  private emit() {
    const p = this.progress;
    this.handlers.forEach((h) => h(p));
  }

  /** Returns the frame at `index` only if it is decoded — no fallback. */
  frameExact(index: number): HTMLImageElement | null {
    if (index < 0 || index >= this.count) return null;
    const img = this.frames[index];
    return img && img.naturalWidth > 0 ? img : null;
  }

  /** Returns the nearest already-decoded frame at or before `index` (0-based). */
  frameAt(index: number): HTMLImageElement | null {
    const clamped = Math.max(0, Math.min(this.count - 1, index));
    for (let i = clamped; i >= 0; i--) {
      const f = this.frames[i];
      if (f) return f;
    }
    for (let i = clamped + 1; i < this.count; i++) {
      const f = this.frames[i];
      if (f) return f;
    }
    return null;
  }

  private loadOne(index: number): Promise<void> {
    return new Promise((resolve) => {
      if (this.disposed || this.frames[index]) return resolve();
      const img = new Image();
      img.decoding = 'async';
      img.src = framePath(this.id, index + 1, this.mobile);

      const done = (ok: boolean) => {
        if (this.disposed) return resolve();
        if (ok) this.frames[index] = img;
        this.loadedCount += 1;
        this.emit();
        resolve();
      };

      if (img.complete && img.naturalWidth > 0) {
        done(true);
        return;
      }
      img.onload = () => done(true);
      img.onerror = () => done(false);
    });
  }

  /**
   * Loads the whole sequence. Concurrent calls share one promise.
   * Frames are fetched in order so an early scrub always has something to draw.
   */
  load(concurrency = 6): Promise<void> {
    if (this.pending) return this.pending;

    this.disposed = false;
    const queue = Array.from({ length: this.count }, (_, i) => i);

    const worker = async (): Promise<void> => {
      while (queue.length && !this.disposed) {
        const next = queue.shift();
        if (next === undefined) break;
        await this.loadOne(next);
      }
    };

    this.pending = Promise.all(
      Array.from({ length: Math.min(concurrency, this.count) }, worker),
    ).then(() => undefined);

    return this.pending;
  }

  /** Loads just the first frame so the canvas is never empty. */
  async loadFirst(): Promise<void> {
    await this.loadOne(0);
  }

  /** Releases every decoded bitmap. The loader can be reloaded afterwards. */
  dispose() {
    this.disposed = true;
    this.pending = null;
    for (let i = 0; i < this.frames.length; i++) {
      const img = this.frames[i];
      if (img) {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      }
      this.frames[i] = null;
    }
    this.loadedCount = 0;
    this.emit();
  }
}

const registry = new Map<string, FrameSequenceLoader>();

export function getLoader(id: SequenceId, mobile: boolean): FrameSequenceLoader {
  const key = `${id}:${mobile ? 'm' : 'd'}`;
  let loader = registry.get(key);
  if (!loader) {
    loader = new FrameSequenceLoader(id, mobile);
    registry.set(key, loader);
  }
  return loader;
}

export function disposeAllExcept(keep: SequenceId[], mobile: boolean) {
  registry.forEach((loader, key) => {
    const [id, variant] = key.split(':');
    if (variant !== (mobile ? 'm' : 'd')) return;
    if (!keep.includes(id as SequenceId)) loader.dispose();
  });
}
