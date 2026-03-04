'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchPhotos } from '@/lib/firestore';
import { Photo } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { IconArrowRight } from '@tabler/icons-react';
import Skeleton from '@/components/ui/Skeleton';

export default function FeaturedPhotos() {
  const [photos, setPhotos] = useState<Photo[] | null>(null);

  useEffect(() => {
    fetchPhotos(true).then(setPhotos);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-12 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          className="mb-8 md:mb-12 flex items-center justify-between"
        >
            <div className="flex-1">
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
                    <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
                        Featured Photos
                    </span>
                </h2>
                <p className="text-base text-white/70 max-w-lg">
                    A selection of my favorite shots. Each photo has a story to tell.
                </p>
            </div>
            <Link href="/photos" className="hidden md:inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <span>View All</span>
                <IconArrowRight size={20} />
            </Link>
        </motion.div>

        {!photos ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="aspect-video rounded-lg" />
                <Skeleton className="aspect-video rounded-lg" />
            </div>
        ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              transition={{ staggerChildren: 0.1 }}
              className="columns-2 md:columns-3 lg:columns-4 gap-3"
            >
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  variants={cardVariants}
                  className="break-inside-avoid mb-3 group relative rounded-lg overflow-hidden"
                >
                    <Image
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800/v1/${photo.publicId}`}
                        alt={photo.title || 'Featured photo'}
                        width={800}
                        height={600}
                        className="w-full h-auto transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
                    <div className="absolute bottom-0 left-0 p-4">
                        <h3 className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">{photo.title}</h3>
                    </div>
                    <Link href="/photos" className="absolute inset-0">
                        <span className="sr-only">View {photo.title} in photos gallery</span>
                    </Link>
                </motion.div>
              ))}
            </motion.div>
        )}
        <div className="mt-8 text-center md:hidden">
            <Link href="/photos" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                <span>View All Photos</span>
                <IconArrowRight size={20} />
            </Link>
        </div>
      </div>
    </section>
  );
}
