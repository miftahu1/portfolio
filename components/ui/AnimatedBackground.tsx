"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
      }} />
      
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gradient-to-r from-accent-pink to-accent-purple"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i * 0.5) * 50, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
      
      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
        animate={{
          background: [
            "radial-gradient(circle, rgba(255, 0, 110, 0.15) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(131, 56, 236, 0.15) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(58, 134, 255, 0.15) 0%, transparent 70%)",
          ],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
        animate={{
          background: [
            "radial-gradient(circle, rgba(6, 255, 165, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(255, 190, 11, 0.1) 0%, transparent 70%)",
            "radial-gradient(circle, rgba(255, 0, 110, 0.1) 0%, transparent 70%)",
          ],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
}