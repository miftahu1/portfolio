'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import Link from 'next/link';

export default function FeaturedPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetch('/api/photos?featured=true')
      .then(res => res.json())
      .then(setPhotos);
  }, []);

  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">Featured Photos</h2>
          <Link href="/photos" className="text-accent-blue hover:underline">
            View all photos
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id}>
              <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_400,h_400,g_auto/v1/${photo.publicId}`} alt="" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
