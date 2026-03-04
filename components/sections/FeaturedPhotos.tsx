'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import Link from 'next/link';
import { IconLoader } from '@tabler/icons-react';

export default function FeaturedPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/photos?featured=true')
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch featured photos');
        }
        return res.json();
      })
      .then(data => {
        setPhotos(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-gray-900 text-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-accent-blue tracking-wide uppercase">Gallery</h2>
          <p className="mt-1 text-4xl font-extrabold sm:text-5xl sm:tracking-tight lg:text-6xl">Featured Photos</p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-400">A curated collection of my favorite shots.</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <IconLoader size={48} className="animate-spin text-accent-purple" />
          </div>
        ) : photos.length > 0 ? (
          <div className="mt-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((photo, index) => (
                <Link href="/photos" key={photo.id} className={`group relative block overflow-hidden rounded-xl ${index === 0 || index === 5 ? 'col-span-2 row-span-2' : ''}`}>
                  <img 
                    src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,ar_1:1,g_auto,w_800/v1/${photo.publicId}`}
                    alt={photo.title || 'Featured photo'}
                    className="w-full h-full object-cover transform transition-all duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-lg font-bold">{photo.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
                <Link href="/photos" className="inline-block bg-accent-blue text-white font-bold py-3 px-8 rounded-lg hover:bg-accent-blue-dark transition-colors duration-300">
                    View Full Gallery
                </Link>
            </div>
          </div>
        ) : (
          <div className="text-center mt-12 text-gray-500">
            <p>No featured photos to display at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
