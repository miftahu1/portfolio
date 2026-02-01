'use client'

import { useState } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight, User, MapPin } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Delhi',
    rating: 5,
    comment: 'The lakeside view combined with exquisite Assamese cuisine made our anniversary unforgettable. The Paneer Butter Masala was divine!',
    date: '2 weeks ago',
    avatarColor: 'bg-restaurant-amber-200',
    initials: 'PS'
  },
  {
    id: 2,
    name: 'Rajesh Kumar',
    location: 'Guwahati',
    rating: 5,
    comment: 'As a local, I can attest this is the best heritage dining experience in Assam. The Chicken Biryani is perfection.',
    date: '1 month ago',
    avatarColor: 'bg-restaurant-emerald-200',
    initials: 'RK'
  },
  {
    id: 3,
    name: 'Ananya Das',
    location: 'Kolkata',
    rating: 5,
    comment: 'Perfect spot for family gatherings. The kids loved the open space, and the staff went above and beyond.',
    date: '3 weeks ago',
    avatarColor: 'bg-restaurant-amber-100',
    initials: 'AD'
  },
  {
    id: 4,
    name: 'Michael Chen',
    location: 'Singapore',
    rating: 4,
    comment: 'Visiting from Singapore and found this gem! The ambience is serene, and the honey chilli paneer was incredible.',
    date: '2 months ago',
    avatarColor: 'bg-restaurant-emerald-100',
    initials: 'MC'
  },
  {
    id: 5,
    name: 'Sunita Patel',
    location: 'Mumbai',
    rating: 5,
    comment: 'The heritage feel is authentic, and the food quality is exceptional. Must try the Dal Makhani!',
    date: '1 week ago',
    avatarColor: 'bg-restaurant-amber-200',
    initials: 'SP'
  },
  {
    id: 6,
    name: 'Amit Verma',
    location: 'Sivasagar',
    rating: 5,
    comment: 'Our go-to place for special occasions. The service is impeccable, and the lakeside seating is magical.',
    date: '3 days ago',
    avatarColor: 'bg-restaurant-emerald-200',
    initials: 'AV'
  }
]

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredTestimonials = activeFilter === 'all' 
    ? testimonials 
    : activeFilter === '5-star'
      ? testimonials.filter(t => t.rating === 5)
      : testimonials.filter(t => t.rating === 4)

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev === Math.ceil(filteredTestimonials.length / 2) - 1 ? 0 : prev + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.ceil(filteredTestimonials.length / 2) - 1 : prev - 1
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`${
          i < rating
            ? 'text-restaurant-amber-500 fill-restaurant-amber-500'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-restaurant-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-restaurant-emerald-100 rounded-full mb-4">
            <Quote className="text-restaurant-emerald-700" size={28} />
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl text-restaurant-emerald-900 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied guests who have experienced the 
            Heritage Jaysagar difference
          </p>
          
          {/* Rating Filter */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-6 py-2 rounded-full transition-all ${
                activeFilter === 'all'
                  ? 'bg-restaurant-emerald-800 text-white'
                  : 'bg-white text-restaurant-emerald-800 border border-restaurant-emerald-200 hover:bg-restaurant-emerald-50'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setActiveFilter('5-star')}
              className={`px-6 py-2 rounded-full transition-all ${
                activeFilter === '5-star'
                  ? 'bg-restaurant-emerald-800 text-white'
                  : 'bg-white text-restaurant-emerald-800 border border-restaurant-emerald-200 hover:bg-restaurant-emerald-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="text-restaurant-amber-500 fill-restaurant-amber-500" />
                  ))}
                </div>
                <span>5-Star</span>
              </div>
            </button>
            <button
              onClick={() => setActiveFilter('4-star')}
              className={`px-6 py-2 rounded-full transition-all ${
                activeFilter === '4-star'
                  ? 'bg-restaurant-emerald-800 text-white'
                  : 'bg-white text-restaurant-emerald-800 border border-restaurant-emerald-200 hover:bg-restaurant-emerald-50'
              }`}
            >
              4-Star & Above
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-restaurant-card mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-restaurant-emerald-900">4.7</div>
              <div className="flex justify-center my-2">
                {renderStars(5)}
              </div>
              <p className="text-sm text-gray-600">Overall Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-restaurant-emerald-900">6,000+</div>
              <p className="text-sm text-gray-600">Google Reviews</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-restaurant-emerald-900">94%</div>
              <p className="text-sm text-gray-600">Would Return</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-restaurant-emerald-900">4.9</div>
              <p className="text-sm text-gray-600">Service Rating</p>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-restaurant-elegant flex items-center justify-center hover:bg-restaurant-amber-50 transition-colors"
          >
            <ChevronLeft className="text-restaurant-emerald-700" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-restaurant-elegant flex items-center justify-center hover:bg-restaurant-amber-50 transition-colors"
          >
            <ChevronRight className="text-restaurant-emerald-700" />
          </button>

          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(filteredTestimonials.length / 2) }).map((_, groupIndex) => (
                <div key={groupIndex} className="min-w-full">
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredTestimonials.slice(groupIndex * 2, groupIndex * 2 + 2).map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-white rounded-2xl p-8 shadow-restaurant-card hover:shadow-restaurant-elegant transition-shadow duration-300"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 ${testimonial.avatarColor} rounded-full flex items-center justify-center`}>
                              <span className="font-medium text-restaurant-emerald-900">
                                {testimonial.initials}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-medium text-restaurant-emerald-900">
                                {testimonial.name}
                              </h4>
                              <div className="flex items-center text-sm text-gray-500">
                                <MapPin size={12} className="mr-1" />
                                {testimonial.location}
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            {renderStars(testimonial.rating)}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-4 italic">
                          "{testimonial.comment}"
                        </p>
                        
                        <div className="text-sm text-gray-400">
                          {testimonial.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: Math.ceil(filteredTestimonials.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-restaurant-emerald-600 w-8'
                    : 'bg-restaurant-emerald-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Google Reviews CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Read more reviews from our guests
          </p>
          <a
            href="https://www.google.com/maps/place/Heritage+Jaysagar/@26.9552713,94.6225636,17z"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-3 bg-white border border-restaurant-emerald-200 text-restaurant-emerald-800 px-8 py-4 rounded-full hover:bg-restaurant-emerald-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < 5
                        ? 'text-restaurant-amber-500 fill-restaurant-amber-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 font-medium">4.7</span>
            </div>
            <span>View on Google Maps</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}