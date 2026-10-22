"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import type { Project } from "@/lib/types";
import { fetchProjects } from "@/lib/firestore";
import ProjectCard from "@/components/projects/ProjectCard";
import Skeleton from "@/components/ui/Skeleton";
import SectionHeading from "@/components/ui/SectionHeading";
import Link from "next/link";
import MagneticButton from "../ui/MagneticButton";

type Props = {
  limit?: number;
};

type StackItemProps = {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduce: boolean;
};

/** One panel in the stack. Earlier panels tip back and dim as the next one slides over them. */
function StackItem({ project, index, total, progress, reduce }: StackItemProps) {
  const segment = total > 1 ? 1 / (total - 1) : 1;
  const start = index * segment;
  const end = (index + 1) * segment;
  const isLast = index === total - 1;

  const scale = useTransform(progress, [start, end], [1, isLast ? 1 : 0.9]);
  const rotateX = useTransform(progress, [start, end], [0, isLast ? 0 : -5]);
  const shade = useTransform(progress, [start, end], [0, isLast ? 0 : 0.65]);

  return (
    <div
      className="sticky"
      style={{
        top: `calc(5.5rem + ${index * 14}px)`,
        marginBottom: isLast ? 0 : "28vh",
      }}
    >
      <motion.div
        className="relative will-change-transform"
        style={
          reduce
            ? undefined
            : { scale, rotateX, transformPerspective: 1400, transformOrigin: "50% 0%" }
        }
      >
        <ProjectCard project={project} variant="stack" colorIndex={index} />
        {!reduce && (
          <motion.div
            aria-hidden="true"
            style={{ opacity: shade }}
            className="pointer-events-none absolute inset-0 rounded-[28px] bg-ink"
          />
        )}
      </motion.div>
    </div>
  );
}

function ProjectStack({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative">
      {projects.map((p, i) => (
        <StackItem
          key={p.id}
          project={p}
          index={i}
          total={projects.length}
          progress={scrollYProgress}
          reduce={!!reduce}
        />
      ))}
    </div>
  );
}

export default function ProjectsGrid({ limit }: Props) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);

    let mounted = true;
    const fetchOnlyFeatured = !!limit;

    fetchProjects(fetchOnlyFeatured).then((data) => {
      if (mounted) {
        const validProjects = data.filter(p => p.id);
        const finalProjects = limit ? validProjects.slice(0, limit) : validProjects;
        setProjects(finalProjects);
      }
    });

    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [limit]);

  return (
    <section className="py-12 md:py-24">
      <SectionHeading
        title={limit ? "Selected Work" : "All Projects"}
        description={
          limit
            ? "A curated selection of my best work. Each project is a testament to my passion for creating beautiful and functional web experiences."
            : "A complete collection of my projects. Feel free to explore and see the variety of work I've done."
        }
      />

      {!projects ? (
        <div className={limit ? "space-y-6" : "grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"}>
          {Array.from({ length: limit ?? 6 }).map((_, i) => (
            <Skeleton key={i} className={limit ? "h-[26rem] rounded-[28px]" : "aspect-[4/3] rounded-[28px]"} />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <p className="py-16 text-center text-muted">No projects to show yet. Check back soon.</p>
      ) : limit ? (
        <ProjectStack projects={projects} />
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
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
          className="mt-12 md:mt-16 text-center"
        >
          <Link href="/projects">
            <MagneticButton size={isMobile ? "md" : "lg"} className="px-8 py-4 text-base">
              Explore All Projects
            </MagneticButton>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
