'use client';
import Image from "next/image";
import type { BlogPost } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Prose from "@/components/blog/Prose";
import { getFormattedDate } from "@/lib/utils";
import { likePost, dislikePost, undoLikePost, undoDislikePost } from "@/lib/firestore";
import { useState, useRef, useEffect } from "react";
import html2canvas from 'html2canvas';
import { motion, useScroll, useTransform } from "framer-motion";

export default function BlogPostClientPage({ post: initialPost }: { post: BlogPost }) {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [isLoading, setIsLoading] = useState(false);
  const [interactionStatus, setInteractionStatus] = useState<'liked' | 'disliked' | null>(null);
  const blogPostRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.3], ["0%", "-50%"]);

  useEffect(() => {
    const status = localStorage.getItem(`post-interaction-${post.id}`);
    if (status === 'liked' || status === 'disliked') {
      setInteractionStatus(status);
    }
  }, [post.id]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    if (interactionStatus === 'liked') {
      await undoLikePost(post.id);
      setPost({ ...post, likes: post.likes - 1 });
      setInteractionStatus(null);
      localStorage.removeItem(`post-interaction-${post.id}`);
    } else if (interactionStatus === 'disliked') {
      await undoDislikePost(post.id);
      await likePost(post.id);
      setPost({ ...post, likes: post.likes + 1, dislikes: post.dislikes - 1 });
      setInteractionStatus('liked');
      localStorage.setItem(`post-interaction-${post.id}`, 'liked');
    } else {
      await likePost(post.id);
      setPost({ ...post, likes: post.likes + 1 });
      setInteractionStatus('liked');
      localStorage.setItem(`post-interaction-${post.id}`, 'liked');
    }

    setIsLoading(false);
  };

  const handleDislike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    if (interactionStatus === 'disliked') {
      await undoDislikePost(post.id);
      setPost({ ...post, dislikes: post.dislikes - 1 });
      setInteractionStatus(null);
      localStorage.removeItem(`post-interaction-${post.id}`);
    } else if (interactionStatus === 'liked') {
      await undoLikePost(post.id);
      await dislikePost(post.id);
      setPost({ ...post, dislikes: post.dislikes + 1, likes: post.likes - 1 });
      setInteractionStatus('disliked');
      localStorage.setItem(`post-interaction-${post.id}`, 'disliked');
    } else {
      await dislikePost(post.id);
      setPost({ ...post, dislikes: post.dislikes + 1 });
      setInteractionStatus('disliked');
      localStorage.setItem(`post-interaction-${post.id}`, 'disliked');
    }

    setIsLoading(false);
  };

  const handleDownload = () => {
    if (blogPostRef.current) {
      html2canvas(blogPostRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${post.slug}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const date = getFormattedDate(post.publishedAt);

  // Structured data for the blog post
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    image: post.heroImageUrl || undefined,
    author: {
      '@type': 'Person',
      name: 'Miftahul Hussain',
      url: 'https://miftahul.in',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Miftahul Hussain',
      logo: {
        '@type': 'ImageObject',
        url: 'https://miftahul.in/logo.png',
      },
    },
    datePublished: post.publishedAt ? new Date(post.publishedAt.seconds * 1000).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt.seconds * 1000).toISOString() : undefined,
    description: post.excerpt,
  };

  // Custom components for ReactMarkdown
  const components = {
    img: ({ node, ...props }: any) => {
      const { src, alt } = props;
      return (
        <div className="relative w-full my-8 h-[450px] rounded-2xl overflow-hidden shadow-xl">
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <motion.header 
        className="relative h-[400px] md:h-[500px] w-full flex flex-col justify-end items-start pt-24"
      >
        {post.heroImageUrl && (
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y }}
          >
            <Image
              src={post.heroImageUrl}
              alt={`${post.title} hero image`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </motion.div>
        )}
        <div className="relative z-10 p-6 md:p-12 max-w-4xl">
            <p className="text-sm uppercase tracking-[0.18em] text-accent mb-2">
              {post.tags?.join(" / ") || "Writing"}
            </p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
              {post.title}
            </h1>
            {date && (
              <p className="text-sm text-muted">
                Published on {date}
              </p>
            )}
        </div>
      </motion.header>

      <article className="max-w-4xl mx-auto py-12 px-6" ref={blogPostRef}>
        <Prose>
          <ReactMarkdown 
            rehypePlugins={[rehypeRaw]}
            components={components}
          >
            {post.contentMarkdown}
          </ReactMarkdown>
        </Prose>

        <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted">How was this post?</p>
            <button onClick={handleLike} disabled={isLoading} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${interactionStatus === 'liked' ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-500'}`}>
              <span>👍</span>
              <span>{post.likes}</span>
            </button>
            <button onClick={handleDislike} disabled={isLoading} className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${interactionStatus === 'disliked' ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500'}`}>
              <span>👎</span>
              <span>{post.dislikes}</span>
            </button>
          </div>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>
            <span>Download</span>
          </button>
        </div>
      </article>
    </>
  );
}
