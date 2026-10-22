"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import Tilt from "@/components/ui/Tilt";

type Props = {
  project: Project;
  /** "tile" is the grid card; "stack" is the large panel used in the scroll stack. */
  variant?: "tile" | "stack";
  colorIndex?: number;
};

const PALETTE = [
  { bg: "#D4FF3A", fg: "#0B0B14" },
  { bg: "#FF3D8B", fg: "#0B0B14" },
  { bg: "#FFC83D", fg: "#0B0B14" },
  { bg: "#3626FF", fg: "#F4F1FF" },
];

export default function ProjectCard({ project, variant = "tile", colorIndex }: Props) {
  const projectUrl = project.liveUrl || project.repoUrl || "#";
  const isStack = variant === "stack";
  const idx = colorIndex ?? project.id.charCodeAt(0);
  const { bg, fg } = PALETTE[idx % PALETTE.length];

  const body = (
    <>
      <div
        className={`relative w-full overflow-hidden rounded-[20px] border-2 ${
          isStack ? "aspect-[16/10] lg:aspect-auto lg:min-h-[26rem]" : "aspect-[16/10]"
        }`}
        style={{ borderColor: fg }}
      >
        <Image
          src={project.heroImageUrl || "/placeholder.png"}
          alt={project.name}
          fill
          sizes={isStack ? "(max-width: 1024px) 100vw, 60vw" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
        />
        <Link
          href={projectUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0"
        >
          <span className="sr-only">View project: {project.name}</span>
        </Link>
      </div>

      <div className={`flex flex-1 flex-col ${isStack ? "justify-between gap-8 p-2 md:p-4" : "gap-4 pt-5"}`}>
        <div>
          <h3
            className={`font-display font-extrabold tracking-tight ${
              isStack ? "mb-4 text-4xl md:text-6xl" : "mb-2 text-2xl"
            }`}
          >
            <Link
              href={projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
            >
              {project.name}
            </Link>
          </h3>
          <p className={`leading-relaxed opacity-85 ${isStack ? "max-w-[44ch] text-base md:text-lg" : ""}`}>
            {project.excerpt}
          </p>
        </div>

        <div>
          <div className="mb-5 flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border-2 border-current px-3 py-1 text-xs font-bold"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {project.liveUrl && (
              <Link
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-300 hover:gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
                style={{ background: fg, color: bg }}
              >
                View Project →
              </Link>
            )}
            {project.repoUrl && (
              <Link
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-sm text-sm font-bold underline underline-offset-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
              >
                Source Code
              </Link>
            )}
          </div>
        </div>
      </div>

      {project.featured && (
        <div className="float-a absolute right-5 top-5 z-10" style={{ "--r": "6deg" } as React.CSSProperties}>
          <span className="inline-flex items-center rounded-full border-2 border-ink bg-bone px-3 py-1 text-xs font-extrabold text-ink shadow-[3px_3px_0_0_#0B0B14]">
            Featured
          </span>
        </div>
      )}
    </>
  );

  if (isStack) {
    return (
      <article
        className="group relative grid gap-4 overflow-hidden rounded-[28px] p-4 md:p-6 lg:grid-cols-[1.25fr_1fr]"
        style={{ background: bg, color: fg }}
      >
        {body}
      </article>
    );
  }

  return (
    <Tilt className="h-full rounded-[28px]" max={6}>
      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="group relative flex h-full flex-col rounded-[28px] border-2 border-ink p-4 shadow-[6px_6px_0_0_rgba(244,241,255,0.18)] transition-shadow duration-300 hover:shadow-[10px_10px_0_0_rgba(244,241,255,0.3)]"
        style={{ background: bg, color: fg }}
      >
        {body}
      </motion.article>
    </Tilt>
  );
}
