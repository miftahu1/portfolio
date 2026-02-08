import { notFound } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { BlogPost } from "@/lib/types";
import { Metadata } from "next";
import BlogPostClientPage from "./BlogPostClientPage";

// Generate metadata for this page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params;
  const ref = collection(firestore, "posts");
  const q = query(ref, where("slug", "==", slug));
  const snap = await getDocs(q);

  if (snap.empty) {
    return {};
  }

  const post = snap.docs[0].data() as BlogPost;

  return {
    title: `${post.title} | Miftahul's Blog`,
    description: post.excerpt || "A blog post by Miftahul Hussain.",
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      url: `https://miftahul.in/blog/${slug}`,
      images: post.heroImageUrl ? [{ url: post.heroImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: post.heroImageUrl ? [post.heroImageUrl] : [],
    },
  };
}

// This is the main Server Component for the page
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
  const postData = postDoc.data();

  // Create the complete BlogPost object, providing default values for likes/dislikes
  const post: BlogPost = {
    id: postDoc.id,
    slug: postData.slug,
    title: postData.title,
    excerpt: postData.excerpt,
    contentMarkdown: postData.contentMarkdown,
    tags: postData.tags,
    published: postData.published,
    createdAt: postData.createdAt,
    updatedAt: postData.updatedAt,
    publishedAt: postData.publishedAt || null,
    heroImageUrl: postData.heroImageUrl,
    seoDescription: postData.seoDescription || '',
    likes: postData.likes || 0,
    dislikes: postData.dislikes || 0,
  };

  return <BlogPostClientPage post={post} />;
}
