"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Image from "next/image";
import { db } from "@/lib/firebase";
import type { Post } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Prose from "@/components/blog/Prose";
import Skeleton from "@/components/ui/Skeleton";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const ref = collection(db, "posts");
      const q = query(ref, where("slug", "==", slug));
      const snap = await getDocs(q);
      if (snap.empty) {
        router.replace("/blog");
        return;
      }
      const d = snap.docs[0];
      setPost({ id: d.id, ...(d.data() as Omit<Post, "id">) });
    }
    load().catch(() => router.replace("/blog"));
  }, [slug, router]);

  if (!post) {
    return <Skeleton className="mt-10 h-40 rounded-xl" />;
  }

  const date =
    post.publishedAt && new Date(post.publishedAt).toLocaleDateString();

  // Custom components for ReactMarkdown
  const components = {
    // Handle images with Next.js Image component
    img: ({ node, ...props }: any) => {
      const { src, alt } = props;
      return (
        <div className="relative w-full my-6 h-[400px] rounded-xl overflow-hidden">
          <Image
            src={src || ""}
            alt={alt || "Blog image"}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
          />
        </div>
      );
    },
  };

  return (
    <article className="mt-4">
      <header className="mb-8 space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">
          Writing
        </p>
        <h1 className="font-display text-2xl md:text-3xl">{post.title}</h1>
        {date && (
          <p className="text-xs text-muted">
            {date} · {post.tags.join(" / ")}
          </p>
        )}
      </header>
      
      {/* Hero Image if exists */}
      {post.heroImageUrl && (
        <div className="relative w-full h-64 mb-8 rounded-2xl overflow-hidden">
          <Image
            src={post.heroImageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 80vw"
            className="object-cover"
          />
        </div>
      )}
      
      <Prose>
        <ReactMarkdown 
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {post.contentMarkdown}
        </ReactMarkdown>
      </Prose>
    </article>
  );
}