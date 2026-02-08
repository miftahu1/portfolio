'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/types";
import { fetchPosts } from "@/lib/firestore";
import PostCard from "@/components/blog/PostCard";
import Skeleton from "@/components/ui/Skeleton";
import Link from "next/link";
import MagneticButton from "../ui/MagneticButton";

type Props = {
  limit?: number;
};

export default function PostsGrid({ limit }: Props) {
  const [posts, setPosts] = useState<BlogPost[] | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);

    let mounted = true;
    fetchPosts().then((data) => {
      if (mounted) {
        const validPosts = data.filter(p => p.id);
        const finalPosts = limit ? validPosts.slice(0, limit) : validPosts;
        setPosts(finalPosts);
      }
    });
    
    return () => {
      mounted = false;
      window.removeEventListener('resize', handleResize);
    };
  }, [limit]);

  return (
    <section className="py-12 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8 md:mb-12 flex items-center justify-between"
      >
        <div className="flex-1">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
              {limit ? "Latest Posts" : "All Posts"}
            </span>
          </h2>
          <p className="text-base text-white/70 max-w-lg">
            {limit
              ? "A collection of my latest thoughts and writings."
              : "A complete archive of my blog posts."}
          </p>
        </div>
      </motion.div>

      {!posts ? (
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
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
          className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {posts.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <PostCard post={p} />
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
          <Link href="/blog">
            <MagneticButton size={isMobile ? "md" : "lg"} className="px-8 py-4 text-base">
              View All Blogs
            </MagneticButton>
          </Link>
        </motion.div>
      )}
    </section>
  );
}
