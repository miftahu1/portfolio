'use client';

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Tilt from "@/components/ui/Tilt";

const TECH = [
  { label: "Next.js", bg: "#D4FF3A", fg: "#0B0B14" },
  { label: "React", bg: "#FF3D8B", fg: "#0B0B14" },
  { label: "TypeScript", bg: "#FFC83D", fg: "#0B0B14" },
  { label: "Tailwind", bg: "#F4F1FF", fg: "#0B0B14" },
  { label: "Firebase", bg: "#8B5CFF", fg: "#F4F1FF" },
  { label: "Node.js", bg: "#0B0B14", fg: "#D4FF3A" },
  { label: "Framer Motion", bg: "#2CF0C8", fg: "#0B0B14" },
];

const TILE = "rounded-[28px] border-2 border-ink shadow-[6px_6px_0_0_rgba(244,241,255,0.2)]";

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotate: 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: "spring", stiffness: 90, damping: 15, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Modern tech stack: a 3D ring of the real stack ---------- */
function OrbitTile() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 80, damping: 16 });
  const sy = useSpring(py, { stiffness: 80, damping: 16 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-28, 28]);
  const rotX = useTransform(sy, [-0.5, 0.5], [20, -20]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative flex h-full min-h-[30rem] flex-col justify-between overflow-hidden bg-electric p-6 text-bone md:p-10 ${TILE}`}
    >
      <div>
        <h3 className="font-display text-4xl font-extrabold leading-[1] tracking-tight md:text-6xl">Modern tech stack.</h3>
        <p className="mt-4 max-w-[40ch] text-base text-bone/85 md:text-lg">
          TypeScript, React, Next.js, and cutting-edge tools for sleek web apps.
        </p>
      </div>

      <div className="relative mt-6 h-72 w-full md:h-[22rem]" style={{ perspective: 1100 }} aria-hidden="true">
        <motion.div
          style={reduce ? undefined : { rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
          className="absolute inset-0"
        >
          <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-bone/30 bg-ink font-display text-5xl font-extrabold text-lime">
            M
          </div>
          <div
            className="orbit-ring absolute left-1/2 top-1/2"
            style={{ transformStyle: "preserve-3d", "--r": "clamp(7.5rem, 17vw, 13rem)" } as React.CSSProperties}
          >
            {TECH.map((t, i) => (
              <div
                key={t.label}
                className="absolute left-0 top-0 whitespace-nowrap rounded-full border-2 border-ink px-5 py-2 font-display text-base font-extrabold shadow-[3px_3px_0_0_#0B0B14] md:text-xl"
                style={{
                  background: t.bg,
                  color: t.fg,
                  backfaceVisibility: "hidden",
                  transform: `translate(-50%, -50%) rotateY(${(360 / TECH.length) * i}deg) translateZ(var(--r))`,
                }}
              >
                {t.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- User-centric design: UI you can actually play with ---------- */
function ToysPanel() {
  const [on, setOn] = useState(false);
  const [liked, setLiked] = useState(false);
  const [burst, setBurst] = useState(0);
  const [size, setSize] = useState(60);

  const toggleLike = () => {
    setLiked((v) => !v);
    setBurst((b) => b + 1);
  };

  return (
    <div className="mt-6 space-y-5 rounded-[20px] border-2 border-ink bg-bone p-4 text-ink md:p-5">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-bold">Make it spin</span>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label="Make the star spin"
          onClick={() => setOn((v) => !v)}
          className={`relative h-9 w-16 shrink-0 rounded-full border-2 border-ink transition-colors duration-300 ${on ? "bg-lime" : "bg-bone"}`}
        >
          <motion.span
            layout
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`absolute top-[3px] h-6 w-6 rounded-full border-2 border-ink bg-ink ${on ? "right-[3px]" : "left-[3px]"}`}
          />
        </button>
        <span className={`inline-block text-3xl text-pink ${on ? "spin-badge" : ""}`} aria-hidden="true">✦</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={toggleLike}
          aria-pressed={liked}
          aria-label="Like"
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-bone"
        >
          <motion.span
            animate={{ scale: liked ? [1, 1.6, 1] : 1 }}
            transition={{ duration: 0.4 }}
            className={`text-2xl ${liked ? "text-pink" : "text-ink"}`}
          >
            ♥
          </motion.span>
          {liked &&
            Array.from({ length: 10 }).map((_, i) => {
              const angle = (i / 10) * Math.PI * 2;
              return (
                <motion.span
                  key={`${burst}-${i}`}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                  style={{ background: i % 2 ? "#FF3D8B" : "#D4FF3A" }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(angle) * 46, y: Math.sin(angle) * 46, opacity: 0, scale: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              );
            })}
        </button>

        <div className="flex flex-1 items-center gap-4">
          <input
            type="range"
            min={20}
            max={100}
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            aria-label="Blob size"
            className="w-full accent-[#0B0B14]"
          />
          <div className="flex h-14 w-14 shrink-0 items-center justify-center">
            <motion.div
              animate={{ scale: size / 60 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="h-10 w-10 border-2 border-ink bg-pink"
              style={{ borderRadius: `${20 + (100 - size) * 0.45}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Performance focus: a stopwatch that snaps ---------- */
function Stopwatch() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto mt-8 h-40 w-40 shrink-0 rounded-full border-2 border-ink bg-bone" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="absolute inset-0" style={{ transform: `rotate(${i * 30}deg)` }}>
          <span className="mx-auto mt-1.5 block h-3 w-0.5 bg-ink" />
        </span>
      ))}
      <motion.div
        className="absolute bottom-1/2 h-[40%] w-1 rounded-full bg-pink"
        style={{ left: "calc(50% - 2px)", originY: 1 }}
        animate={reduce ? undefined : { rotate: [0, 720] }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1], repeat: Infinity, repeatDelay: 1.2 }}
      />
      <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" />
    </div>
  );
}

