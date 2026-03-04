'use client';

import { useEffect, useState, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import type { BlogPost } from "@/lib/types";
import LegacyImageUpload from "@/components/admin/LegacyImageUpload";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const newPostFormId = useId();

  useEffect(() => {
    if (editing) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [editing]);

  useEffect(() => {
    async function load() {
      const ref = collection(firestore, "posts");
      const q = query(ref, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPosts(
        snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Omit<BlogPost, "id">) }) as BlogPost,
        ),
      );
      setLoading(false);
    }
    load();
  }, []);

  const handleSaved = (post: BlogPost, isNew: boolean) => {
    setPosts((prev) =>
      isNew ? [post, ...prev] : prev.map((p) => (p.id === post.id ? post : p)),
    );
    setEditing(null);
  };

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Delete post "${post.title}"?`)) return;
    await deleteDoc(doc(firestore, "posts", post.id));
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
  };
  
  const handleNewPost = () => {
    const now = Timestamp.now();
    setEditing({
      id: `new-${newPostFormId}`,
      title: "",
      slug: "",
      excerpt: "",
      contentMarkdown: "",
      tags: [],
      published: false,
      createdAt: now,
      updatedAt: now,
      heroImageUrl: "",
      likes: 0,
      dislikes: 0,
    });
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between glass-strong rounded-2xl border border-white/20 p-6"
      >
        <div>
          <h2 className="font-display text-2xl font-bold text-white mb-1">
            Blog <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">Posts</span>
          </h2>
          <p className="text-sm text-white/70">
            Create and manage your blog content
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow hover:shadow-glow-pink transition-all"
          onClick={handleNewPost}
        >
          + New Post
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="glass-strong rounded-2xl border border-white/20 p-8 text-center">
          <p className="text-white/70">Loading posts…</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((p, idx) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="glass-strong rounded-2xl border border-white/20 p-5 hover:border-white/30 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-white text-lg mb-1">{p.title}</h3>
                  <p className="text-sm text-white/60 font-mono mb-2">{p.slug}</p>
                  <div className="flex items-center gap-2">
                    {p.published ? (
                      <span className="inline-block rounded-full bg-gradient-to-r from-accent-cyan to-accent-yellow px-2 py-1 text-[10px] font-semibold text-white">
                        ✓ Published
                      </span>
                    ) : (
                      <span className="inline-block rounded-full glass border border-white/20 px-2 py-1 text-[10px] font-semibold text-white/60">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-glow-blue transition-all"
                  onClick={() => setEditing(p)}
                >
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-red-500/50 transition-all"
                  onClick={() => handleDelete(p)}
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))}
          {posts.length === 0 && (
            <div className="col-span-2 glass-strong rounded-2xl border border-white/20 p-12 text-center">
              <p className="text-white/70 text-lg mb-2">No posts yet.</p>
              <p className="text-white/50 text-sm">Create your first blog post to get started!</p>
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {editing && (
          <motion.div
            key={editing.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
            onMouseDown={() => setEditing(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative max-w-3xl w-full my-8"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <PostForm 
                initial={editing} 
                onCancel={() => setEditing(null)} 
                onSaved={handleSaved} 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type FormProps = {
  initial: BlogPost;
  onCancel: () => void;
  onSaved: (p: BlogPost, isNew: boolean) => void;
};

function PostForm({ initial, onCancel, onSaved }: FormProps) {
  const isNew = initial.id.startsWith('new-');
  const [state, setState] = useState<BlogPost>(initial);
  const [saving, setSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setState((s) => ({ ...s, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setState((s) => ({ ...s, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const now = Timestamp.now();
    const payload = {
      ...state,
      tags:
        typeof state.tags === "string"
          ? (state.tags as unknown as string).split(",").map((t) => t.trim())
          : state.tags,
      updatedAt: now,
      publishedAt: state.published ? state.publishedAt ?? now : null,
    };

    if (isNew) {
      const { id, ...submitPayload } = payload;
      const ref = await addDoc(collection(firestore, "posts"), {
        ...submitPayload,
        createdAt: now,
      });
      onSaved({ ...submitPayload, id: ref.id } as BlogPost, true);
    } else {
      const { id, ...submitPayload } = payload;
      await updateDoc(doc(firestore, "posts", id), submitPayload);
      onSaved(payload as BlogPost, false);
    }
    setSaving(false);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5 glass-strong rounded-2xl border border-white/20 p-6"
    >
        <h3 className="font-display text-xl font-bold text-white mb-1">
        {isNew ? "Create New" : "Edit"} <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">Blog Post</span>
      </h3>
      <p className="text-sm text-white/70 mb-4">
        Fill in the details below to {isNew ? "create" : "update"} your blog post
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            value={state.title}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-purple focus:shadow-glow-pink"
            placeholder="Post Title"
          />
        </Field>
        <Field label="Slug">
          <input
            name="slug"
            value={state.slug}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-blue focus:shadow-glow-blue font-mono"
            placeholder="post-slug"
          />
        </Field>
        <Field label="Excerpt" full>
          <input
            name="excerpt"
            value={state.excerpt}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-cyan focus:shadow-glow-cyan"
            placeholder="Brief description of the post"
          />
        </Field>
        <Field label="Tags (comma-separated)" full>
          <input
            name="tags"
            value={Array.isArray(state.tags) ? state.tags.join(", ") : state.tags}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-yellow focus:shadow-glow"
            placeholder="react, nextjs, typescript"
          />
        </Field>
        <Field label="SEO description" full>
          <input
            name="seoDescription"
            value={state.seoDescription ?? ""}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-purple focus:shadow-glow-pink"
            placeholder="SEO description for search engines"
          />
        </Field>
        <div className="flex items-center gap-2 pt-4">
          <input
            id="published"
            type="checkbox"
            name="published"
            checked={state.published}
            onChange={handleCheckbox}
            className="h-4 w-4 rounded border-white/20 bg-black/40"
          />
          <label htmlFor="published" className="text-sm text-white/80">
            Published
          </label>
        </div>
      </div>
      <LegacyImageUpload
        value={state.heroImageUrl || ""}
        onChange={(url) => setState((s) => ({ ...s, heroImageUrl: url }))}
        folder="blog"
        label="Cover Image"
      />
      <Field label="Content (Markdown)" full>
        <textarea
          name="contentMarkdown"
          rows={8}
          value={state.contentMarkdown}
          onChange={handleChange}
          className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-purple focus:shadow-glow-pink resize-none font-mono"
          placeholder="# Your Markdown content here..."
        />
      </Field>
      <div className="flex justify-end gap-3 pt-4">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl glass border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 hover:text-white hover:border-white/30 transition-all"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={saving}
          whileHover={{ scale: saving ? 1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow hover:shadow-glow-pink disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Saving...
            </span>
          ) : (
            "Save Post"
          )}
        </motion.button>
      </div>
    </motion.form>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2 space-y-2" : "space-y-2"}>
      <label className="text-sm font-semibold text-white/90">{label}</label>
      {children}
    </div>
  );
}
