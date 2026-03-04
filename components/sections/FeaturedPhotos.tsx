'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import Link from 'next/link';
import { IconLoader, IconArrowRight } from '@tabler/icons-react';
import { useMedia } from 'react-use';

// A more dynamic masonry-like layout for featured photos
const getLayout = (photos: Photo[], isMobile: boolean) => {
    if (isMobile) {
        return photos.map(photo => ({ ...photo, colSpan: 1, rowSpan: 1 }));
    }

    if (photos.length === 0) return [];
    
    const layouts = [
        [2, 1, 1, 1, 1, 2, 1, 1],
        [1, 2, 1, 1, 2, 1, 1, 1],
        [1, 1, 2, 1, 1, 1, 2, 1]
    ];

    const selectedLayout = layouts[photos.length % layouts.length];

    return photos.map((photo, index) => {
        const layoutSize = selectedLayout[index % selectedLayout.length];
        return {
            ...photo,
            colSpan: layoutSize,
            rowSpan: layoutSize,
        };
    });
}

export default function FeaturedPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMedia('(max-width: 768px)', false);

  useEffect(() => {
    fetch('/api/photos?featured=true&limit=8')
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then(data => {
        setPhotos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const photoLayout = getLayout(photos, isMobile);

  return (
    <section className="bg-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-lg font-semibold text-accent-purple tracking-wider uppercase">My Work</h2>
                <p className="mt-2 text-4xl font-extrabold text-white sm:text-5xl">Featured Photos</p>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400">A curated selection of my proudest moments behind the lens.</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <IconLoader size={56} className="animate-spin text-accent-purple" />
                </div>
            ) : photos.length > 0 ? (
                <div className="grid grid-flow-dense auto-rows-fr grid-cols-2 md:grid-cols-4 gap-4">
                    {photoLayout.map(photo => (
                        <Link href="/photos" key={photo.id} className="group relative overflow-hidden rounded-2xl shadow-lg transform transition-transform duration-300 hover:scale-105" style={{ gridColumn: `span ${photo.colSpan}`, gridRow: `span ${photo.rowSpan}`}}>
                            <img 
                                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,g_auto,w_800/v1/${photo.publicId}`}
                                alt={photo.title || 'Featured photo'}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 transition-opacity duration-300 group-hover:from-black/80">
                                <div className="absolute bottom-0 left-0 p-4">
                                    <h3 className="text-white text-lg font-bold drop-shadow-md">{photo.title}</h3>
                                    <p className="text-gray-300 text-sm drop-shadow-md max-w-xs">{photo.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-12">No featured photos yet.</p>
            )}
            
            <div className="text-center mt-12">
                <Link href="/photos" className="inline-flex items-center gap-2 bg-accent-purple text-white font-bold py-3 px-8 rounded-lg hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    <span>View Full Gallery</span>
                    <IconArrowRight size={20} />
                </Link>
            </div>
        </div>
    </section>
  );
}
