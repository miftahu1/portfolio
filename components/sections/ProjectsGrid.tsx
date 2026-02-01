"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { fetchProjects } from "@/lib/firestore";
import ProjectCard from "@/components/projects/ProjectCard";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";
import MagneticButton from "../ui/MagneticButton";

type Props = {
  limit?: number;
};

export default function ProjectsGrid({ limit }: Props) {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchOnlyFeatured = !!limit;
    
    fetchProjects(fetchOnlyFeatured).then((data) => {
      if (mounted) {
        const validProjects = data.filter(p => p.id);
        // Correctly apply the limit ONLY if it exists.
        const finalProjects = limit ? validProjects.slice(0, limit) : validProjects;
        setProjects(finalProjects);
      }
    });
    
    return () => {
      mounted = false;
    };
  }, [limit]);

  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 flex items-center justify-between"
      >
        <div className="flex-1">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
              {limit ? "Selected Work" : "All Projects"}
            </span>
          </h2>
          <p className="text-base text-white/70 max-w-lg">
            {limit
              ? "A curated selection of my best work. Each project is a testament to my passion for creating beautiful and functional web experiences."
              : "A complete collection of my projects. Feel free to explore and see the variety of work I've done."}
          </p>
        </div>
      </motion.div>

      {!projects ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit ?? 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {limit && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Link href="/projects">
            <MagneticButton size="lg" className="px-10 py-5 text-lg">
              Explore All Projects
            </MagneticButton>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
