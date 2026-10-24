'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';
import { fetchPhotos } from '@/lib/firestore';
import type { Photo } from '@/lib/types';
import SectionHeading from '@/components/ui/SectionHeading';
import Skeleton from '@/components/ui/Skeleton';
import PhotoCarousel from '@/components/photos/PhotoCarousel';
import PhotoLightbox, {
  originFromElement,
  type LightboxOrigin,
  type LightboxPhoto,
  type Rect,
} from '@/components/photos/PhotoLightbox';
import { cloudUrl } from '@/components/photos/utils';

const pill =
  'inline-flex items-center gap-2 self-start rounded-full border-2 border-bone px-5 py-2.5 text-sm font-bold text-bone transition-colors hover:bg-bone hover:text-ink md:self-auto';

export default function FeaturedPhotos() {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [origin, setOrigin] = useState<LightboxOrigin | null>(null);
  const itemRefs = useRef<Record<number, HTMLElement | null>>({});

  useEffect(() => {
    fetchPhotos(true).then(setPhotos);
  }, []);

  const carouselPhotos = useMemo(
    () => (photos ?? []).map((p) => ({ id: p.id, thumb: cloudUrl(p.publicId, 800), title: p.title })),
    [photos]
  );

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

  const onOpen = useCallback((i: number, el: HTMLElement) => setOrigin(originFromElement(i, el)), []);
  const onClose = useCallback(() => setOrigin(null), []);
  const getRect = useCallback((i: number): Rect | null => {
    const el = itemRefs.current[i];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }, []);

  return (
    <section className="py-12 md:py-24">
      <SectionHeading
        title="Featured Photos"
        description="A selection of my favorite shots. Each photo has a story to tell."
        action={
          <Link href="/photos" className={pill}>
            <span>View All Photos</span>
            <IconArrowRight size={18} />
          </Link>
        }
      />

      {!photos ? (
        <Skeleton className="mx-auto h-[26rem] w-full rounded-[28px] md:h-[34rem]" />
      ) : photos.length === 0 ? (
        <p className="py-10 text-center text-muted">No featured photos yet. Check back soon.</p>
      ) : (
        <PhotoCarousel
          photos={carouselPhotos}
          itemRefs={itemRefs}
          onOpen={onOpen}
          autoPlayMs={3800}
          paused={!!origin}
        />
      )}

      <PhotoLightbox photos={lbPhotos} origin={origin} onClose={onClose} getRect={getRect} />
    </section>
  );
}
