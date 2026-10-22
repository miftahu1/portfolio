'use client';

import { motion, useTransform, type MotionValue } from "framer-motion";

const FACES = [
  { label: "Next.js", bg: "#D4FF3A", fg: "#0B0B14", t: "rotateY(0deg)" },
  { label: "React", bg: "#FF3D8B", fg: "#0B0B14", t: "rotateY(90deg)" },
  { label: "TypeScript", bg: "#FFC83D", fg: "#0B0B14", t: "rotateY(180deg)" },
  { label: "Tailwind", bg: "#F4F1FF", fg: "#0B0B14", t: "rotateY(-90deg)" },
  { label: "Firebase", bg: "#8B5CFF", fg: "#F4F1FF", t: "rotateX(90deg)" },
  { label: "Node.js", bg: "#3626FF", fg: "#D4FF3A", t: "rotateX(-90deg)" },
];

type Props = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

/** A CSS-3D cube that spins on its own and leans toward the pointer. */
export default function Cube3D({ pointerX, pointerY }: Props) {
  const rotY = useTransform(pointerX, [-0.5, 0.5], [-35, 35]);
  const rotX = useTransform(pointerY, [-0.5, 0.5], [30, -30]);

  return (
    <div
      style={{ "--s": "clamp(7.5rem, 13vw, 11rem)", perspective: 900 } as React.CSSProperties}
      className="relative h-[var(--s)] w-[var(--s)]"
      aria-hidden="true"
    >
      <motion.div
        style={{ rotateX: rotX, rotateY: rotY, transformStyle: "preserve-3d" }}
        className="absolute inset-0"
      >
        <div className="cube-spin absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {FACES.map((face) => (
            <div
              key={face.label}
              className="absolute inset-0 flex items-center justify-center rounded-[22px] border-2 border-ink font-display text-xl font-extrabold md:text-2xl"
              style={{
                background: face.bg,
                color: face.fg,
                transform: `${face.t} translateZ(calc(var(--s) / 2))`,
              }}
            >
              {face.label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
