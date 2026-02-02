'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reduced particle count for mobile
  const particleCount = isMobile ? 8 : 15;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Simplified grid for mobile */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                           linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)`,
          backgroundSize: isMobile ? '60px 60px' : '50px 50px',
        }}
      />

      {/* Floating particles - reduced on mobile */}
      {isClient && 
        Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-accent-pink/70 to-accent-purple/70"
            animate={{
              y: [0, -80, 0],
              x: [0, Math.sin(i * 0.5) * (isMobile ? 20 : 40), 0],
              opacity: [0.1, 0.4, 0.1],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: isMobile ? 4 : 3 + Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

      {/* Static gradient orbs - optimized for mobile */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-2xl md:blur-3xl opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(131, 56, 236, 0.15) 0%, transparent 70%)',
            }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-2xl md:blur-3xl opacity-20"
            style={{
              background: 'radial-gradient(circle, rgba(6, 255, 165, 0.1) 0%, transparent 70%)',
            }}
          />
        </>
      )}
    </div>
  );
}