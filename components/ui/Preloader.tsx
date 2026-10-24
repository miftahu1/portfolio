'use client';

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { markIntroDone } from "@/lib/intro";

const BARS = ["#D4FF3A", "#FF3D8B", "#FFC83D", "#3626FF", "#8B5CFF"];

/** Counter + colour curtain. Plays once per browser session. */
export default function Preloader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("mifta-intro") === "1";
    } catch {
      seen = false;
    }
    if (seen || reduce) {
      markIntroDone();
      setShow(false);
      return;
    }

    let raf = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const start = performance.now();
    const duration = 1500;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setCount(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        try {
          sessionStorage.setItem("mifta-intro", "1");
        } catch {
          /* storage unavailable: intro just replays next visit */
        }
        timeout = setTimeout(() => {
          markIntroDone();
          setShow(false);
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          className="preloader-failsafe fixed inset-0 z-[80] flex items-center justify-center"
          exit={{ transition: { duration: 1.2 } }}
          aria-hidden="true"
        >
          <div className="absolute inset-0 flex">
            {BARS.map((color, i) => (
              <motion.div
                key={color}
                className="h-full flex-1"
                style={{ background: color }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: [0.76, 0, 0.24, 1] }}
              />
            ))}
          </div>
          <motion.div
            className="relative z-10 text-center text-ink"
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.35 }}
          >
            <p className="font-display text-[clamp(5rem,22vw,16rem)] font-extrabold leading-[0.85] tracking-[-0.05em]">
              {count}
            </p>
            <p className="mt-3 font-display text-xl font-bold">Mifta.dev</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
