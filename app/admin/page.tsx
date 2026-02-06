'use client';

import { useState, Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import Skeleton from '@/components/ui/Skeleton';
import { type User } from 'firebase/auth';
import { subscribeToAuth } from '@/lib/auth';

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

type TabId = 'projects' | 'blog' | 'requests' | 'pages';

interface Tab {
    id: TabId;
    label: string;
    icon: string;
    color: string;
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('projects');

  useEffect(() => {
    const unsub = subscribeToAuth((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const adminEmail = 'miftahulhussain43@gmail.com';
        const isUserAdmin = currentUser.email === adminEmail;
        setIsAdmin(isUserAdmin);

        if (!isUserAdmin) {
          setActiveTab('pages');
        } else {
            setActiveTab('projects')
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  const allTabs: Tab[] = [
    {
      id: 'projects',
      label: 'Projects',
      icon: '🚀',
      color: 'from-accent-purple to-accent-blue',
    },
    {
      id: 'blog',
      label: 'Blog Posts',
      icon: '📝',
      color: 'from-accent-blue to-accent-cyan',
    },
    {
      id: 'requests',
      label: 'Requests',
      icon: '📧',
      color: 'from-accent-cyan to-accent-yellow',
    },
    {
      id: 'pages',
      label: 'Demo Pages',
      icon: '📄',
      color: 'from-accent-yellow to-accent-red',
    },
  ];

  const visibleTabs = isAdmin ? allTabs : allTabs.filter(tab => tab.id === 'pages');

  if (user === undefined) {
      return <Skeleton className="h-96 rounded-2xl" />
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl border border-white/20 p-6"
      >
        <h2 className="font-display text-xl font-bold text-white mb-2">
          {isAdmin ? 'Welcome Super Admin 👋' : 'Welcome to the Dashboard 👋'}
        </h2>
        <p className="text-sm text-white/70">
          {isAdmin
            ? 'Manage your portfolio content, blog posts, and view contact requests all in one place.'
            : 'You have limited access. You can only manage Demo Pages.'}
        </p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-2xl border border-white/20 p-2 flex flex-wrap gap-2"
      >
        {visibleTabs.map((tab) => (
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
            {activeTab === 'projects' && isAdmin && <AdminProjects />}
            {activeTab === 'blog' && isAdmin && <AdminBlog />}
            {activeTab === 'requests' && isAdmin && <AdminRequests />}
            {activeTab === 'pages' && <AdminPages />}
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
