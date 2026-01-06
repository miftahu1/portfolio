"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import type { User } from "firebase/auth";
import { subscribeToAuth, login, logout } from "@/lib/auth";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeToAuth((u) => {
      setUser(u ?? null);
    });
    return () => unsub();
  }, []);

  if (user === undefined) {
    return (
      <div className="mx-auto mt-20 max-w-md">
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin error={error} onError={setError} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <div className="relative mx-auto mt-16 max-w-6xl px-6 pb-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 glass-strong rounded-2xl border border-white/20 p-6 flex items-center justify-between"
        >
          <div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">
              Admin <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">Dashboard</span>
            </h1>
            <p className="text-sm text-white/70">
              Signed in as <span className="text-accent-purple font-medium">{user.email}</span>
            </p>
          </div>
          <motion.button
            onClick={() => logout()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-red-500/50 transition-all"
          >
            Sign out
          </motion.button>
        </motion.header>
        {children}
      </div>
    </div>
  );
}

type LoginProps = {
  error: string | null;
  onError: (e: string | null) => void;
};

function AdminLogin({ error, onError }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    onError(null);
    try {
      await login(email.trim(), password);
    } catch {
      onError("Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-md w-full glass-strong rounded-2xl border border-white/20 p-8 shadow-glass"
      >
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl font-bold text-white mb-2">
            Admin <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">Access</span>
          </h1>
          <p className="text-sm text-white/70">
            Restricted area. Authentication required.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white/90" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-purple focus:shadow-glow-pink"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              placeholder="admin@example.com"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white/90" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all focus:border-accent-blue focus:shadow-glow-blue"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2"
            >
              {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-60 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

