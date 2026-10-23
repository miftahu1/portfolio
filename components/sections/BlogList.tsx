"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/types";
import { fetchPosts } from "@/lib/firestore";
import BlogCard from "@/components/blog/BlogCard";
import Skeleton from "@/components/ui/Skeleton";
import SectionHeading from "@/components/ui/SectionHeading";

type Props = { limit?: number; hideHeading?: boolean };

export default function BlogList({ limit, hideHeading = false }: Props) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchPosts().then((data) => {
      if (mounted) setPosts(limit ? data.slice(0, limit) : data);
    });
    return () => {
      mounted = false;
    };
  }, [limit]);

  return (
    <section className={hideHeading ? "pb-12 md:pb-24" : "mt-24"}>
      {!hideHeading && (
        <SectionHeading
          title="Notes & Writing"
          description="Thoughts on building, systems, and the craft of engineering."
        />
      )}

      {!posts ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit ?? 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-[28px]" />
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
          {posts.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.9 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              <BlogCard post={p} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

