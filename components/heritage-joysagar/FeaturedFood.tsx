'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Clock, CheckCircle } from 'lucide-react'

const featuredFood = [
  {
    id: 1,
    name: 'Signature Chicken Biryani',
    description: 'Aromatic basmati rice cooked with tender chicken, saffron, and royal spices',
    price: '₹450',
    image: '/heritage-joysagar/food/biriyani.jpg',
    rating: 4.9,
    prepTime: '25 mins',
    tags: ['Best Seller', 'Chef Special']
  },
  {
    id: 2,
    name: 'Kadhai Chicken',
    description: 'Succulent chicken pieces cooked in traditional kadhai with bell peppers and spices',
    price: '₹420',
    image: '/heritage-joysagar/food/kadhai-chicken.jpg',
    rating: 4.8,
    prepTime: '20 mins',
    tags: ['Spicy', 'Fresh']
  },
  {
    id: 3,
    name: 'Royal Meat Curry',
    description: 'Tender meat slow-cooked in rich gravy with aromatic spices',
    price: '₹480',
    image: '/heritage-joysagar/food/meat.jpg',
    rating: 4.7,
    prepTime: '30 mins',
    tags: ['Premium', 'Heritage Recipe']
  },
  {
    id: 4,
    name: 'Assorted Starters Platter',
    description: 'A delightful mix of vegetarian and non-vegetarian starters with dipping sauces',
    price: '₹380',
    image: '/heritage-joysagar/food/pick-me-up_starter.jpg',
    rating: 4.9,
    prepTime: '15 mins',
    tags: ['Sharing', 'Perfect Starter']
  }
]

const dietaryOptions = [
  { icon: '🥗', label: 'Vegetarian Options' },
  { icon: '🌱', label: 'Vegan Friendly' },
  { icon: '🚫', label: 'Gluten Free' },
  { icon: '🌶️', label: 'Spice Levels' },
  { icon: '👶', label: 'Kids Menu' },
  { icon: '🏃', label: 'Quick Bites' }
]

export default function FeaturedFood() {
  const [activeFilter, setActiveFilter] = useState('all')

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full mb-4">
            <CheckCircle size={18} className="mr-2" />
            <span>Freshly Prepared Daily</span>
          </div>
          
          <h2 className="font-playfair text-4xl md:text-5xl text-emerald-900 mb-4">
            Culinary Highlights
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most-loved dishes, crafted with locally sourced ingredients and traditional recipes.
          </p>
        </div>

        {/* Dietary Options */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {dietaryOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-amber-200"
            >
              <span className="mr-2 text-xl">{option.icon}</span>
              <span className="text-sm text-gray-700">{option.label}</span>
            </div>
          ))}
        </div>

        {/* Food Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {['all', 'best sellers', 'vegetarian', 'non-veg', 'quick bites'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-full transition-all ${
                activeFilter === filter
                  ? 'bg-emerald-800 text-white'
                  : 'bg-white text-emerald-800 border border-emerald-200 hover:bg-emerald-50'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {/* Featured Food Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featuredFood.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Food Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {/* Tags */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-emerald-800/90 text-white text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {/* Rating */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
                  <Star size={14} className="text-amber-500 fill-amber-500 mr-1" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>
              </div>

              {/* Food Details */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-playfair text-xl text-emerald-900">{item.name}</h3>
                  <span className="font-bold text-amber-600">{item.price}</span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{item.prepTime}</span>
                  </div>
                  <button className="text-emerald-700 hover:text-emerald-900 font-medium">
                    Add to order →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-emerald-50 to-amber-50 rounded-3xl p-8">
          <h3 className="font-playfair text-3xl text-emerald-900 mb-4">
            Hungry for More?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Explore our full menu featuring over 100+ dishes, from traditional Assamese cuisine to contemporary favorites.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/menu"
              className="bg-emerald-800 text-white px-8 py-3 rounded-full font-medium hover:bg-emerald-700 transition-colors"
            >
              View Full Menu
            </a>
            <a
              href="https://wa.me/919864020240"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-emerald-800 text-emerald-800 px-8 py-3 rounded-full font-medium hover:bg-emerald-50 transition-colors"
            >
              <span className="flex items-center">
                <span className="mr-2">💬</span>
                Order via WhatsApp
              </span>
            </a>
          </div>
          
          {/* WhatsApp CTA */}
          <div className="mt-8 inline-flex items-center bg-white px-6 py-3 rounded-full shadow-sm">
            <span className="text-green-600 mr-2">📱</span>
            <span className="text-gray-700 mr-4">Quick order:</span>
            <a
              href="https://wa.me/919864020240"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-medium hover:text-emerald-900"
            >
              +91 98640 20240
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}