'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { IconArrowRight } from '@tabler/icons-react';
import { fetchPhotos } from '@/lib/firestore';
import type { Photo } from '@/lib/types';
import SectionHeading from '@/components/ui/SectionHeading';
import Skeleton from '@/components/ui/Skeleton';
import PhotoLightbox, {
  originFromElement,
  type LightboxOrigin,
  type LightboxPhoto,
  type Rect,
} from '@/components/photos/PhotoLightbox';
import { cloudUrl } from '@/components/photos/utils';

// width / height of each frame; the pattern gives the strip some rhythm
const RATIOS = [0.8, 0.75, 1, 0.8, 1.25, 0.75];
const FRAME_H = 'min(62vh, 36rem)';

const pill =
  'inline-flex items-center gap-2 rounded-full border-2 border-bone px-5 py-2.5 text-sm font-bold text-bone transition-colors hover:bg-bone hover:text-ink';

type FrameProps = {
  photo: Photo;
  index: number;
  x: MotionValue<number>;
  flat: boolean;
  onOpen: (index: number, el: HTMLElement) => void;
  setRef: (index: number, el: HTMLElement | null) => void;
};

/** One photo. Its tilt, scale and inner parallax follow its distance from the screen centre. */
function Frame({ photo, index, x, flat, onOpen, setRef }: FrameProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const ratio = RATIOS[index % RATIOS.length];

  const d = useTransform(x, (xv) => {
    const el = wrapRef.current;
    if (!el) return 0;
    const vw = window.innerWidth;
    return (el.offsetLeft + el.offsetWidth / 2 + xv - vw / 2) / (vw / 2);
  });
  const rotateY = useTransform(d, [-1, 0, 1], [30, 0, -30]);
  const scale = useTransform(d, [-1, 0, 1], [0.86, 1, 0.86]);
  const opacity = useTransform(d, [-1.2, -0.6, 0, 0.6, 1.2], [0.3, 0.9, 1, 0.9, 0.3]);
  const imgX = useTransform(d, [-1, 1], ['-7%', '7%']);

  return (
    <div
      ref={wrapRef}
      className="shrink-0"
      style={flat ? undefined : { marginTop: index % 2 ? '5rem' : '-2rem' }}
    >
      <motion.div
        style={flat ? undefined : { rotateY, scale, opacity, transformPerspective: 1200 }}
        className="will-change-transform"
      >
        <button
          type="button"
          ref={(el) => setRef(index, el)}
          onClick={(e) => onOpen(index, e.currentTarget)}
          aria-label={`Open photo${photo.title ? `: ${photo.title}` : ''}`}
          className="group relative block overflow-hidden rounded-[24px] border-2 border-ink bg-surface shadow-[8px_8px_0_0_rgba(244,241,255,0.2)] transition-shadow duration-300 hover:shadow-[12px_12px_0_0_#D4FF3A]"
          style={{ height: FRAME_H, width: `calc(${FRAME_H} * ${ratio})` }}
        >
          <motion.div style={flat ? undefined : { x: imgX }} className="absolute inset-[-7%]">
            <Image
              src={cloudUrl(photo.publicId, 800)}
              alt={photo.title || 'Featured photo'}
              fill
              sizes="(max-width: 768px) 70vw, 30vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-5">
            <h3 className="translate-y-4 font-display text-xl font-extrabold text-lime opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {photo.title}
            </h3>
          </div>
        </button>
      </motion.div>
    </div>
  );
}

