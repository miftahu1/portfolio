'use client';

import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import Link from "next/link";
import InfoCard from "@/components/ui/InfoCard";
import { Code, Users, Award } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const subtitle = "Full-Stack Developer";

  return (
    <section className="relative pt-20 md:pt-24 overflow-hidden min-h-[90vh] flex items-center">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center lg:text-left lg:flex-row lg:items-center lg:justify-between gap-8 md:gap-12 py-8 md:py-12">
          {/* Text Content - Order changed for mobile */}
          <div className="lg:w-3/5 space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* Animated Title */}
            <div className="space-y-3 md:space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              >
                <span className="text-white">Mifta.</span>
                <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">dev</span>
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-gradient bg-gradient-primary bg-clip-text text-transparent"
              >
                {subtitle}
              </motion.h2>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              I design and build clean, modern web experiences with a strong focus on performance, structure, and usability.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 pt-2"
            >
              <Link href="/projects" className="w-full sm:w-auto">
                <MagneticButton size={isMobile ? "md" : "lg"} className="w-full sm:w-auto">
                  View Featured Projects
                </MagneticButton>
              </Link>
              <Link href="/contact" className="w-full sm:w-auto">
                <MagneticButton 
                  variant="ghost" 
                  size={isMobile ? "md" : "lg"}
                  className="w-full sm:w-auto"
                >
                  Contact Me
                </MagneticButton>
              </Link>
            </motion.div>
          </div>

          {/* Profile Image/Logo Placeholder - Order changed for mobile */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: isMobile ? 0.2 : 0.8, duration: 0.8, ease: "easeOut" }}
            className="lg:w-2/5 order-1 lg:order-2 flex justify-center mt-8 md:mt-0"
          >
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72">
              <div className="absolute inset-0 rounded-full bg-gradient-primary animate-pulse-slow opacity-20 blur-xl"></div>
              <div className="absolute inset-4 rounded-full border-2 border-white/20"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-primary opacity-10"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Image 
                  src="/logo.png"
                  alt="Mifta.dev Logo"
                  width={250}
                  height={250}
                  className="w-36 h-36 md:w-56 md:h-56 object-contain"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid gap-4 md:gap-6 md:grid-cols-3 mt-10 md:mt-16 pt-8 md:pt-12 border-t border-white/10">
          <InfoCard 
            icon={<Code size={20} className="md:w-6 md:h-6" />} 
            title="Modern Tech Stack" 
            description="TypeScript, React, Next.js, and cutting-edge tools for sleek web apps."
            delay={isMobile ? 0.3 : 0.8}
          />
          <InfoCard 
            icon={<Users size={20} className="md:w-6 md:h-6" />} 
            title="User-Centric Design"
            description="Crafting intuitive interfaces that prioritize seamless user experience."
            delay={isMobile ? 0.4 : 0.9}
          />
          <InfoCard 
            icon={<Award size={20} className="md:w-6 md:h-6" />} 
            title="Performance Focus"
            description="Building high-quality, optimized websites for success and speed."
            delay={isMobile ? 0.5 : 1.0}
          />
        </div>
      </div>
    </section>
  );
}