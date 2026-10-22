'use client';

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/** Trailing ring + dot. The native cursor stays visible. Fine pointers only. */
export default function CursorFollower() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.4 });

  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      setHovering(!!target?.closest("a, button, [role='button'], input, textarea, label"));
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, [reduce, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden="true"
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[70] mix-blend-difference"
      >
        <motion.div
          animate={{ scale: hovering ? 1.9 : 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          className="-ml-[18px] -mt-[18px] h-9 w-9 rounded-full border-2 border-lime"
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[70]"
      >
        <div className="-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-lime" />
      </motion.div>
    </>
  );
}
