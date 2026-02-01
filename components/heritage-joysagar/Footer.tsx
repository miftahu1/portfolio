'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Facebook, 
  Instagram, 
  ExternalLink,
  Accessibility,
  Utensils,
  Coffee,
  Users,
  Car,
  Leaf,
  Heart
} from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'Full Menu', href: '/menu' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
    { name: 'Reservations', href: '#reservations' },
  ]

  const diningOptions = [
    'Breakfast',
    'Brunch',
    'Lunch',
    'Dinner',
    'Dessert',
    'Catering',
    'Private Dining',
  ]

  const amenities = [
    { icon: <Accessibility size={18} />, text: 'Wheelchair Accessible' },
    { icon: <Car size={18} />, text: 'Free Parking' },
    { icon: <Utensils size={18} />, text: 'Outdoor Seating' },
    { icon: <Users size={18} />, text: 'Family Friendly' },
    { icon: <Coffee size={18} />, text: 'Great Coffee' },
    { icon: <Leaf size={18} />, text: 'Vegetarian Options' },
  ]

  const socialLinks = [
    {
      platform: 'Facebook',
      icon: <Facebook size={20} />,
      url: 'https://www.facebook.com/JaysagarHeritageOfficial/',
      color: 'hover:bg-blue-600'
    },
    {
      platform: 'Instagram',
      icon: <Instagram size={20} />,
      url: 'https://www.instagram.com/heritagejaysagar.official/',
      color: 'hover:bg-pink-600'
    },
    {
      platform: 'Swiggy',
      icon: <ExternalLink size={20} />,
      url: 'https://www.swiggy.com/city/sivasagar/heritage-jaysagar-joysagar-sivasagar-rest248458',
      color: 'hover:bg-orange-500'
    },
  ]

  return (
    <footer className="bg-restaurant-emerald-900 text-restaurant-amber-50">
      {/* Top Section */}
      <div className="border-b border-restaurant-emerald-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
            <div className="text-center md:text-left">
              <h3 className="font-playfair text-2xl mb-2">Experience Heritage Dining</h3>
              <p className="text-restaurant-amber-100">Reserve your table for an unforgettable experience</p>
            </div>
            <a
              href="https://wa.me/919864020240"
              className="bg-restaurant-amber-500 text-restaurant-emerald-900 px-8 py-3 rounded-full font-medium hover:bg-restaurant-amber-400 transition-colors flex items-center space-x-2"
            >
              <Phone size={20} />
              <span>Call for Reservations</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Description */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-restaurant-amber-500 rounded-full flex items-center justify-center">
                <span className="font-playfair text-xl font-bold text-restaurant-emerald-900">HJ</span>
              </div>
              <div>
                <h2 className="font-playfair text-2xl">Heritage Jaysagar</h2>
                <p className="text-sm text-restaurant-amber-100">Since 2010</p>
              </div>
            </div>
            <p className="text-restaurant-amber-100 mb-6">
              A serene lakeside destination offering authentic Assamese cuisine in a heritage-inspired setting. 
              Where every meal is a celebration of tradition and taste.
            </p>
            
            {/* Amenities */}
            <div className="space-y-3">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-restaurant-amber-400">
                    {amenity.icon}
                  </div>
                  <span className="text-sm text-restaurant-amber-100">{amenity.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-xl mb-6 pb-3 border-b border-restaurant-emerald-800">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-restaurant-amber-100 hover:text-restaurant-amber-300 transition-colors flex items-center space-x-2"
                  >
                    <span className="w-1 h-1 bg-restaurant-amber-500 rounded-full"></span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <h4 className="font-playfair text-lg mt-8 mb-4">Dining Options</h4>
            <div className="flex flex-wrap gap-2">
              {diningOptions.map((option) => (
                <span
                  key={option}
                  className="px-3 py-1 bg-restaurant-emerald-800 text-restaurant-amber-100 rounded-full text-sm"
                >
                  {option}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="font-playfair text-xl mb-6 pb-3 border-b border-restaurant-emerald-800">
              Contact Us
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-restaurant-amber-400 mt-1" size={20} />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-restaurant-amber-100 text-sm">
                    Joysagar–Nazira Road, Tiniali,<br />
                    Joysagar, Sivasagar, Assam<br />
                    PIN: 785665
                  </p>
                  <a
                    href="https://www.google.com/maps/place/Heritage+Jaysagar/@26.9552713,94.6225636,17z"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-restaurant-amber-300 hover:text-restaurant-amber-400 text-sm mt-2"
                  >
                    View on Google Maps
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="text-restaurant-amber-400 mt-1" size={20} />
                <div>
                  <p className="font-medium">Phone</p>
                  <a
                    href="tel:+919999999999"
                    className="text-restaurant-amber-100 hover:text-restaurant-amber-300 text-sm"
                  >
                    +91 99999 99999
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="text-restaurant-amber-400 mt-1" size={20} />
                <div>
                  <p className="font-medium">Email</p>
                  <a
                    href="mailto:info@heritagejaysagar.com"
                    className="text-restaurant-amber-100 hover:text-restaurant-amber-300 text-sm"
                  >
                    info@heritagejaysagar.com
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-restaurant-amber-400 mt-1" size={20} />
                <div>
                  <p className="font-medium">Hours</p>
                  <div className="text-restaurant-amber-100 text-sm space-y-1">
                    <p>Monday - Sunday: 8:00 AM - 11:00 PM</p>
                    <p className="text-restaurant-amber-300">Kitchen closes at 10:30 PM</p>
                    <p className="text-restaurant-amber-300">Open 365 days a year</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div>
            <h3 className="font-playfair text-xl mb-6 pb-3 border-b border-restaurant-emerald-800">
              Stay Connected
            </h3>
            
            <div className="mb-8">
              <p className="text-restaurant-amber-100 mb-4">
                Subscribe to our newsletter for updates, special offers, and events.
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-4 py-3 bg-restaurant-emerald-800 border border-restaurant-emerald-700 rounded-lg text-white placeholder-restaurant-amber-200 focus:outline-none focus:ring-2 focus:ring-restaurant-amber-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-restaurant-amber-500 text-restaurant-emerald-900 px-4 py-1.5 rounded-md hover:bg-restaurant-amber-400 transition-colors"
                  >
                    Subscribe
                  </button>
                </div>
                {subscribed && (
                  <p className="text-green-400 text-sm animate-fadeIn">
                    Thank you for subscribing!
                  </p>
                )}
              </form>
            </div>

            <div className="mb-8">
              <p className="text-restaurant-amber-100 mb-4">Follow Us</p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 bg-restaurant-emerald-800 rounded-full flex items-center justify-center transition-all hover:scale-110 ${social.color}`}
                    aria-label={`Follow us on ${social.platform}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="bg-restaurant-emerald-800/50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <Heart className="text-restaurant-amber-400" size={20} />
                <h4 className="font-medium">Customer Support</h4>
              </div>
              <p className="text-sm text-restaurant-amber-100">
                Have questions or feedback? We're here to help. Contact us via phone, email, or social media.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-restaurant-emerald-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-restaurant-amber-200 text-sm">
                © {new Date().getFullYear()} Heritage Jaysagar. All rights reserved.
              </p>
              <p className="text-restaurant-amber-300 text-xs mt-1">
                This is a demo preview website for portfolio purposes.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-restaurant-amber-200">
              <Link href="/privacy" className="hover:text-restaurant-amber-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-restaurant-amber-300 transition-colors">
                Terms of Service
              </Link>
              <Link href="/accessibility" className="hover:text-restaurant-amber-300 transition-colors">
                Accessibility Statement
              </Link>
              <span className="flex items-center">
                <Heart size={12} className="mr-1 text-restaurant-amber-400" />
                Made with passion
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-xs text-restaurant-amber-300">Accepted Payments:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">VISA</span>
                </div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-400">MC</span>
                </div>
                <div className="w-8 h-5 bg-white rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-green-600">GPay</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-restaurant-amber-500 text-restaurant-emerald-900 rounded-full flex items-center justify-center shadow-lg hover:bg-restaurant-amber-400 transition-colors z-40"
        aria-label="Back to top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  )
}