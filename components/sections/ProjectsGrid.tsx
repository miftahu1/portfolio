"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Project } from "@/lib/types";
import { fetchProjects } from "@/lib/firestore";
import ProjectCard from "@/components/projects/ProjectCard";
import Skeleton from "@/components/ui/Skeleton";

type Props = {
  limit?: number;
};

export default function ProjectsGrid({ limit }: Props) {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchProjects(false).then((data) => {
      if (mounted) setProjects(limit ? data.slice(0, limit) : data);
    });
    return () => {
      mounted = false;
    };
  }, [limit]);

  return (
    <section className="mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 flex items-end justify-between"
      >
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Selected <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">Work</span>
          </h2>
          <p className="text-base text-white/70">
            Real-world projects with real-world constraints and beautiful solutions.
          </p>
        </div>
      </motion.div>

      {!projects ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit ?? 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

