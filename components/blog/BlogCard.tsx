'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";
import { getFormattedDate } from "@/lib/utils";

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = getFormattedDate(post.publishedAt);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group cursor-pointer overflow-hidden rounded-2xl glass border border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-glow"
    >
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        {post.heroImageUrl && (
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={post.heroImageUrl}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-3">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-gradient bg-gradient-primary bg-clip-text text-transparent transition-all duration-300">
              {post.title}
            </h3>
            {date && (
              <p className="text-xs uppercase tracking-wider text-white/50 font-medium">
                {date}
              </p>
            )}
          </div>
          <p className="text-sm text-white/70 leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between mt-4">
            <motion.div
              className="flex items-center gap-2 text-sm font-medium text-gradient bg-gradient-primary bg-clip-text text-transparent"
              whileHover={{ x: 5 }}
            >
              Read more →
            </motion.div>
            <div className="flex items-center gap-4 text-white/70">
              <div className="flex items-center gap-1">
                <span>👍</span>
                <span>{post.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>👎</span>
                <span>{post.dislikes}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
