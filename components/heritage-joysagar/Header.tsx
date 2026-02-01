'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, Phone } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Highlights', href: '#highlights' },
    { name: 'Menu', href: '#menu' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#reservations' },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId)
    if (element) {
      const headerHeight = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/heritage-joysagar" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-800 rounded-full flex items-center justify-center">
              <span className="font-playfair text-xl font-bold text-amber-100">HJ</span>
            </div>
            <div>
              <h1 className="font-playfair text-2xl font-bold text-emerald-900">Heritage Jaysagar</h1>
              <p className="text-xs text-emerald-700 flex items-center">
                <MapPin size={10} className="mr-1" />
                Joysagar, Sivasagar, Assam
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="font-medium text-emerald-800 hover:text-emerald-600 transition-colors relative group py-2"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 group-hover:w-full transition-all duration-300"></span>
              </button>
            ))}
            <a
              href="https://wa.me/919864020240"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-800 text-amber-50 px-5 py-2.5 rounded-full flex items-center space-x-2 hover:bg-emerald-700 transition-colors"
            >
              <Phone size={16} />
              <span>WhatsApp Order</span>
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-emerald-800"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-emerald-800 hover:text-emerald-600 py-2 border-b border-amber-100 text-left"
                >
                  {item.name}
                </button>
              ))}
              <a
                href="https://wa.me/919864020240"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-800 text-amber-50 px-6 py-3 rounded-full flex items-center justify-center space-x-2"
              >
                <Phone size={16} />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}