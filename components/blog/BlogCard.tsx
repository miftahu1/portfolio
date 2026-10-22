'use client';

import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";
import { getFormattedDate } from "@/lib/utils";
import Tilt from "@/components/ui/Tilt";

const PALETTE = [
  { bg: "#D4FF3A", fg: "#0B0B14" },
  { bg: "#FF3D8B", fg: "#0B0B14" },
  { bg: "#FFC83D", fg: "#0B0B14" },
  { bg: "#3626FF", fg: "#F4F1FF" },
];

export default function BlogCard({ post }: { post: BlogPost }) {
  const date = getFormattedDate(post.publishedAt);
  const { bg, fg } = PALETTE[post.id.charCodeAt(0) % PALETTE.length];

  return (
    <Tilt className="h-full rounded-[28px]" max={6}>
      <article
        className="group relative h-full rounded-[28px] border-2 border-ink shadow-[6px_6px_0_0_rgba(244,241,255,0.18)] transition-shadow duration-300 hover:shadow-[10px_10px_0_0_rgba(244,241,255,0.3)]"
        style={{ background: bg, color: fg }}
      >
        <Link href={`/blog/${post.slug}`} className="flex h-full flex-col p-4">
          {post.heroImageUrl && (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] border-2" style={{ borderColor: fg }}>
              <Image
                src={post.heroImageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col pt-5">
            <h3 className="mb-1 font-display text-2xl font-extrabold leading-tight tracking-tight">{post.title}</h3>
            {date && <p className="mb-3 text-xs font-bold opacity-70">{date}</p>}
            <p className="line-clamp-3 flex-1 text-sm leading-relaxed opacity-85">{post.excerpt}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm font-extrabold transition-transform duration-300 group-hover:translate-x-1">Read more →</span>
              <div className="flex items-center gap-4 text-sm font-bold">
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
      </article>
    </Tilt>
  );
}
