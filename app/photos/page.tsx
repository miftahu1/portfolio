'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Photo } from '@/lib/types';
import { IconLoader, IconPhoto } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader';
import Tilt from '@/components/ui/Tilt';
import PhotoCarousel from '@/components/photos/PhotoCarousel';
import PhotoLightbox, {
  originFromElement,
  type LightboxOrigin,
  type LightboxPhoto,
  type Rect,
} from '@/components/photos/PhotoLightbox';
import { cloudUrl, GRID_ASPECTS } from '@/components/photos/utils';

type View = 'grid' | 'carousel';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('grid');
  const [origin, setOrigin] = useState<LightboxOrigin | null>(null);
  const itemRefs = useRef<Record<number, HTMLElement | null>>({});

  useEffect(() => {
    setLoading(true);
    fetch('/api/photos')
      .then(res => res.json())
      .then(data => {
        setPhotos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const lbPhotos: LightboxPhoto[] = useMemo(
    () =>
      photos.map(photo => ({
        id: photo.id,
        src: cloudUrl(photo.publicId, 1600),
        thumb: cloudUrl(photo.publicId, 800),
        title: photo.title,
        description: photo.description,
      })),
    [photos]
  );

  const carouselPhotos = useMemo(
    () => photos.map(photo => ({ id: photo.id, thumb: cloudUrl(photo.publicId, 800), title: photo.title })),
    [photos]
  );

  const onOpen = useCallback((index: number, el: HTMLElement) => setOrigin(originFromElement(index, el)), []);
  const onClose = useCallback(() => setOrigin(null), []);
  const getRect = useCallback((index: number): Rect | null => {
    const el = itemRefs.current[index];
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  }, []);

  return (
    <div className="min-h-screen text-white">
        <PageHeader
            title="Photo Gallery"
            description="A collection of my work. Click on any image to view it in fullscreen."
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <IconLoader size={56} className="animate-spin text-lime" />
                </div>
            ) : photos.length > 0 ? (
                <>
                    <div className="mb-10 flex justify-center">
                        <div
                            role="group"
                            aria-label="Gallery view"
                            className="inline-flex rounded-full border-2 border-bone/25 bg-ink/40 p-1"
                        >
                            {(['grid', 'carousel'] as const).map((v) => (
                                <button
                                    key={v}
                                    type="button"
                                    aria-pressed={view === v}
                                    onClick={() => setView(v)}
                                    className={`relative rounded-full px-5 py-2 text-sm font-bold transition-colors ${
                                        view === v ? 'text-ink' : 'text-bone/80 hover:text-lime'
                                    }`}
                                >
                                    {view === v && (
                                        <motion.span
                                            layoutId="photo-view-pill"
                                            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                                            className="absolute inset-0 rounded-full bg-lime"
                                        />
                                    )}
                                    <span className="relative z-10">{v === 'grid' ? 'Grid' : '3D Carousel'}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {view === 'grid' ? (
                        <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
                            {photos.map((photo, index) => (
                                <div key={photo.id} className="mb-3 break-inside-avoid md:mb-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: '-40px' }}
                                        transition={{ type: 'spring', stiffness: 110, damping: 16 }}
                                    >
                                        <Tilt max={4} className="rounded-[20px]">
                                            <button
                                                type="button"
                                                ref={(el) => {
                                                    itemRefs.current[index] = el;
                                                }}
                                                onClick={(e) => onOpen(index, e.currentTarget)}
                                                aria-label={`Open photo${photo.title ? `: ${photo.title}` : ''}`}
                                                className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-[20px] border-2 border-ink bg-surface shadow-[5px_5px_0_0_rgba(244,241,255,0.18)] transition-shadow duration-300 hover:shadow-[8px_8px_0_0_#D4FF3A] ${GRID_ASPECTS[index % GRID_ASPECTS.length]}`}
                                            >
                                                <Image
                                                    src={cloudUrl(photo.publicId, 800)}
                                                    alt={photo.title || ''}
                                                    fill
                                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                                    priority={index < 8}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                                                {photo.title && (
                                                    <div className="absolute bottom-0 left-0 p-4 text-left">
                                                        <h3 className="translate-y-4 font-display text-lg font-extrabold text-lime opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                                            {photo.title}
                                                        </h3>
                                                    </div>
                                                )}
                                            </button>
                                        </Tilt>
                                    </motion.div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <PhotoCarousel photos={carouselPhotos} itemRefs={itemRefs} onOpen={onOpen} />
                    )}
                </>
            ) : (
                <div className="text-center py-20">
                    <IconPhoto size={64} className="mx-auto text-gray-500"/>
                    <p className="mt-4 text-xl text-gray-400">The gallery is currently empty.</p>
                    <p className="text-sm text-gray-300">Check back later for more photos.</p>
                </div>
            )}
        </div>

        <PhotoLightbox photos={lbPhotos} origin={origin} onClose={onClose} getRect={getRect} />
    </div>
  );
}
