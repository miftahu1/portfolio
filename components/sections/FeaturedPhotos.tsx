'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPhotos } from '@/lib/firestore';
import { Photo } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { IconArrowRight } from '@tabler/icons-react';
import Skeleton from '@/components/ui/Skeleton';
import SectionHeading from '@/components/ui/SectionHeading';
import Tilt from '@/components/ui/Tilt';

// Every frame has a fixed aspect ratio, so nothing can change height while
// images load or scroll into view. That is what keeps the gallery from re-flowing.
const ASPECTS = ['aspect-[4/5]', 'aspect-square', 'aspect-[4/3]', 'aspect-[3/4]', 'aspect-[5/4]', 'aspect-[4/5]'];

export default function FeaturedPhotos() {
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  useEffect(() => {
    fetchPhotos(true).then(setPhotos);
  }, []);

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Featured Photos"
          description="A selection of my favorite shots. Each photo has a story to tell."
          action={
            <Link
              href="/photos"
              className="hidden items-center gap-2 rounded-full border-2 border-bone px-5 py-2.5 text-sm font-bold text-bone transition-colors hover:bg-bone hover:text-ink md:inline-flex"
            >
              <span>View All</span>
              <IconArrowRight size={18} />
            </Link>
          }
        />

        {!photos ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className={`${ASPECTS[i]} rounded-[20px]`} />
            ))}
          </div>
        ) : (
          <div className="columns-2 gap-3 md:columns-3 md:gap-4 lg:columns-4">
            {photos.map((photo, i) => (
              <div key={photo.id} className="mb-3 break-inside-avoid md:mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ type: 'spring', stiffness: 110, damping: 16 }}
                >
                  <Tilt max={5} className="rounded-[20px]">
                    <div
                      className={`group relative overflow-hidden rounded-[20px] border-2 border-ink bg-surface shadow-[5px_5px_0_0_rgba(244,241,255,0.18)] ${ASPECTS[i % ASPECTS.length]}`}
                    >
                      <Image
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800/v1/${photo.publicId}`}
                        alt={photo.title || 'Featured photo'}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="translate-y-4 font-display text-lg font-extrabold text-lime opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                          {photo.title}
                        </h3>
                      </div>
                      <Link href="/photos" className="absolute inset-0">
                        <span className="sr-only">View {photo.title} in photos gallery</span>
                      </Link>
                    </div>
                  </Tilt>
                </motion.div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href="/photos" className="inline-flex items-center gap-2 rounded-full border-2 border-bone px-5 py-2.5 text-sm font-bold text-bone">
            <span>View All Photos</span>
            <IconArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
