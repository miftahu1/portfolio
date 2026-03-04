'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { IconLoader } from '@tabler/icons-react';

export default function PhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch('/api/photos')
      .then(res => res.json())
      .then(data => {
        setPhotos(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleOpen = (index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const slides = photos.map(photo => ({
    src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1600/v1/${photo.publicId}`,
    title: photo.title,
    description: photo.description,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">All Photos</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <IconLoader size={48} className="animate-spin text-accent-purple" />
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo, index) => (
            <div key={photo.id} className="break-inside-avoid cursor-pointer" onClick={() => handleOpen(index)}>
              <img 
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_800/v1/${photo.publicId}`}
                alt={photo.title || ''} 
                className="w-full h-auto rounded-lg shadow-lg hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        index={currentIndex}
        render={{ 
            slide: ({ slide, rect }) => (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                    <img 
                        alt={slide.title || ''}
                        src={slide.src}
                        style={{ 
                            width: "100%", 
                            height: "100%", 
                            objectFit: "contain" 
                        }}
                    />
                    {(slide.title || slide.description) && (
                        <div 
                            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white"
                        >
                            {slide.title && <h2 className="text-lg font-bold">{slide.title}</h2>}
                            {slide.description && <p>{slide.description}</p>}
                        </div>
                    )}
                </div>
            )
        }}
      />
    </div>
  );
}