export default function FeaturedPhotos() {
  const reduce = useReducedMotion();
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [origin, setOrigin] = useState<LightboxOrigin | null>(null);
  const [shiftPx, setShiftPx] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const frameRefs = useRef<Record<number, HTMLElement | null>>({});
  const shift = useMotionValue(0);

  useEffect(() => {
    fetchPhotos(true).then(setPhotos);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform([scrollYProgress, shift], (latest: number[]) => -latest[0] * latest[1]);

  // Section height = how far the strip has to travel + one screen, so scroll and motion stay 1:1
  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduce) return;
    const measure = () => {
      const s = Math.max(0, track.offsetWidth - window.innerWidth);
      shift.set(s);
      setShiftPx(s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [photos, reduce, shift]);

  const lbPhotos: LightboxPhoto[] = useMemo(
    () =>
      (photos ?? []).map((p) => ({
        id: p.id,
        src: cloudUrl(p.publicId, 1600),
        thumb: cloudUrl(p.publicId, 800),
        title: p.title,
        description: p.description,
      })),
    [photos]
  );

  const setRef = useCallback((i: number, el: HTMLElement | null) => {
    frameRefs.current[i] = el;
  }, []);
  const onOpen = useCallback((i: number, el: HTMLElement) => setOrigin(originFromElement(i, el)), []);
  const onClose = useCallback(() => setOrigin(null), []);
  const getRect = useCallback((i: number): Rect | null => {
    const el = frameRefs.current[i];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }, []);

  const heading = (
    <SectionHeading
      title="Featured Photos"
      description="A selection of my favorite shots. Each photo has a story to tell."
      className="!mb-0 md:!mb-0"
      action={
        <Link href="/photos" className={`${pill} self-start md:self-auto`}>
          <span>View All</span>
          <IconArrowRight size={18} />
        </Link>
      }
    />
  );

  // Loading / empty
  if (!photos) {
    return (
      <section className="py-12 md:py-24">
        <SectionHeading title="Featured Photos" />
        <div className="flex gap-5 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[40vh] w-[70vw] shrink-0 rounded-[24px] md:w-[28vw]" />
          ))}
        </div>
      </section>
    );
  }

  if (photos.length === 0) {
    return (
      <section className="py-12 md:py-24">
        <SectionHeading title="Featured Photos" description="No featured photos yet. Check back soon." />
      </section>
    );
  }

  const outro = (
    <div
      className="flex shrink-0 flex-col justify-between rounded-[24px] border-2 border-ink bg-lime p-8 text-ink shadow-[8px_8px_0_0_rgba(244,241,255,0.2)]"
      style={{ height: FRAME_H, width: 'min(80vw, 26rem)' }}
    >
      <p className="font-display text-4xl font-extrabold leading-[1] tracking-tight md:text-5xl">More in the gallery.</p>
      <Link
        href="/photos"
        className="inline-flex items-center gap-2 self-start rounded-full border-2 border-ink bg-ink px-5 py-3 text-sm font-extrabold text-lime transition-colors hover:bg-pink hover:text-ink"
      >
        <span>View All Photos</span>
        <IconArrowRight size={18} />
      </Link>
    </div>
  );

  const frames = photos.map((photo, i) => (
    <Frame key={photo.id} photo={photo} index={i} x={x} flat={!!reduce} onOpen={onOpen} setRef={setRef} />
  ));

  const lightbox = <PhotoLightbox photos={lbPhotos} origin={origin} onClose={onClose} getRect={getRect} />;

  // Reduced motion: a plain wrapping gallery, no pinning
  if (reduce) {
    return (
      <section className="py-12 md:py-24">
        {heading}
        <div className="mt-10 flex flex-wrap gap-6">
          {frames}
          {outro}
        </div>
        {lightbox}
      </section>
    );
  }

  return (
    <>
      <section
        ref={sectionRef}
        aria-label="Featured photos"
        className="relative"
        style={{
          marginLeft: 'calc(50% - 50vw)',
          width: '100vw',
          height: shiftPx === null ? '300dvh' : `calc(${shiftPx}px + 100dvh)`,
        }}
      >
        <div className="sticky top-0 flex h-[100dvh] items-center overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{
              x,
              paddingLeft: 'max(1rem, calc((100vw - 80rem) / 2 + 1rem))',
              paddingRight: '15vw',
            }}
            className="relative flex w-max items-center gap-6 will-change-transform md:gap-10"
          >
            <div className="shrink-0" style={{ width: 'min(85vw, 34rem)' }}>
              {heading}
            </div>
            {frames}
            {outro}
          </motion.div>

          <div
            aria-hidden="true"
            className="absolute bottom-8 left-1/2 h-1.5 w-[min(40rem,70vw)] -translate-x-1/2 overflow-hidden rounded-full bg-bone/10"
          >
            <motion.div style={{ scaleX: scrollYProgress }} className="h-full origin-left rounded-full bg-lime" />
          </div>
        </div>
      </section>
      {lightbox}
    </>
  );
}
