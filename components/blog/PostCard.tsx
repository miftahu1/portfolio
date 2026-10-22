'use client';

import Link from "next/link";
import type { BlogPost } from "@/lib/types";
import Image from "next/image";
import { getFormattedDate } from "@/lib/utils";
import Tilt from "@/components/ui/Tilt";

const PALETTE = [
  { bg: "#D4FF3A", fg: "#0B0B14" },
  { bg: "#FF3D8B", fg: "#0B0B14" },
  { bg: "#FFC83D", fg: "#0B0B14" },
  { bg: "#3626FF", fg: "#F4F1FF" },
];

export default function PostCard({ post }: { post: BlogPost }) {
  const date = getFormattedDate(post.publishedAt);
  const { bg, fg } = PALETTE[post.id.charCodeAt(0) % PALETTE.length];

  return (
    <Link href={`/blog/${post.slug}`} className="block h-full">
      <Tilt className="h-full rounded-[28px]" max={6}>
        <article
          className="group flex h-full flex-col rounded-[28px] border-2 border-ink p-4 shadow-[6px_6px_0_0_rgba(244,241,255,0.18)] transition-shadow duration-300 hover:shadow-[10px_10px_0_0_rgba(244,241,255,0.3)]"
          style={{ background: bg, color: fg }}
        >
          {post.heroImageUrl && (
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border-2" style={{ borderColor: fg }}>
              <Image
                src={post.heroImageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
              />
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2 pt-5">
            {date && <p className="text-xs font-bold opacity-70">{date}</p>}
            <h3 className="font-display text-2xl font-extrabold leading-tight tracking-tight">{post.title}</h3>
            <p className="line-clamp-2 text-sm opacity-85">{post.excerpt}</p>
            <span className="mt-auto pt-3 text-sm font-extrabold transition-transform duration-300 group-hover:translate-x-1">
              Read more →
            </span>
          </div>
        </article>
      </Tilt>
    </Link>
  );
}
