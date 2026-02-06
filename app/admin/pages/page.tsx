'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPages() {
  const [pages, setPages] = useState<string[]>([]);
  const [pageName, setPageName] = useState('');
  const [pageCode, setPageCode] = useState('');
  const [editing, setEditing] = useState(false);
  const [isNewPage, setIsNewPage] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    const res = await fetch('/api/pages', { cache: 'no-store' });
    const data = await res.json();
    setPages(data.files);
  };

  const handleSavePage = async () => {
    if (!pageName) return;
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: pageName.replace(/ /g, '_') + '.html',
        content: pageCode,
      }),
    });

    if (res.ok) {
      fetchPages();
      setPageName('');
      setPageCode('');
      setEditing(false);
      setIsNewPage(false);
    }
  };

  const handleEdit = (page: string) => {
    setIsNewPage(false);
    setEditing(true);
    setPageName(page.replace('.html', ''));
    fetch(`/api/pages?fileName=${page}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        setPageCode(data.content);
      });
  };

  const handleAddNew = () => {
    setIsNewPage(true);
    setEditing(true);
    setPageName('');
    setPageCode('');
  };

  const handleDelete = async (fileName: string) => {
    if (window.confirm(`Are you sure you want to delete ${fileName}?`)) {
      const res = await fetch(`/api/pages?fileName=${fileName}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPages();
      } else {
        alert('Failed to delete page.');
      }
    }
  };

  const handleCopyLink = (fileName: string) => {
    navigator.clipboard.writeText(`https://miftahul.in/demo/${fileName}`);
  };

  return (
    <div className="glass-strong rounded-2xl border border-white/20 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-xl font-bold text-white">
          Demo Pages
        </h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddNew}
          className="rounded-xl bg-gradient-to-r from-accent-purple to-accent-blue px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-glow-purple transition-all"
        >
          Add New Page
        </motion.button>
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4">
              <h4 className="font-display text-lg font-bold text-white">
                {isNewPage ? 'Add New Page' : `Editing: ${pageName}.html`}
              </h4>
              <input
                type="text"
                placeholder="Page Name (e.g., my_awesome_page)"
                value={pageName}
                onChange={(e) => setPageName(e.target.value.replace(/ /g, '_'))}
                className="w-full bg-black/30 text-white rounded-lg border border-white/20 px-4 py-2 focus:ring-accent-blue focus:border-accent-blue transition-all"
                disabled={!isNewPage}
              />
              <textarea
                placeholder="Page Code (HTML)"
                value={pageCode}
                onChange={(e) => setPageCode(e.target.value)}
                className="w-full h-96 bg-black/30 text-white rounded-lg border border-white/20 px-4 py-2 focus:ring-accent-blue focus:border-accent-blue transition-all font-mono text-sm"
              ></textarea>
              <div className="flex gap-4">
                <motion.button
                  onClick={handleSavePage}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl bg-gradient-to-r from-accent-green to-accent-cyan px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-glow-green transition-all"
                >
                  Save Page
                </motion.button>
                <motion.button
                  onClick={() => setEditing(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-xl bg-gradient-to-r from-accent-red to-accent-yellow px-4 py-2 text-sm font-semibold text-white shadow-lg hover:shadow-glow-red transition-all"
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page: string) => (
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: pages.indexOf(page) * 0.05 }}
            className="glass rounded-xl border border-white/10 p-4 flex flex-col justify-between"
          >
            <a
              href={`/demo/${page}`}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-white hover:text-accent-cyan transition-colors truncate"
            >
              {page}
            </a>
            <div className="flex gap-2 mt-4">
              <motion.button
                onClick={() => handleCopyLink(page)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex-1 rounded-lg bg-black/30 text-white/70 hover:text-white px-3 py-1 text-xs"
              >
                Copy Link
              </motion.button>
              <motion.button
                onClick={() => handleEdit(page)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex-1 rounded-lg bg-black/30 text-white/70 hover:text-white px-3 py-1 text-xs"
              >
                Edit
              </motion.button>
              <motion.button
                onClick={() => handleDelete(page)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex-1 rounded-lg bg-red-500/50 text-white/70 hover:text-white hover:bg-red-500/80 px-3 py-1 text-xs"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
      {pages.length === 0 && !editing && (
        <p className="text-center text-white/50 py-8">No demo pages found. Add one!</p>
      )}
    </div>
  );
}
