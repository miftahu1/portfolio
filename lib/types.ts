import { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
  github: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  createdAt: Timestamp;
}

export interface ContactRequest {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Timestamp;
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
