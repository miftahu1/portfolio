"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Post } from "@/lib/types";
import { fetchPosts } from "@/lib/firestore";
import BlogCard from "@/components/blog/BlogCard";
import Skeleton from "@/components/ui/Skeleton";

type Props = { limit?: number };

export default function BlogList({ limit }: Props) {
  const [posts, setPosts] = useState<Post[] | null>(null);

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
    <section className="mt-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10 flex items-end justify-between"
      >
        <div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            Notes &amp; <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">Writing</span>
          </h2>
          <p className="text-base text-white/70">
            Thoughts on building, systems, and the craft of engineering.
          </p>
        </div>
      </motion.div>

      {!posts ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: limit ?? 3 }).map((_, i) => (
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

