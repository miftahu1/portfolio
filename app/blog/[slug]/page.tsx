import { notFound } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import Image from "next/image";
import { firestore } from "@/lib/firebase";
import type { BlogPost } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Prose from "@/components/blog/Prose";
import { getFormattedDate } from "@/lib/utils";
import { Metadata } from "next";

// Generate metadata for this page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const ref = collection(firestore, "posts");
  const q = query(ref, where("slug", "==", slug));
  const snap = await getDocs(q);

  if (snap.empty) {
    return {}; // Should be handled by notFound() in the component, but good practice
  }

  const post = snap.docs[0].data() as BlogPost;

  return {
    title: `${post.title} | Miftahul's Blog`,
    description: post.summary || "A blog post by Miftahul Hussain.",
    openGraph: {
      title: post.title,
      description: post.summary || "",
      type: "article",
      url: `https://miftahul.in/blog/${slug}`,
      images: post.heroImageUrl ? [{ url: post.heroImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary || "",
      images: post.heroImageUrl ? [post.heroImageUrl] : [],
    },
  };
}

// This is now a Server Component
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch data on the server
  const ref = collection(firestore, "posts");
  const q = query(ref, where("slug", "==", slug));
  const snap = await getDocs(q);

  // If no post is found, render a 404 page
  if (snap.empty) {
    notFound();
  }

  const postDoc = snap.docs[0];
  const post = { id: postDoc.id, ...postDoc.data() } as BlogPost;

  const date = getFormattedDate(post.publishedAt);

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
    <article className="mt-4">
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
    </article>
  );
}
