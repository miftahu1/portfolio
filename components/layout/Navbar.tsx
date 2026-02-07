'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled || isOpen ? 'glass-nav border-b border-white/20' : 'bg-transparent'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
              <span className="font-display text-2xl font-bold text-white text-gradient bg-gradient-primary bg-clip-text text-transparent">
                Mifta.dev
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1 glass-menu rounded-full p-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    pathname === link.href
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      layoutId="underline"
                      className="absolute inset-0 rounded-full bg-white/10 -z-10"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center"
              aria-label="Toggle menu"
            >
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 mt-1.5 ${isOpen ? 'opacity-0' : ''}`} />
              <span className={`w-6 h-0.5 bg-white transition-all duration-300 mt-1.5 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-30 bg-background-primary/95 backdrop-blur-lg md:hidden"
          >
            <motion.div
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-0 left-0 w-full bg-background-primary shadow-xl"
            >
              <div className="flex flex-col items-center gap-6 p-8 pt-24">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.05, ease: 'easeOut' }}
                  >
                    <Link
                      href={link.href}
                      className={`text-2xl font-semibold transition-colors duration-300 ${
                        pathname === link.href
                          ? 'text-white'
                          : 'text-white/60 hover:text-white'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
