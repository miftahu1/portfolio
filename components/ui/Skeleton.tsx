"use client";

import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";

export default function Skeleton(props: HTMLAttributes<HTMLDivElement>) {
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

