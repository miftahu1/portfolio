import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Project, Post, ContactRequest } from "./types";

const PROJECTS_COLLECTION = "projects";
const POSTS_COLLECTION = "posts";
const CONTACT_COLLECTION = "contactRequests";

export async function fetchProjects(onlyFeatured = false): Promise<Project[]> {
  const ref = collection(db, PROJECTS_COLLECTION);

  const q = onlyFeatured
    ? query(ref, where("featured", "==", true), orderBy("sortOrder", "asc"))
    : query(ref);

  const snap = await getDocs(q);
  
  // -- START DEBUGGING --
  console.log("Raw data from Firestore:", snap.docs.map(d => ({ id: d.id, ...d.data() })));
  // -- END DEBUGGING --

  const projects = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Project, "id">) }) as Project)
    .filter((p) => p.id);

  return projects.sort((a, b) => {
    const aSortOrder = a.sortOrder ?? 999;
    const bSortOrder = b.sortOrder ?? 999;
    return aSortOrder - bSortOrder;
  });
}

export async function fetchPosts(): Promise<Post[]> {
  const ref = collection(db, POSTS_COLLECTION);
  const q = query(ref, where("published", "==", true));
  const snap = await getDocs(q);
  const posts = snap.docs.map(
    (d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) }) as Post
  );
  return posts.sort((a, b) => {
    const aDate = a.publishedAt || a.createdAt || 0;
    const bDate = b.publishedAt || b.createdAt || 0;
    return bDate - aDate;
  });
}

export async function createContact(
  req: Omit<ContactRequest, "id" | "createdAt" | "read">,
) {
  const ref = collection(db, CONTACT_COLLECTION);
  const payload: Omit<ContactRequest, "id"> = {
    ...req,
    read: false,
    createdAt: Date.now(),
  };
  await addDoc(ref, payload);
}
