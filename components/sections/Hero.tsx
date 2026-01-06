"use client";

import AnimatedBackground from "@/components/ui/AnimatedBackground";
import GlowingCard from "@/components/ui/GlowingCard";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";
import AnimatedLogo from "@/components/ui/AnimatedLogo";
import Link from "next/link";

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
      ease: "easeOut", // CHANGED FROM: [0.16, 1, 0.3, 1]
    },
  },
};

export default function Hero() {
  const title = "Mifta.dev".split("");
  const subtitle = "Full-Stack Developer".split("");

  return (
    <section className="relative pt-20 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-accent-purple/30 to-accent-blue/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-accent-pink/30 to-accent-cyan/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-mesh rounded-full opacity-50"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Hero Content Row: Logo on left, Text on right */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 py-16">
          {/* LEFT: Logo - Smaller size */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:w-2/5 flex justify-center"
          >
            <AnimatedLogo size={160} />
          </motion.div>

          {/* RIGHT: Text Content */}
          <div className="lg:w-3/5 space-y-6">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={container}
              className="inline-flex flex-wrap gap-2 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight"
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
              className="flex flex-wrap gap-1 text-lg md:text-xl lg:text-2xl font-medium"
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

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
              className="text-lg text-white/80 leading-relaxed max-w-2xl"
            >
              I craft beautiful, performant web experiences with{" "}
              <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent font-semibold">
                modern technologies
              </span>{" "}
              and{" "}
              <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent font-semibold">
                smooth animations
              </span>
              . Let&apos;s build something extraordinary together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <Link href="/projects">
                <MagneticButton>View Work</MagneticButton>
              </Link>
              <Link href="/contact">
                <MagneticButton variant="ghost">Contact Me</MagneticButton>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Info Cards - On next line, full width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6, ease: "easeOut" }}
          className="grid gap-6 md:grid-cols-3 mt-16 pt-12 border-t border-white/10"
        >
          {[
            {
              title: "Focus",
              desc: "TypeScript, React, Next.js, Motion Design",
              gradient: "from-accent-purple to-accent-blue",
            },
            {
              title: "Approach",
              desc: "Beautiful, performant, user-centered design",
              gradient: "from-accent-blue to-accent-cyan",
            },
            {
              title: "Status",
              desc: "Available for exciting projects",
              gradient: "from-accent-cyan to-accent-yellow",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + index * 0.1, ease: "easeOut" }}
              whileHover={{ scale: 1.03, y: -4 }}
              className="glass rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <h3 className="text-base font-semibold text-white/90 mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                {item.desc}
              </p>
              <div
                className={`h-1 w-full mt-4 rounded-full bg-gradient-to-r ${item.gradient} opacity-60`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
