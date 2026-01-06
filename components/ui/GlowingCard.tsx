"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  glowColor?: "pink" | "purple" | "blue" | "cyan" | "yellow";
};

export default function GlowingCard({ 
  children, 
  className = "", 
  delay = 0,
  glowColor = "purple"
}: Props) {
  const gradientMap = {
    pink: "from-accent-pink to-accent-purple",
    purple: "from-accent-purple to-accent-blue",
    blue: "from-accent-blue to-accent-cyan",
    cyan: "from-accent-cyan to-accent-yellow",
    yellow: "from-accent-yellow to-accent-pink",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className={`relative group ${className}`}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradientMap[glowColor]} rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-300`} />
      
      {/* Main card */}
      <div className="relative rounded-2xl glass border border-white/10 group-hover:border-white/30 p-6 transition-all duration-300">
        {children}
        
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-transparent"
          animate={{
            borderColor: [
              "rgba(255, 255, 255, 0)",
              `rgba(var(--accent-${glowColor}), 0.5)`,
              "rgba(255, 255, 255, 0)",
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  );
}