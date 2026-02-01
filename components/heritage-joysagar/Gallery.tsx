'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

const galleryImages = [
  {
    category: 'Ambience',
    images: [
      { src: '/heritage-joysagar/ambience/interior.jpg', alt: 'Elegant interior dining area' },
      { src: '/heritage-joysagar/ambience/interior2.jpg', alt: 'Heritage-inspired interior design' },
      { src: '/heritage-joysagar/ambience/night-view.jpg', alt: 'Night view of lakeside dining' },
      { src: '/heritage-joysagar/hero/outdoor-seating.jpg', alt: 'Outdoor seating by the lake' },
    ]
  },
  {
    category: 'Signature Dishes',
    images: [
      { src: '/heritage-joysagar/food/biriyani.jpg', alt: 'Signature Chicken Biryani' },
      { src: '/heritage-joysagar/food/kadhai-chicken.jpg', alt: 'Kadhai Chicken' },
      { src: '/heritage-joysagar/food/meat.jpg', alt: 'Special Meat Curry' },
      { src: '/heritage-joysagar/food/pick-me-up_starter.jpg', alt: 'Assorted Starters Platter' },
    ]
  },
  {
    category: 'Lakeside Views',
    images: [
      { src: '/heritage-joysagar/hero/lakeside-view.jpg', alt: 'Serene lakeside view' },
      { src: '/heritage-joysagar/hero/outdoor-seating.jpg', alt: 'Outdoor dining setup' },
    ]
  }
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [currentCategory, setCurrentCategory] = useState('Ambience')

  const openLightbox = (src: string) => {
    setSelectedImage(src)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  const currentImages = galleryImages.find(cat => cat.category === currentCategory)?.images || []

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl md:text-5xl text-emerald-900 mb-4">
            Experience Our Ambience
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the perfect blend of heritage elegance and natural beauty at our lakeside restaurant.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {galleryImages.map((category) => (
            <button
              key={category.category}
              onClick={() => setCurrentCategory(category.category)}
              className={`px-6 py-2 rounded-full transition-all ${
                currentCategory === category.category
                  ? 'bg-emerald-800 text-white'
                  : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
              }`}
            >
              {category.category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentImages.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-xl"
              onClick={() => openLightbox(image.src)}
            >
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-emerald-800 font-medium">View</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Photo Counter */}
        <div className="text-center mt-8 text-gray-600">
          <p>{currentImages.length} photos in {currentCategory}</p>
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-amber-300 transition-colors"
            >
              <X size={32} />
            </button>
            
            <div className="relative w-full max-w-4xl h-[80vh]">
              <Image
                src={selectedImage}
                alt="Enlarged view"
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
            
            <button
              onClick={() => {
                const currentIndex = currentImages.findIndex(img => img.src === selectedImage)
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentImages.length - 1
                setSelectedImage(currentImages[prevIndex].src)
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-300 transition-colors"
            >
              <ChevronLeft size={48} />
            </button>
            
            <button
              onClick={() => {
                const currentIndex = currentImages.findIndex(img => img.src === selectedImage)
                const nextIndex = currentIndex < currentImages.length - 1 ? currentIndex + 1 : 0
                setSelectedImage(currentImages[nextIndex].src)
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-amber-300 transition-colors"
            >
              <ChevronRight size={48} />
            </button>
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
              {currentImages.findIndex(img => img.src === selectedImage) + 1} / {currentImages.length}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Share your moments with us</p>
          <a
            href="https://www.instagram.com/heritagejaysagar.official/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-full font-medium hover:opacity-90 transition-opacity"
          >
            <span className="mr-2">📸</span>
            Tag us on Instagram #HeritageJaysagar
          </a>
        </div>
      </div>
    </section>
  )
}