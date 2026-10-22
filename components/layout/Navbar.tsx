'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

const links = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/photos', label: 'Photos' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (value) => {
    setIsScrolled(value > 24);
  });

  useEffect(() => {
    // Empty string (not 'auto') so body never becomes a scroll container,
    // which would break the sticky scroll sections.
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed left-0 top-0 z-40 w-full transition-colors duration-300 ${
          isScrolled && !isOpen ? 'border-b-2 border-bone/10 bg-ink/80 backdrop-blur-md' : 'border-b-2 border-transparent bg-transparent'
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="relative z-50" onClick={() => setIsOpen(false)}>
            <motion.span
              whileHover={{ rotate: -4, scale: 1.06 }}
              transition={{ type: 'spring', stiffness: 400, damping: 14 }}
              className={`inline-block font-display text-2xl font-extrabold tracking-tight ${isOpen ? 'text-ink' : 'text-bone'}`}
            >
              Mifta<span className={isOpen ? 'text-ink' : 'text-lime'}>.dev</span>
            </motion.span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-1 rounded-full border-2 border-bone/25 bg-ink/40 p-1 backdrop-blur-md md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-bold transition-colors duration-300 ${
                  pathname === link.href ? 'text-ink' : 'text-bone/85 hover:text-lime'
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                {pathname === link.href && (
                  <motion.div
                    layoutId="underline"
                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                    className="absolute inset-0 rounded-full bg-lime"
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className={`h-0.5 w-6 transition-all duration-300 ${isOpen ? 'translate-y-1 rotate-45 bg-ink' : 'bg-bone'}`} />
            <span className={`mt-1.5 h-0.5 w-6 transition-all duration-300 ${isOpen ? 'opacity-0' : 'bg-bone'}`} />
            <span className={`mt-1.5 h-0.5 w-6 transition-all duration-300 ${isOpen ? '-translate-y-1 -rotate-45 bg-ink' : 'bg-bone'}`} />
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-30 bg-lime md:hidden"
          >
            <div className="flex h-full flex-col justify-center gap-1 px-8 pt-16">
              {links.map((link, i) => (
                <div key={link.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: '110%', rotate: 5 }}
                    animate={{ y: 0, rotate: 0 }}
                    exit={{ y: '110%' }}
                    transition={{ type: 'spring', stiffness: 130, damping: 15, delay: 0.25 + i * 0.06 }}
                  >
                    <Link
                      href={link.href}
                      className={`block py-1 font-display text-[clamp(3.5rem,16vw,6rem)] font-extrabold leading-none tracking-tight transition-colors ${
                        pathname === link.href ? 'text-ink' : 'text-ink/45 hover:text-ink'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
