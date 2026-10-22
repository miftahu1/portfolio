"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState, type ButtonHTMLAttributes, type ReactNode } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'> & {
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export default function MagneticButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 400, damping: 25 });
  const springY = useSpring(y, { stiffness: 400, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX / 4);
    y.set(relY / 4);
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    x.set(0);
    y.set(0);
  };

  const baseClasses = "relative inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background overflow-hidden group";
  
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  const variantClasses = {
    primary: "border-2 border-ink bg-lime text-ink shadow-[4px_4px_0_0_#0B0B14] hover:bg-pink hover:shadow-[6px_6px_0_0_#0B0B14]",
    ghost: "border-2 border-bone text-bone hover:bg-bone hover:text-ink"
  };

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: isMobile ? 1 : 0.95 }}
      whileHover={isMobile ? {} : {
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 20 }
      }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}