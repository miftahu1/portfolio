'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { IconLoader, IconPhoto } from '@tabler/icons-react';

// Custom slide type for the lightbox
type CustomSlide = Slide & {
    title?: string;
    description?: string;
};

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
        setPhotos(data);
        setLoading(false);
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

  const slides: CustomSlide[] = photos.map(photo => ({
    src: `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_1600/v1/${photo.publicId}`,
    title: photo.title,
    description: photo.description,
  }));

  return (
    <div className="bg-gray-900 min-h-screen text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <header className="text-center mb-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Photo Gallery</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-400">A collection of my work. Click on any image to view it in fullscreen.</p>
            </header>
            
            {loading ? (
                <div className="flex justify-center items-center h-96">
                <IconLoader size={56} className="animate-spin text-accent-purple" />
                </div>
            ) : photos.length > 0 ? (
                <div className="masonry-gallery-2-col sm:masonry-gallery-3-col md:masonry-gallery-4-col gap-4">
                    {photos.map((photo, index) => (
                        <div key={photo.id} className="break-inside-avoid rounded-lg overflow-hidden group relative cursor-pointer shadow-lg transform hover:-translate-y-1 transition-transform duration-300" onClick={() => handleOpen(index)}>
                            <img 
                                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_thumb,w_800/v1/${photo.publicId}`}
                                alt={photo.title || ''} 
                                className="w-full h-auto object-cover transition-opacity duration-300 group-hover:opacity-90"
                            />
                             <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div className="text-white">
                                    {photo.title && <h3 className="text-lg font-bold">{photo.title}</h3>}
                                    {photo.description && <p className="text-sm">{photo.description}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <IconPhoto size={64} className="mx-auto text-gray-600"/>
                    <p className="mt-4 text-xl text-gray-500">The gallery is currently empty.</p>
                </div>
            )}
        </div>

        <Lightbox
            open={open}
            close={() => setOpen(false)}
            slides={slides}
            index={currentIndex}
            styles={{ container: { backgroundColor: "rgba(0, 0, 0, .9)" } }}
            render={{ 
                slide: ({ slide }) => {
                    const customSlide = slide as CustomSlide;
                    return (
                        <div className="relative w-full h-full flex justify-center items-center">
                            <img 
                                alt={customSlide.title || ''}
                                src={customSlide.src}
                                className="max-w-full max-h-full object-contain rounded-lg"
                            />
                            {(customSlide.title || customSlide.description) && (
                                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-3xl text-center p-4 bg-black/50 rounded-lg backdrop-blur-sm">
                                    {customSlide.title && <h2 className="text-2xl font-bold">{customSlide.title}</h2>}
                                    {customSlide.description && <p className="mt-2 text-gray-300">{customSlide.description}</p>}
                                </div>
                            )}
                        </div>
                    )
                }
            }}
        />
    </div>
  );
}
