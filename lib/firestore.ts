import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "./firebase";
import type { Project, BlogPost, ContactRequest } from "./types";

const PROJECTS_COLLECTION = "projects";
const POSTS_COLLECTION = "posts";
const CONTACT_COLLECTION = "contactRequests";

export async function fetchProjects(onlyFeatured = false): Promise<Project[]> {
  const ref = collection(firestore, PROJECTS_COLLECTION);

  const q = onlyFeatured
    ? query(ref, where("featured", "==", true), orderBy("sortOrder", "asc"))
    : query(ref);

  const snap = await getDocs(q);
  const projects = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }) as Project)
    .filter((p) => p.id);

  return projects.sort((a, b) => {
    const aSortOrder = a.sortOrder ?? 999;
    const bSortOrder = b.sortOrder ?? 999;
    return aSortOrder - bSortOrder;
  });
}

export async function fetchPosts(): Promise<BlogPost[]> {
  const ref = collection(firestore, POSTS_COLLECTION);
  const q = query(ref, where("published", "==", true));
  const snap = await getDocs(q);
  const posts = snap.docs.map(
    (d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, "id">) }) as BlogPost
  );
  return posts.sort((a, b) => {
    const aDate = a.publishedAt || a.createdAt;
    const bDate = b.publishedAt || b.createdAt;
    
    if (aDate && bDate) {
        return bDate.toMillis() - aDate.toMillis();
    }
    return 0
  });
}

export async function createContact(
  req: Omit<ContactRequest, "id" | "createdAt" | "read">,
) {
  const ref = collection(firestore, CONTACT_COLLECTION);
  const payload: Omit<ContactRequest, "id"> = {
    ...req,
    read: false,
    createdAt: Timestamp.now(),
  };
  await addDoc(ref, payload);
}
