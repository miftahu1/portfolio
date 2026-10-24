'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';

export type Rect = { left: number; top: number; width: number; height: number };
export type LightboxPhoto = { id: string; src: string; thumb: string; title?: string; description?: string };
export type LightboxOrigin = { index: number; rect: Rect; aspect: number };

/** Measure a thumbnail so the lightbox can grow out of exactly where it sits. */
export function originFromElement(index: number, el: HTMLElement): LightboxOrigin {
  const r = el.getBoundingClientRect();
  const img = el.querySelector('img');
  const aspect =
    img && img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : 4 / 3;
  return { index, rect: { left: r.left, top: r.top, width: r.width, height: r.height }, aspect };
}

const imgVariants: Variants = {
  enter: (dir: number) => ({ x: dir * 90, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: (dir: number) => ({ x: dir * -90, opacity: 0, transition: { duration: 0.25 } }),
};

const navButton =
  'pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full border-2 border-ink bg-lime font-display text-xl font-extrabold text-ink shadow-[3px_3px_0_0_#0B0B14] transition-colors hover:bg-pink md:h-14 md:w-14';

type ViewProps = {
  photos: LightboxPhoto[];
  origin: LightboxOrigin;
  onClose: () => void;
  getRect?: (index: number) => Rect | null;
};

function LightboxView({ photos, origin, onClose, getRect }: ViewProps) {
  const reduce = useReducedMotion();
  const n = photos.length;
  const [index, setIndex] = useState(origin.index);
  const [dir, setDir] = useState(1);
  const [closing, setClosing] = useState(false);
  const [exitRect, setExitRect] = useState<Rect | null>(null);
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [aspects, setAspects] = useState<Record<string, number>>({ [photos[origin.index].id]: origin.aspect });
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const requested = useRef<Set<string>>(new Set());
  const closeRef = useRef<HTMLButtonElement>(null);
  const panned = useRef(false);

  // Resize
  useEffect(() => {
    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Lock page scroll without turning body into a scroll container
  useEffect(() => {
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const prevOverflow = html.style.overflow;
    const prevPadding = html.style.paddingRight;
    html.style.overflow = 'hidden';
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;
    closeRef.current?.focus();
    return () => {
      html.style.overflow = prevOverflow;
      html.style.paddingRight = prevPadding;
    };
  }, []);

  // Learn each photo's shape (and warm the cache) for the current and neighbouring slides
  useEffect(() => {
    [index - 1, index, index + 1].forEach((i) => {
      const p = photos[(i + n) % n];
      if (!p || requested.current.has(p.id)) return;
      requested.current.add(p.id);
      const probe = new window.Image();
      probe.onload = () => {
        if (probe.naturalHeight > 0) {
          setAspects((prev) => ({ ...prev, [p.id]: probe.naturalWidth / probe.naturalHeight }));
        }
      };
      probe.src = p.thumb;
      new window.Image().src = p.src;
    });
  }, [index, n, photos]);

  const go = useCallback(
    (d: number) => {
      if (n < 2) return;
      setDir(d);
      setIndex((i) => (i + d + n) % n);
    },
    [n]
  );

  const requestClose = useCallback(() => {
    if (closing) return;
    const r = getRect?.(index) ?? null;
    const onScreen =
      !!r &&
      r.width > 0 &&
      r.height > 0 &&
      r.left < window.innerWidth &&
      r.left + r.width > 0 &&
      r.top < window.innerHeight &&
      r.top + r.height > 0;
    setExitRect(onScreen ? r : null);
    setClosing(true);
  }, [closing, getRect, index]);

  // Tell the parent only after the exit target is in the last render
  useEffect(() => {
    if (closing) onClose();
  }, [closing, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestClose, go]);

  const photo = photos[index];
  const aspect = aspects[photo.id] ?? 4 / 3;
  const maxW = Math.max(240, vp.w * (vp.w < 640 ? 0.94 : 0.9));
  const maxH = Math.max(200, vp.h - 210);
  const w = Math.min(maxW, maxH * aspect);
  const h = w / aspect;
  const target: Rect = { left: (vp.w - w) / 2, top: 76 + (maxH - h) / 2, width: w, height: h };
  const spring = reduce ? { duration: 0.01 } : { type: 'spring' as const, stiffness: 170, damping: 24, mass: 0.9 };

  return createPortal(
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Photo viewer">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-ink/95 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Swipe / click-outside layer */}
      <motion.div
        className="absolute inset-0"
        style={{ touchAction: 'none' }}
        onPanStart={() => {
          panned.current = true;
        }}
        onPanEnd={(_, info) => {
          if (info.offset.x < -60) go(1);
          else if (info.offset.x > 60) go(-1);
          window.setTimeout(() => {
            panned.current = false;
          }, 60);
        }}
        onClick={() => {
          if (!panned.current) requestClose();
        }}
      />

      {/* The photo: grows out of its thumbnail, flies back on close */}
      <motion.div
        className="absolute z-10 overflow-hidden border-2 border-ink bg-surface"
        initial={{ ...origin.rect, borderRadius: 20, boxShadow: '0px 0px 0px 0px #D4FF3A' }}
        animate={{ ...target, borderRadius: 24, boxShadow: '10px 10px 0px 0px #D4FF3A' }}
        exit={
          exitRect
            ? {
                ...exitRect,
                borderRadius: 20,
                boxShadow: '0px 0px 0px 0px #D4FF3A',
                transition: { duration: 0.55, ease: [0.76, 0, 0.24, 1] },
              }
            : { opacity: 0, scale: 0.92, transition: { duration: 0.3 } }
        }
        transition={spring}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={photo.id}
            custom={dir}
            variants={imgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.thumb} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={photo.title || ''}
              onLoad={() => setLoaded((prev) => ({ ...prev, [photo.id]: true }))}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
              style={{ opacity: loaded[photo.id] ? 1 : 0 }}
              draggable={false}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Interface */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, delay: closing ? 0 : 0.2 }}
      >
        <div className="flex items-center justify-between px-4 pt-4 md:px-8 md:pt-6">
          <p className="font-display text-xl font-extrabold text-bone md:text-2xl">
            {String(index + 1).padStart(2, '0')}
            <span className="text-bone/40"> / {String(n).padStart(2, '0')}</span>
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={requestClose}
            aria-label="Close photo viewer"
            className={`${navButton} !bg-bone`}
          >
            ✕
          </button>
        </div>

        {n > 1 && (
          <>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 md:left-6">
              <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={navButton}>
                ←
              </button>
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 md:right-6">
              <button type="button" onClick={() => go(1)} aria-label="Next photo" className={navButton}>
                →
              </button>
            </div>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-5 text-center md:pb-8">
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="max-h-[7rem] max-w-3xl overflow-hidden"
          >
            {photo.title && (
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-bone md:text-4xl">{photo.title}</h2>
            )}
            {photo.description && <p className="mt-1 text-sm text-bone/75 md:text-base">{photo.description}</p>}
          </motion.div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

type Props = {
  photos: LightboxPhoto[];
  /** null = closed */
  origin: LightboxOrigin | null;
  onClose: () => void;
  /** Where photo i currently sits on screen, so the viewer can fly back to it. */
  getRect?: (index: number) => Rect | null;
};

export default function PhotoLightbox({ photos, origin, onClose, getRect }: Props) {
  return (
    <AnimatePresence>
      {origin && photos[origin.index] && (
        <LightboxView key="photo-lightbox" photos={photos} origin={origin} onClose={onClose} getRect={getRect} />
      )}
    </AnimatePresence>
  );
}