/* ---------- Details: eyes that follow the pointer ---------- */
function Eye({ mx, my }: { mx: MotionValue<number>; my: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  const look = (axis: 0 | 1) => (latest: number[]) => {
    const el = ref.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const dx = latest[0] - (r.left + r.width / 2);
    const dy = latest[1] - (r.top + r.height / 2);
    const d = Math.hypot(dx, dy) || 1;
    const k = Math.min(d, 220) / 220;
    return ((axis === 0 ? dx : dy) / d) * k * 20;
  };
  const tx = useSpring(useTransform([mx, my], look(0)), { stiffness: 300, damping: 22 });
  const ty = useSpring(useTransform([mx, my], look(1)), { stiffness: 300, damping: 22 });

  return (
    <div
      ref={ref}
      className="eye-blink relative flex h-24 w-24 items-center justify-center rounded-full border-2 border-ink bg-bone md:h-32 md:w-32"
    >
      <motion.div style={{ x: tx, y: ty }} className="h-9 w-9 rounded-full bg-ink md:h-12 md:w-12" />
    </div>
  );
}

function EyesTile() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useEffect(() => {
    mx.set(window.innerWidth / 2);
    my.set(window.innerHeight / 2);
    const move = (e: PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [mx, my]);

  return (
    <div className={`flex flex-col items-center justify-between gap-8 bg-sun p-6 text-ink md:flex-row md:p-10 ${TILE}`}>
      <div className="flex gap-4">
        <Eye mx={mx} my={my} />
        <Eye mx={mx} my={my} />
      </div>
      <p className="max-w-[18ch] text-center font-display text-4xl font-extrabold leading-[1] tracking-tight md:text-right md:text-6xl">
        Keeping an eye on the details.
      </p>
    </div>
  );
}

export default function StackBento() {
  return (
    <section className="relative py-16 pb-24 md:py-24 md:pb-32">
      <div className="grid gap-5 md:grid-cols-12">
        <Reveal className="md:col-span-7 md:row-span-2">
          <OrbitTile />
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.08}>
          <Tilt max={4} className="h-full rounded-[28px]">
            <div className={`h-full bg-pink p-6 text-ink md:p-8 ${TILE}`}>
              <h3 className="font-display text-4xl font-extrabold leading-[1] tracking-tight md:text-5xl">User-centric design.</h3>
              <p className="mt-4 max-w-[40ch] text-base text-ink/85 md:text-lg">
                Crafting intuitive interfaces that prioritize seamless user experience.
              </p>
              <ToysPanel />
            </div>
          </Tilt>
        </Reveal>

        <Reveal className="md:col-span-5" delay={0.16}>
          <Tilt max={4} className="h-full rounded-[28px]">
            <div className={`h-full bg-lime p-6 text-ink md:p-8 ${TILE}`}>
              <h3 className="font-display text-4xl font-extrabold leading-[1] tracking-tight md:text-5xl">Performance focus.</h3>
              <p className="mt-4 max-w-[40ch] text-base text-ink/85 md:text-lg">
                Building high-quality, optimized websites for success and speed.
              </p>
              <Stopwatch />
            </div>
          </Tilt>
        </Reveal>

        <Reveal className="md:col-span-12" delay={0.1}>
          <EyesTile />
        </Reveal>
      </div>
    </section>
  );
}
