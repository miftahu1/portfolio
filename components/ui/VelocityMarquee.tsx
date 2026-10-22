'use client';

import type { ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

type Props = {
  children: ReactNode;
  /** Percent of the loop per second. */
  baseSpeed?: number;
  direction?: 1 | -1;
  className?: string;
};

const wrapValue = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** A marquee that speeds up and skews with your scroll velocity. */
export default function VelocityMarquee({ children, baseSpeed = 4, direction = 1, className = "" }: Props) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const boost = useTransform(smooth, [-2000, 0, 2000], [-8, 0, 8]);
  const skewX = useTransform(smooth, [-2000, 0, 2000], [14, 0, -14]);
  const x = useTransform(baseX, (v) => `${wrapValue(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const speed = baseSpeed + Math.abs(boost.get());
    baseX.set(baseX.get() - direction * speed * (delta / 1000));
  });

  return (
    <motion.div
      style={reduce ? undefined : { skewX }}
      className={`overflow-hidden whitespace-nowrap ${className}`}
    >
      <motion.div style={{ x }} className="flex w-max">
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">{children}</div>
      </motion.div>
    </motion.div>
  );
}
