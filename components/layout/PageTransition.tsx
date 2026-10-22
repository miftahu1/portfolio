'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

const variants = {
  hidden: { opacity: 0, y: 15 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

const BARS = ['#D4FF3A', '#FF3D8B', '#FFC83D', '#3626FF'];

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const isFirst = useRef(true);
  const skipWipe = isFirst.current;

  useEffect(() => {
    isFirst.current = false;
  }, []);

  return (
    <>
      {/* Colour wipe: covers the screen while the page swaps, then lifts away */}
      {!skipWipe && !reduce && (
        <div key={pathname} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[75] flex">
          {BARS.map((color, i) => (
            <motion.div
              key={color}
              className="h-full flex-1"
              style={{ background: color }}
              initial={{ scaleY: 0, originY: 1 }}
              animate={{ scaleY: [0, 1, 1, 0], originY: [1, 1, 0, 0] }}
              transition={{ duration: 1.1, times: [0, 0.4, 0.5, 1], ease: 'easeInOut', delay: i * 0.05 }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          variants={variants}
          initial="hidden"
          animate="enter"
          exit="exit"
          transition={{ type: 'tween', ease: 'easeInOut', duration: 0.4 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
