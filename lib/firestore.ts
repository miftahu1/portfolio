import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  orderBy,
  addDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "./firebase";
import type { Project, BlogPost, ContactRequest, Page } from "./types";

const PROJECTS_COLLECTION = "projects";
const POSTS_COLLECTION = "posts";
const CONTACT_COLLECTION = "contactRequests";
const PAGES_COLLECTION = "pages";

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

export async function fetchPages(): Promise<Page[]> {
  const ref = collection(firestore, PAGES_COLLECTION);
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Page, "id">) }) as Page);
}

export async function fetchPage(id: string): Promise<Page | null> {
    const docRef = doc(firestore, PAGES_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as Omit<Page, "id">) } as Page;
    }
    return null;
}


export async function createPage(page: Omit<Page, "id">) {
  const ref = collection(firestore, PAGES_COLLECTION);
  await addDoc(ref, page);
}

export async function deletePage(id: string) {
  const ref = doc(firestore, PAGES_COLLECTION, id);
  await deleteDoc(ref);
}

export async function fetchPageByTitle(title: string): Promise<Page | null> {
    const ref = collection(firestore, PAGES_COLLECTION);
    const q = query(ref, where("title", "==", title));
    const snap = await getDocs(q);
    if (snap.empty) {
        return null;
    }
    const doc = snap.docs[0];
    return { id: doc.id, ...(doc.data() as Omit<Page, "id">) } as Page;
}
