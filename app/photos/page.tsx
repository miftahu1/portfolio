'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetch('/api/photos')
      .then(res => res.json())
      .then(setPhotos);
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Photos</h1>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {photos.map(photo => (
          <div key={photo.id} className="break-inside-avoid">
            <img src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800/v1/${photo.publicId}`} alt="" className="w-full h-auto rounded-lg shadow-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
