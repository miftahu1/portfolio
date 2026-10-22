'use client';

import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";

export default function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => setShow(v > 800));

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          whileHover={{ y: -5, rotate: -8 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 320, damping: 16 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-lime font-display text-2xl font-extrabold text-ink shadow-[4px_4px_0_0_#0B0B14]"
        >
          ↑
        </motion.button>
      )}
    </AnimatePresence>
  );
}
