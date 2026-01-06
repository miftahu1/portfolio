"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type Props = {
  size?: number;
  className?: string;
};

export default function AnimatedLogo({ size = 180, className = "" }: Props) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Smooth rotating gradient ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          border: "3px solid transparent",
          background: "linear-gradient(white, white) padding-box, conic-gradient(from 0deg, #FF006E, #8338EC, #3A86FF, #06FFA5, #FFBE0B, #FF006E) border-box",
        }}
      />

      {/* Pulsing inner glow */}
      <motion.div
        className="absolute inset-4 rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: "radial-gradient(circle, rgba(131, 56, 236, 0.4) 0%, rgba(58, 134, 255, 0.2) 50%, transparent 70%)",
        }}
      />

      {/* Logo image - FIXED: Proper container with explicit dimensions */}
      <div
        className="absolute rounded-full overflow-hidden"
        style={{
          width: size - 24,
          height: size - 24,
          top: "12px",
          left: "12px",
          position: "relative", // Required for Next.js Image with fill
        }}
      >
        <Image
          src="/logo.png"
          alt="Mifta.dev Logo"
          fill
          sizes={`${size}px`}
          className="object-cover"
          priority
        />
      </div>

      {/* Floating dots */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple"
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: Math.cos((i * Math.PI * 2) / 8) * (size / 2 + 15),
            y: Math.sin((i * Math.PI * 2) / 8) * (size / 2 + 15),
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}