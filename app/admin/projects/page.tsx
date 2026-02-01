'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import type { Project } from '@/lib/types';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Project | null>(null);

  useEffect(() => {
    async function load() {
      const ref = collection(db, 'projects');
      const q = query(ref, orderBy('sortOrder', 'asc'));
      const snap = await getDocs(q);
      setProjects(
        snap.docs.map(
          (d) => ({ id: d.id, ...(d.data() as Omit<Project, 'id'>) }) as Project
        )
      );
      setLoading(false);
    }
    load();
  }, []);

  const handleSaved = (project: Project, isNew: boolean) => {
    setProjects((prev) =>
      isNew ? [...prev, project] : prev.map((p) => (p.id === project.id ? project : p))
    );
    setEditing(null);
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete project '"${project.title}"'?`)) return;

    if (project.heroImageUrl) {
      const match = project.heroImageUrl.match(/upload\/(?:v\d+\/)?(.*)(?:\.\w+)/);
      const publicId = match ? match[1] : null;

      if (publicId) {
        try {
          const res = await fetch('/api/delete-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ publicId }),
          });
          if (!res.ok) {
            // Log error but don't block project deletion
            console.error('Failed to delete image from Cloudinary', await res.json());
          }
        } catch (error) {
          console.error('Error calling delete-image API', error);
        }
      }
    }

    await deleteDoc(doc(db, 'projects', project.id));
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
  };

  const handleNewProject = () => {
    const nextSortOrder =
      projects.length > 0 ? Math.max(...projects.map((p) => p.sortOrder)) + 1 : 1;

    setEditing({
      id: '',
      title: '',
      slug: '',
      excerpt: '',
      description: '',
      tech: [],
      sortOrder: nextSortOrder,
      featured: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
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
            Projects{' '}
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
              Management
            </span>
          </h2>
          <p className="text-sm text-white/70">Create and manage your portfolio projects</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow hover:shadow-glow-pink transition-all"
          onClick={handleNewProject}
        >
          + New Project
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="glass-strong rounded-2xl border border-white/20 p-8 text-center">
          <p className="text-white/70">Loading projects…</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((p, idx) => (
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
                  <p className="text-sm text-white/60 font-mono">{p.slug}</p>
                  {p.featured && (
                    <span className="inline-block mt-2 rounded-full bg-gradient-primary px-2 py-1 text-[10px] font-semibold text-white">
                      ⭐ Featured
                    </span>
                  )}
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
          {projects.length === 0 && (
            <div className="col-span-2 glass-strong rounded-2xl border border-white/20 p-12 text-center">
              <p className="text-white/70 text-lg mb-2">No projects yet.</p>
              <p className="text-white/50 text-sm">Create your first project to get started!</p>
            </div>
          )}
        </div>
      )}

      {editing && (
        <ProjectForm initial={editing} onCancel={() => setEditing(null)} onSaved={handleSaved} />
      )}
    </div>
  );
}

type FormProps = {
  initial: Project;
  onCancel: () => void;
  onSaved: (p: Project, isNew: boolean) => void;
};

function ProjectForm({ initial, onCancel, onSaved }: FormProps) {
  const isNew = !initial.id;
  const [state, setState] = useState<Project>(initial);
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const { id, ...payload } = {
      ...state,
      tech:
        typeof state.tech === 'string'
          ? (state.tech as unknown as string).split(',').map((t) => t.trim())
          : state.tech,
      sortOrder: Number(state.sortOrder) || 0,
      updatedAt: Date.now(),
    };

    if (isNew) {
      const ref = await addDoc(collection(db, 'projects'), {
        ...payload,
        createdAt: Date.now(),
      });
      onSaved({ ...(payload as Project), id: ref.id }, true);
    } else {
      await updateDoc(doc(db, 'projects', id), payload);
      onSaved({ ...(payload as Project), id }, false);
    }
    setSaving(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5 glass-strong rounded-2xl border border-white/20 p-6"
    >
      <h3 className="font-display text-xl font-bold text-white mb-1">
        {isNew ? 'Create New' : 'Edit'}{' '}
        <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
          Project
        </span>
      </h3>
      <p className="text-sm text-white/70 mb-4">
        Fill in the details below to {isNew ? 'create' : 'update'} your project
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title">
          <input
            name="title"
            value={state.title}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-purple focus:shadow-glow-pink"
            placeholder="Project Title"
          />
        </Field>
        <Field label="Slug">
          <input
            name="slug"
            value={state.slug}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-blue focus:shadow-glow-blue font-mono"
            placeholder="project-slug"
          />
        </Field>
        <Field label="Excerpt" full>
          <input
            name="excerpt"
            value={state.excerpt}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-cyan focus:shadow-glow-cyan"
            placeholder="Brief description of the project"
          />
        </Field>
        <Field label="Tech Stack (comma-separated)" full>
          <input
            name="tech"
            value={Array.isArray(state.tech) ? state.tech.join(', ') : state.tech}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-yellow focus:shadow-glow"
            placeholder="React, TypeScript, Next.js"
          />
        </Field>
        <Field label="Live URL">
          <input
            name="liveUrl"
            value={state.liveUrl ?? ''}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-purple focus:shadow-glow-pink font-mono"
            placeholder="https://project.com"
          />
        </Field>
        <Field label="Repo URL">
          <input
            name="repoUrl"
            value={state.repoUrl ?? ''}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-blue focus:shadow-glow-blue font-mono"
            placeholder="https://github.com/user/repo"
          />
        </Field>
        <Field label="Sort Order">
          <input
            name="sortOrder"
            type="number"
            value={state.sortOrder}
            onChange={handleChange}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-cyan focus:shadow-glow-cyan"
            placeholder="0"
          />
        </Field>
        <div className="flex items-center gap-2 pt-4">
          <input
            id="featured"
            type="checkbox"
            name="featured"
            checked={state.featured}
            onChange={handleCheckbox}
            className="h-3 w-3 rounded border-white/20 bg-black/40"
          />
          <label htmlFor="featured" className="text-[11px] text-white/80">
            Featured
          </label>
        </div>
      </div>
      <ImageUpload
        value={state.heroImageUrl ?? ''}
        onChange={(url) => setState((s) => ({ ...s, heroImageUrl: url }))}
        folder="projects"
        label="Hero Image"
      />
      <Field label="Description" full>
        <textarea
          name="description"
          rows={5}
          value={state.description}
          onChange={handleChange}
          className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-purple focus:shadow-glow-pink resize-none"
          placeholder="Detailed description of the project..."
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
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Saving...
            </span>
          ) : (
            'Save Project'
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
    <div className={full ? 'md:col-span-2 space-y-2' : 'space-y-2'}>
      <label className="text-sm font-semibold text-white/90">{label}</label>
      {children}
    </div>
  );
}
