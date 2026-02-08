'use client';

import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import { motion } from "framer-motion";
import Image from "next/image";
import { getFormattedDate } from "@/lib/utils";

export default function PostCard({ post }: { post: BlogPost }) {
  const date = getFormattedDate(post.publishedAt);

  return (
    <Link href={`/blog/${post.slug}`}>
      <motion.div 
        className="relative block w-full bg-black rounded-2xl overflow-hidden group border border-white/10 hover:border-white/20 transition-all aspect-[4/3]"
        whileHover={{ y: -4 }}
      >
        {post.heroImageUrl && (
          <Image 
            src={post.heroImageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <p className="text-xs text-muted mb-1">{date}</p>
          <h3 className="font-bold text-white text-lg mb-2">{post.title}</h3>
          <p className="text-sm text-white/70 line-clamp-2">{post.excerpt}</p>
        </div>
      </motion.div>
    </Link>
  );
}
