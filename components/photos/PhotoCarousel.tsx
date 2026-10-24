'use client';

import { useCallback, useEffect, useRef, useState, type MutableRefObject } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

type CarouselPhoto = { id: string; thumb: string; title?: string };

type Props = {
  photos: CarouselPhoto[];
  itemRefs: MutableRefObject<Record<number, HTMLElement | null>>;
  onOpen: (index: number, el: HTMLElement) => void;
  /** Advance on its own every N ms. Pauses on hover/focus, off screen, or when `paused`. */
  autoPlayMs?: number;
  paused?: boolean;
};

const W = 'min(64vw, 26rem)';

const arrow =
  'flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-lime font-display text-xl font-extrabold text-ink shadow-[3px_3px_0_0_#0B0B14] transition-colors hover:bg-pink disabled:opacity-40';

/** Coverflow-style 3D carousel: drag, swipe, arrow keys, or click a side photo. */
export default function PhotoCarousel({ photos, itemRefs, onOpen, autoPlayMs, paused = false }: Props) {
  const reduce = useReducedMotion();
  const n = photos.length;
  const [active, setActive] = useState(0);
  const panned = useRef(false);
  const current = Math.min(active, n - 1);
  const rootRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!autoPlayMs) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [autoPlayMs]);

  useEffect(() => {
    if (!autoPlayMs || reduce || paused || hover || !visible || n < 2) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % n), autoPlayMs);
    return () => window.clearTimeout(id);
  }, [autoPlayMs, reduce, paused, hover, visible, n, active]);

  const go = useCallback((d: number) => setActive((i) => Math.min(n - 1, Math.max(0, i + d))), [n]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      go(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      go(-1);
    }
  };

  const transition = reduce ? { duration: 0.01 } : { type: 'spring' as const, stiffness: 160, damping: 22 };

  return (
    <div ref={rootRef}>
      <div
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label="Photo carousel"
        onKeyDown={onKeyDown}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        className="relative mx-auto w-full select-none overflow-hidden rounded-[28px] bg-gradient-mesh focus:outline-none focus-visible:ring-2 focus-visible:ring-lime"
        style={{ height: `calc(${W} * 1.25 + 3rem)`, touchAction: 'pan-y' }}
      >
        <motion.div
          className="absolute inset-0"
          onPanStart={() => {
            panned.current = true;
          }}
          onPanEnd={(_, info) => {
            if (info.offset.x < -50) go(1);
            else if (info.offset.x > 50) go(-1);
            window.setTimeout(() => {
              panned.current = false;
            }, 60);
          }}
        >
          {photos.map((p, i) => {
            const o = i - current;
            const abs = Math.abs(o);
            if (abs > 3) return null;
            return (
              <motion.button
                key={p.id}
                type="button"
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                aria-label={o === 0 ? `Open photo${p.title ? `: ${p.title}` : ''}` : `Show photo ${i + 1}`}
                onClick={(e) => {
                  if (panned.current) return;
                  if (o === 0) onOpen(i, e.currentTarget);
                  else setActive(i);
                }}
                animate={{
                  x: `${o * 62}%`,
                  rotateY: -o * 34,
                  scale: 1 - abs * 0.1,
                  opacity: abs > 2 ? 0.25 : 1 - abs * 0.18,
                }}
                transition={transition}
                className="absolute overflow-hidden rounded-[24px] border-2 border-ink bg-surface shadow-[8px_8px_0_0_rgba(244,241,255,0.2)]"
                style={{
                  left: '50%',
                  top: '50%',
                  width: W,
                  aspectRatio: '4 / 5',
                  marginLeft: `calc(${W} / -2)`,
                  marginTop: `calc(${W} * -0.625)`,
                  zIndex: 10 - abs,
                  transformPerspective: 1100,
                  cursor: o === 0 ? 'zoom-in' : 'pointer',
                }}
              >
                <Image
                  src={p.thumb}
                  alt={p.title || ''}
                  fill
                  sizes="(max-width: 768px) 64vw, 26rem"
                  className="object-cover"
                  priority={abs <= 1}
                  draggable={false}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-ink transition-opacity duration-500"
                  style={{ opacity: abs === 0 ? 0 : 0.45 }}
                />
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4 md:gap-8">
        <button type="button" onClick={() => go(-1)} disabled={current === 0} aria-label="Previous photo" className={arrow}>
          ←
        </button>
        <div className="min-w-0 max-w-[16rem] text-center md:max-w-md">
          <p className="truncate font-display text-xl font-extrabold text-bone md:text-2xl">
            {photos[current]?.title || 'Untitled'}
          </p>
          <p className="text-sm font-bold text-muted">
            {String(current + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </p>
        </div>
        <button type="button" onClick={() => go(1)} disabled={current === n - 1} aria-label="Next photo" className={arrow}>
          →
        </button>
      </div>
    </div>
  );
}
