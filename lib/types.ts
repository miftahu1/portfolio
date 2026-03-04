
import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  name: string;
  slug: string;
  excerpt: string;
  description: string;
  tech: string[];
  sortOrder: number;
  featured: boolean;
  heroImageUrl: string;
  liveUrl?: string;
  repoUrl?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentMarkdown: string;
  tags: string[];
  published: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  publishedAt?: Timestamp | null;
  heroImageUrl: string;
  seoDescription?: string;
  likes: number;
  dislikes: number;
}

export interface ContactRequest {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Timestamp;
    read: boolean;
    budget?: number;
}

export interface Page {
    id: string;
    title: string;
    content: string;
}

export interface Comment {
    id: string;
    name: string;
    stars: number;
    text: string;
    createdAt: Timestamp;
}

export interface Photo {
  id: string;
  publicId: string;
  featured: boolean;
  title?: string;
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
