"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";

type Props = Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'>;

export default function Skeleton(props: Props) {
  const { className = "", ...rest } = props;
  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.3 }}
      className={`bg-white/5 ${className}`}
      {...rest}
    />
  );
}

