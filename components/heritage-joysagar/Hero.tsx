'use client'

import Image from 'next/image'
import { Star, Clock, MapPin } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative h-screen max-h-[800px] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-emerald-900/40 z-10" />
        <Image
          src="/heritage-joysagar/hero/lakeside-view.jpg"
          alt="Heritage Jaysagar lakeside view"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <Star className="text-amber-500 fill-amber-500 mr-2" size={18} />
              <span className="font-medium text-emerald-800">4.7★ with 6,000+ reviews</span>
            </div>
            
            <h1 className="font-playfair text-5xl md:text-7xl text-white mb-6">
              Heritage Dining by the
              <span className="block text-amber-200">Lakeside</span>
            </h1>
            
            <p className="text-xl text-amber-50 mb-8 max-w-lg">
              Experience serene lakeside dining with authentic Assamese cuisine, 
              where heritage meets contemporary luxury.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center text-amber-100">
                <Clock className="mr-2" size={20} />
                <span>Open Today: 8AM - 11PM</span>
              </div>
              <div className="flex items-center text-amber-100">
                <MapPin className="mr-2" size={20} />
                <span>Joysagar–Nazira Road, Sivasagar</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <a
                href="#reservations"
                className="bg-amber-500 text-emerald-900 px-8 py-4 rounded-full font-medium hover:bg-amber-400 transition-colors"
              >
                Reserve Your Table
              </a>
              <a
                href="#gallery"
                className="bg-transparent border-2 border-amber-200 text-amber-100 px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                View Gallery
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-6 h-10 border-2 border-amber-200 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-amber-200 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}