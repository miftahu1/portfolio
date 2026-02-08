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

export default function BlogPostClientPage({ post: initialPost }: { post: BlogPost }) {
  const [post, setPost] = useState<BlogPost>(initialPost);
  const [isLoading, setIsLoading] = useState(false);
  const [interactionStatus, setInteractionStatus] = useState<'liked' | 'disliked' | null>(null);
  const blogPostRef = useRef(null);

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
    <article className="mt-4" ref={blogPostRef}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-8 space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">
          Writing
        </p>
        <h1 className="font-display text-2xl md:text-3xl">{post.title}</h1>
        {date && (
          <p className="text-xs text-muted">
            {date} · {Array.isArray(post.tags) ? post.tags.join(" / ") : ''}
          </p>
        )}
      </header>
      
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

      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center gap-4">
          <button onClick={handleLike} disabled={isLoading} className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${interactionStatus === 'liked' ? 'bg-green-500 text-white' : 'bg-green-500/10 text-green-500'}`}>
            <span>👍</span>
            <span>{post.likes}</span>
          </button>
          <button onClick={handleDislike} disabled={isLoading} className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${interactionStatus === 'disliked' ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-500'}`}>
            <span>👎</span>
            <span>{post.dislikes}</span>
          </button>
        </div>
        <button onClick={handleDownload} className="px-3 py-1 rounded-md bg-blue-500/10 text-blue-500">
          <span>Download</span>
        </button>
      </div>
    </article>
  );
}
