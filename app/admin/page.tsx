'use client';

import { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Skeleton from '@/components/ui/Skeleton';

// Lazy load admin pages for better performance
const AdminProjects = dynamic(() => import('./projects/page'), {
  loading: () => <Skeleton className="h-96 rounded-2xl" />,
  ssr: false,
});

const AdminBlog = dynamic(() => import('./blog/page'), {
  loading: () => <Skeleton className="h-96 rounded-2xl" />,
  ssr: false,
});

const AdminRequests = dynamic(() => import('./requests/page'), {
  loading: () => <Skeleton className="h-96 rounded-2xl" />,
  ssr: false,
});

const AdminPages = dynamic(() => import('./pages/page'), {
  loading: () => <Skeleton className="h-96 rounded-2xl" />,
  ssr: false,
});

type Tab = 'projects' | 'blog' | 'requests' | 'pages';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('projects');

  const tabs = [
    {
      id: 'projects' as Tab,
      label: 'Projects',
      icon: '🚀',
      color: 'from-accent-purple to-accent-blue',
    },
    {
      id: 'blog' as Tab,
      label: 'Blog Posts',
      icon: '📝',
      color: 'from-accent-blue to-accent-cyan',
    },
    {
      id: 'requests' as Tab,
      label: 'Requests',
      icon: '📧',
      color: 'from-accent-cyan to-accent-yellow',
    },
    {
      id: 'pages' as Tab,
      label: 'Demo Pages',
      icon: '📄',
      color: 'from-accent-yellow to-accent-red',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl border border-white/20 p-6"
      >
        <h2 className="font-display text-xl font-bold text-white mb-2">
          Welcome to Admin Dashboard 👋
        </h2>
        <p className="text-sm text-white/70">
          Manage your portfolio content, blog posts, and view contact requests all
          in one place.
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl border border-white/20 p-2 flex flex-wrap gap-2"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'text-white'
                : 'text-white/60 hover:text-white'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBg"
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${tab.color} opacity-90`}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative z-10 text-lg">{tab.icon}</span>
            <span className="relative z-10">{tab.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Tab Content - Embedded Pages */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Suspense fallback={<Skeleton className="h-96 rounded-2xl" />}>
            {activeTab === 'projects' && <AdminProjects />}
            {activeTab === 'blog' && <AdminBlog />}
            {activeTab === 'requests' && <AdminRequests />}
            {activeTab === 'pages' && <AdminPages />}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
