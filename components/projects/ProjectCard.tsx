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
      transition={{ type: "tween", duration: 0.3 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-accent-purple/10"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <Image
          src={project.heroImageUrl || "/placeholder.png"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Link 
          href={projectUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="absolute inset-0"
        >
          <span className="sr-only">View project: {project.title}</span>
        </Link>
      </div>
      
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold text-white mb-2">
          <Link 
            href={projectUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="transition-colors duration-300 hover:text-accent-purple focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple rounded-sm"
          >
            {project.title}
          </Link>
        </h3>
        <p className="text-white/70 flex-1 mb-4 leading-relaxed">
          {project.excerpt}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-4">
          {project.liveUrl && (
            <Link 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-purple transition-all duration-300 hover:gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple rounded-sm"
            >
              View Project →
            </Link>
          )}
          {project.repoUrl && (
            <Link 
              href={project.repoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-purple rounded-sm"
            >
              Source Code
            </Link>
          )}
        </div>
      </div>

      {project.featured && (
        <div className="absolute top-4 right-4 z-10">
          <span className="inline-flex items-center rounded-full bg-accent-purple/10 px-3 py-1 text-xs font-medium text-accent-purple ring-1 ring-inset ring-accent-purple/20">
            Featured
          </span>
        </div>
      )}
    </motion.article>
  );
}
