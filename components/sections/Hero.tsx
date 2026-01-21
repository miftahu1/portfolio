"use client";

import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import AnimatedLogo from "@/components/ui/AnimatedLogo";
import Link from "next/link";
import InfoCard from "@/components/ui/InfoCard";
import { Code, Users, Award } from "lucide-react";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const letter = {
  hidden: { y: "150%", opacity: 0, rotateX: -90 },
  visible: {
    y: "0%",
    opacity: 1,
    rotateX: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut" as const, // FIXED: Changed from array to string with 'as const'
    },
  },
};

export default function Hero() {
  const title = "Mifta.dev".split("");
  const subtitle = "Full-Stack Developer".split("");

  return (
    <section className="relative pt-20 overflow-hidden min-h-screen flex items-center">
      {/* Use AnimatedBackground as the main background */}
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        {/* Hero Content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 py-16">
          {/* Logo Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-2/5 flex justify-center order-1"
          >
            <AnimatedLogo size={180} />
          </motion.div>

          {/* Text Content */}
          <div className="lg:w-3/5 space-y-8 order-2">
            {/* Animated Title */}
            <div className="space-y-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="inline-flex flex-wrap gap-2 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight"
              >
                {title.map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letter}
                    className="font-display inline-block"
                    style={{ perspective: "1000px" }}
                  >
                    {char === " " ? (
                      "\u00A0"
                    ) : char === "." ? (
                      <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
                        {char}
                      </span>
                    ) : (
                      <span className="text-white drop-shadow-lg">{char}</span>
                    )}
                  </motion.span>
                ))}
              </motion.div>

              <motion.div
                initial="hidden"
                animate="visible"
                variants={container}
                className="flex flex-wrap gap-1 text-lg md:text-xl lg:text-2xl xl:text-3xl font-medium"
              >
                {subtitle.map((char, index) => (
                  <motion.span
                    key={index}
                    variants={letter}
                    className="text-gradient bg-gradient-primary bg-clip-text text-transparent"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl"
            >
              I craft <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent font-semibold">beautiful, performant web experiences</span> with modern technologies and smooth animations. Let&apos;s build something extraordinary together.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Link href="/projects">
                <MagneticButton size="lg" className="px-8 py-4">
                  View Work
                </MagneticButton>
              </Link>
              <Link href="/contact">
                <MagneticButton 
                  variant="ghost" 
                  size="lg"
                  className="px-8 py-4 border-white/20 hover:bg-white/5"
                >
                  Contact Me
                </MagneticButton>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid gap-6 md:grid-cols-3 mt-20 pt-12 border-t border-white/10">
          <InfoCard 
            icon={<Code size={24} />} 
            title="Core Technologies" 
            description="TypeScript, React, Next.js, and Framer Motion for sleek, modern web apps."
            delay={1.4}
          />
          <InfoCard 
            icon={<Users size={24} />} 
            title="User-Centric Design"
            description="Crafting intuitive and engaging interfaces that prioritize user experience."
            delay={1.5}
          />
          <InfoCard 
            icon={<Award size={24} />} 
            title="Quality & Performance"
            description="Building high-quality, performant websites that are optimized for success."
            delay={1.6}
          />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1, ease: "easeOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-white/50 rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
