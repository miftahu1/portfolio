"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";

type Props = {
  project: Project;
};

const gradientColors = [
  "from-accent-pink/20 to-accent-purple/20",
  "from-accent-purple/20 to-accent-blue/20",
  "from-accent-blue/20 to-accent-cyan/20",
  "from-accent-cyan/20 to-accent-yellow/20",
];

export default function ProjectCard({ project }: Props) {
  const gradientIndex = project.id.charCodeAt(0) % gradientColors.length;
  const gradient = gradientColors[gradientIndex];
  const projectUrl = project.liveUrl || project.repoUrl || "#";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "tween", duration: 0.3 }} // FIXED: Changed from spring to tween
      className="group cursor-pointer overflow-hidden rounded-2xl glass border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-glow"
    >
      <Link href={projectUrl} target="_blank" rel="noopener noreferrer" className="block">
      {project.heroImageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={project.heroImageUrl}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // ADDED: sizes prop
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          />
          {project.featured && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "tween", duration: 0.3 }} // FIXED: Added transition type
              className="absolute top-3 right-3"
            >
              <span className="rounded-full bg-gradient-primary px-3 py-1 text-[10px] font-semibold text-white shadow-glow">
                ⭐ Featured
              </span>
            </motion.div>
          )}
        </div>
      )}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gradient bg-gradient-primary bg-clip-text text-transparent transition-all duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
            {project.excerpt}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tech.slice(0, 4).map((t, idx) => (
            <motion.span
              key={t}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, type: "tween", duration: 0.2 }} // FIXED: Added type
              whileHover={{ scale: 1.1 }}
              className="rounded-full glass border border-white/10 px-3 py-1 text-[11px] font-medium text-white/80 group-hover:border-white/30 group-hover:text-white transition-all duration-300"
            >
              {t}
            </motion.span>
          ))}
        </div>
        {project.liveUrl && (
          <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gradient bg-gradient-primary bg-clip-text text-transparent">
            View Project →
          </div>
        )}
      </div>
      </Link>
    </motion.article>
  );
}

