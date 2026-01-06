export type Project = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  tech: string[];
  role?: string;
  heroImageUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  sortOrder: number;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  tags: string[];
  published: boolean;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
  seoDescription?: string;
  heroImageUrl?: string;
};

export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  budget?: string;
  message: string;
  createdAt: number;
  read: boolean;
};

