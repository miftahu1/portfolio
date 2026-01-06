"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { ContactRequest } from "@/lib/types";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);

  useEffect(() => {
    const ref = collection(db, "contactRequests");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setRequests(
        snap.docs.map(
          (d) =>
            ({ id: d.id, ...(d.data() as Omit<ContactRequest, "id">) }) as ContactRequest,
        ),
      );
    });
    return () => unsub();
  }, []);

  const markRead = async (req: ContactRequest) => {
    await updateDoc(doc(db, "contactRequests", req.id), { read: true });
  };

  const unreadCount = requests.filter((r) => !r.read).length;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl border border-white/20 p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white mb-1">
              Contact <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">Requests</span>
            </h2>
            <p className="text-sm text-white/70">
              View and manage website contact form submissions
            </p>
          </div>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="rounded-full bg-gradient-to-r from-accent-pink to-accent-purple px-4 py-2 text-sm font-bold text-white shadow-glow"
            >
              {unreadCount} New
            </motion.div>
          )}
        </div>
      </motion.div>

      {requests.length === 0 ? (
        <div className="glass-strong rounded-2xl border border-white/20 p-12 text-center">
          <p className="text-white/70 text-lg mb-2">No requests yet.</p>
          <p className="text-white/50 text-sm">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((r, idx) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01, y: -2 }}
              className={`glass-strong rounded-2xl border p-5 transition-all ${
                r.read ? "border-white/20" : "border-accent-cyan/50 shadow-glow-cyan"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-white text-lg">{r.name}</h3>
                    {!r.read && (
                      <span className="rounded-full bg-gradient-to-r from-accent-cyan to-accent-yellow px-2 py-1 text-[10px] font-semibold text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-accent-purple font-medium mb-1">{r.email}</p>
                  <p className="text-xs text-white/60">
                    {new Date(r.createdAt).toLocaleString()}
                  </p>
                  {r.budget && (
                    <div className="mt-2 inline-block rounded-full glass border border-white/20 px-3 py-1 text-xs font-medium text-white/80">
                      💰 Budget: {r.budget}
                    </div>
                  )}
                </div>
                {!r.read && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => markRead(r)}
                    className="rounded-xl bg-gradient-to-r from-accent-blue to-accent-cyan px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-glow-blue transition-all"
                  >
                    Mark Read
                  </motion.button>
                )}
              </div>
              <div className="mt-4 p-4 rounded-xl glass border border-white/10">
                <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                  {r.message}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

