'use client';

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Terminal } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import VelocityMarquee from "@/components/ui/VelocityMarquee";
import Cube3D from "@/components/ui/Cube3D";
import CircularBadge from "@/components/ui/CircularBadge";

const LETTERS = [
  { char: "M", color: "#D4FF3A" },
  { char: "i", color: "#FF3D8B" },
  { char: "f", color: "#FFC83D" },
  { char: "t", color: "#F4F1FF" },
  { char: "a", color: "#D4FF3A" },
];

type LetterProps = {
  char: string;
  color: string;
  index: number;
  mx: MotionValue<number>;
  my: MotionValue<number>;
};

/** A letter that jumps and tilts away as the pointer gets close. */
function DodgeLetter({ char, color, index, mx, my }: LetterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const influence = useTransform([mx, my], (latest: number[]) => {
    const el = ref.current;
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const d = Math.hypot(latest[0] - (r.left + r.width / 2), latest[1] - (r.top + r.height / 2));
    return Math.max(0, 1 - d / 280);
  });
  const spring = useSpring(influence, { stiffness: 220, damping: 14 });
  const y = useTransform(spring, [0, 1], [0, -34]);
  const rotate = useTransform(spring, [0, 1], [0, index % 2 ? 9 : -9]);
  const scale = useTransform(spring, [0, 1], [1, 1.14]);

  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ y, rotate, scale, color, textShadow: "0.05em 0.05em 0 #0B0B14" }}
    >
      {char}
    </motion.span>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const [isMobile, setIsMobile] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [cycleCount, setCycleCount] = useState(0);

  // Terminal content sequences
  const sequences = [
    {
      lines: [
        "> whoami",
        "Miftahul Hussain",
        "> skills --list",
        "  • React/Next.js",
        "  • TypeScript",
        "  • Node.js",
        "  • TailwindCSS",
      ],
    },
    {
      lines: [
        "> npm create mifta-app",
        "Creating a new Mifta project...",
        "✅ Done!",
        "> cd portfolio",
        "> npm run dev",
        "Ready on http://localhost:3000",
      ],
    },
    {
      lines: [
        "> git log -1",
        "commit 3a1b2c3",
        "Author: Mifta <mifta@dev>",
        "Date:   today",
        "",
        "    Deploy: interactive terminal",
        "> system info",
        "OS:     Arch Linux",
        "Shell:  zsh 8.1.0",
        "Theme:  cyberpunk",
      ],
    },
  ];

  const currentSequence = sequences[cycleCount % sequences.length];
  const totalLines = currentSequence.lines.length;

  // Pointer physics (motion values only, no React re-renders)
  const mx = useMotionValue(-9999);
  const my = useMotionValue(-9999);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18 });
  const sy = useSpring(py, { stiffness: 90, damping: 18 });
  const termRotY = useTransform(sx, [-0.5, 0.5], [-14, 6]);
  const termRotX = useTransform(sy, [-0.5, 0.5], [8, -4]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType === "touch") return;
    mx.set(e.clientX);
    my.set(e.clientY);
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    mx.set(-9999);
    my.set(-9999);
    px.set(0);
    py.set(0);
  };

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Typing animation logic
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentLineIndex < totalLines) {
        const line = currentSequence.lines[currentLineIndex];
        if (currentCharIndex < line.length) {
          setTerminalLines((prev) => {
            const newLines = [...prev];
            if (newLines.length <= currentLineIndex) {
              newLines.push(line.substring(0, currentCharIndex + 1));
            } else {
              newLines[currentLineIndex] = line.substring(0, currentCharIndex + 1);
            }
            return newLines;
          });
          setCurrentCharIndex((prev) => prev + 1);
        } else {
          setCurrentLineIndex((prev) => prev + 1);
          setCurrentCharIndex(0);
        }
      } else {
        setTimeout(() => {
          setTerminalLines([]);
          setCurrentLineIndex(0);
          setCurrentCharIndex(0);
          setCycleCount((prev) => prev + 1);
        }, 3000);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [currentLineIndex, currentCharIndex, currentSequence.lines, totalLines, cycleCount]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  const subtitle = "Full-Stack Developer";
  const outline = { WebkitTextStroke: "2px rgba(244, 241, 255, 0.9)", color: "transparent" } as const;

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate -mt-24 overflow-hidden rounded-b-[40px] bg-electric md:-mt-28"
      style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}
    >
      {/* Colour blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="blob left-[-10%] top-[-20%] h-[70%] w-[55%]"
          style={{ background: "radial-gradient(circle, rgba(212,255,58,0.55), transparent 65%)" }}
        />
        <div
          className="blob bottom-[-25%] right-[-10%] h-[80%] w-[60%]"
          style={{ background: "radial-gradient(circle, rgba(255,61,139,0.6), transparent 65%)", animationDelay: "-5s" }}
        />
      </div>

      {/* Three giant outlined marquee rows that skew with scroll speed */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 -rotate-6 flex-col gap-3 opacity-[0.22]"
      >
        {[
          { text: "Full-Stack Developer ✦ Next.js ✦ React ✦ TypeScript ✦ ", dir: 1 as const },
          { text: "Performance ✦ Accessibility ✦ Clean UI ✦ Fast Sites ✦ ", dir: -1 as const },
          { text: "Full-Stack Developer ✦ Tailwind ✦ Firebase ✦ Node.js ✦ ", dir: 1 as const },
        ].map((row, i) => (
          <VelocityMarquee key={i} direction={row.dir} baseSpeed={3 + i}>
            <span
              className="pr-10 font-display text-[clamp(4rem,11vw,9rem)] font-extrabold uppercase leading-none tracking-tight"
              style={outline}
            >
              {row.text}
            </span>
          </VelocityMarquee>
        ))}
      </div>

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto grid min-h-[100dvh] max-w-7xl items-center gap-10 px-4 pb-20 pt-28 sm:px-6 lg:grid-cols-[1.25fr_1fr]"
      >
        {/* Left: wordmark + copy */}
        <div className="text-center lg:text-left">
          <h1
            aria-label="Mifta.dev"
            className="font-display text-[clamp(4.5rem,16vw,15rem)] font-extrabold leading-[0.82] tracking-[-0.05em]"
            style={{ fontVariationSettings: '"wdth" 80' }}
          >
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                aria-hidden="true"
                className="inline-block"
                initial={reduce ? false : { y: "70%", opacity: 0, rotate: 10 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.1 + i * 0.07 }}
              >
                <DodgeLetter char={l.char} color={l.color} index={i} mx={mx} my={my} />
              </motion.span>
            ))}
            <motion.span
              aria-hidden="true"
              className="inline-block text-[0.4em] text-bone"
              initial={reduce ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              .dev
            </motion.span>
          </h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 font-display text-3xl font-bold tracking-tight text-bone md:text-5xl"
          >
            {subtitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-4 max-w-[46ch] text-base leading-relaxed text-bone/85 md:text-lg lg:mx-0"
          >
            I design and build clean, modern web experiences with a strong focus on performance, structure, and usability.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <Link href="/projects" className="w-full sm:w-auto">
              <MagneticButton size={isMobile ? "md" : "lg"} className="w-full sm:w-auto">
                View Featured Projects
              </MagneticButton>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <MagneticButton variant="ghost" size={isMobile ? "md" : "lg"} className="w-full sm:w-auto">
                Contact Me
              </MagneticButton>
            </Link>
          </motion.div>
        </div>

        {/* Right: 3D cube, spinning badge, tilting terminal */}
        <motion.div
          style={reduce || isMobile ? undefined : { y: rightY }}
          className="relative mx-auto h-[26rem] w-full max-w-[32rem] sm:h-[28rem] lg:mx-0"
        >
          <div className="float-a absolute left-0 top-2 z-20" style={{ "--r": "-6deg" } as React.CSSProperties}>
            <CircularBadge />
          </div>

          <div className="float-b absolute right-2 top-0 z-10">
            <Cube3D pointerX={sx} pointerY={sy} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 60, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 90, damping: 14, delay: isMobile ? 0.2 : 0.9 }}
            style={
              reduce || isMobile
                ? undefined
                : { rotateY: termRotY, rotateX: termRotX, transformPerspective: 1200 }
            }
            className="absolute bottom-0 left-0 h-[15.5rem] w-[92%] overflow-hidden rounded-[28px] border-2 border-ink bg-ink font-mono shadow-[10px_10px_0_0_#0B0B14] sm:h-[17rem]"
          >
            <div className="flex items-center gap-2 border-b-2 border-ink bg-lime px-4 py-2.5">
              <motion.div whileHover={{ scale: 1.25 }} className="h-3 w-3 cursor-pointer rounded-full border-2 border-ink bg-pink" />
              <motion.div whileHover={{ scale: 1.25 }} className="h-3 w-3 cursor-pointer rounded-full border-2 border-ink bg-sun" />
              <motion.div whileHover={{ scale: 1.25 }} className="h-3 w-3 cursor-pointer rounded-full border-2 border-ink bg-bone" />
              <span className="ml-2 flex-1 text-xs font-medium text-ink">mifta@dev:~/portfolio</span>
              <Terminal size={14} className="text-ink" />
            </div>

            <div className="term-scroll h-[calc(100%-44px)] overflow-y-auto p-4 pb-9">
              <div className="space-y-1">
                {terminalLines.map((line, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-sm ${
                      line.startsWith(">")
                        ? "font-bold text-lime"
                        : line.startsWith("  •")
                          ? "text-pink"
                          : line.match(/^[a-f0-9]{7,}/)
                            ? "text-sun"
                            : "text-bone/85"
                    }`}
                  >
                    {line}
                  </motion.div>
                ))}
                {currentLineIndex < totalLines && (
                  <div className="flex items-center text-sm text-lime">
                    <span className="mr-1">{showCursor ? "█" : " "}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 flex justify-between border-t-2 border-bone/10 bg-ink px-4 py-1 text-xs text-bone/60">
              <span>mifta@dev:~/portfolio (zsh)</span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" />
                CONNECTED
              </span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
