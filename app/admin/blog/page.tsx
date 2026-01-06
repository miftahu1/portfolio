"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Post } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);

  useEffect(() => {
    async function load() {
      const ref = collection(db, "posts");
      const q = query(ref, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPosts(
        snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Omit<Post, "id">) }) as Post,
        ),
      );
      setLoading(false);
    }
    load();
  }, []);

  const handleSaved = (post: Post, isNew: boolean) => {
    setPosts((prev) =>
      isNew ? [post, ...prev] : prev.map((p) => (p.id === post.id ? post : p)),
    );
    setEditing(null);
  };

  const handleDelete = async (post: Post) => {
    if (!confirm(`Delete post "${post.title}"?`)) return;
    await deleteDoc(doc(db, "posts", post.id));
    setPosts((prev) => prev.filter((p) => p.id !== post.id));
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
          onClick={() =>
            setEditing({
              id: "",
              title: "",
              slug: "",
              excerpt: "",
              contentMarkdown: "",
              tags: [],
              published: false,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            })
          }
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

      {editing && (
        <PostForm
          initial={editing}
          onCancel={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

type FormProps = {
  initial: Post;
  onCancel: () => void;
  onSaved: (p: Post, isNew: boolean) => void;
};

function PostForm({ initial, onCancel, onSaved }: FormProps) {
  const isNew = !initial.id;
  const [state, setState] = useState<Post>(initial);
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
    const now = Date.now();
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
      const ref = await addDoc(collection(db, "posts"), {
        ...payload,
        createdAt: now,
      });
      onSaved({ ...(payload as Post), id: ref.id }, true);
    } else {
      await updateDoc(doc(db, "posts", state.id), payload);
      onSaved(payload as Post, false);
    }
    setSaving(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-white/10 bg-backgroundElevated/80 p-4 text-xs"
    >
      <h3 className="font-medium text-white">
        {isNew ? "New post" : "Edit post"}
      </h3>
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            value={state.title}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5"
          />
        </Field>
        <Field label="Slug">
          <input
            name="slug"
            value={state.slug}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5"
          />
        </Field>
        <Field label="Excerpt" full>
          <input
            name="excerpt"
            value={state.excerpt}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5"
          />
        </Field>
        <Field label="Tags (comma-separated)" full>
          <input
            name="tags"
            value={Array.isArray(state.tags) ? state.tags.join(", ") : state.tags}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5"
          />
        </Field>
        <Field label="SEO description" full>
          <input
            name="seoDescription"
            value={state.seoDescription ?? ""}
            onChange={handleChange}
            className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5"
          />
        </Field>
        <div className="flex items-center gap-2 pt-4">
          <input
            id="published"
            type="checkbox"
            name="published"
            checked={state.published}
            onChange={handleCheckbox}
            className="h-3 w-3 rounded border-white/20 bg-black/40"
          />
          <label htmlFor="published" className="text-[11px] text-white/80">
            Published
          </label>
        </div>
      </div>
      <ImageUpload
        value={state.heroImageUrl}
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
          className="w-full rounded-md border border-white/10 bg-black/20 px-2 py-1.5 font-mono"
        />
      </Field>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 px-3 py-1 text-[11px] text-muted hover:border-accent/60 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-accent px-4 py-1 text-[11px] font-medium text-black disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </form>
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
    <div className={full ? "md:col-span-2 space-y-1" : "space-y-1"}>
      <label className="text-[11px] text-white/80">{label}</label>
      {children}
    </div>
  );
}

