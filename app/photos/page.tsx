'use client';

import { useState, useEffect } from 'react';
import { Photo } from '@/lib/types';
import Lightbox, { type Slide } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { IconLoader, IconPhoto } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import PageHeader from '@/components/ui/PageHeader';

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

  const photoVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
        <PageHeader 
            title="Photo Gallery" 
            description="A collection of my work. Click on any image to view it in fullscreen."
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {loading ? (
                <div className="flex justify-center items-center h-96">
                    <IconLoader size={56} className="animate-spin text-accent-purple" />
                </div>
            ) : photos.length > 0 ? (
                <motion.div 
                    className="columns-2 md:columns-3 lg:columns-4 gap-3"
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.05 }}
                >
                    {photos.map((photo, index) => (
                        <motion.div 
                            key={photo.id} 
                            className="break-inside-avoid mb-3 rounded-lg overflow-hidden group relative cursor-pointer shadow-lg hover:shadow-accent-purple/20 transition-all duration-300"
                            onClick={() => handleOpen(index)}
                            variants={photoVariants}
                            layout
                        >
                            <Image 
                                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_800/v1/${photo.publicId}`}
                                alt={photo.title || ''} 
                                width={800}
                                height={600} // This is just a placeholder, actual height will be auto
                                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                priority={index < 8} // Prioritize loading for first few images
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <div className="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {photo.title && <h3 className="text-lg font-bold">{photo.title}</h3>}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20">
                    <IconPhoto size={64} className="mx-auto text-gray-600"/>
                    <p className="mt-4 text-xl text-gray-500">The gallery is currently empty.</p>
                    <p className="text-sm text-gray-400">Check back later for more photos.</p>
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
                            <Image 
                                alt={customSlide.title || ''}
                                src={customSlide.src || ''}
                                width={1600}
                                height={1200}
                                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
                            />
                            {(customSlide.title || customSlide.description) && (
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl text-center p-4 bg-black/50 rounded-lg backdrop-blur-sm">
                                    {customSlide.title && <h2 className="text-2xl font-bold">{customSlide.title}</h2>}
                                    {customSlide.description && <p className="mt-2 text-gray-300 max-w-2xl mx-auto">{customSlide.description}</p>}
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
