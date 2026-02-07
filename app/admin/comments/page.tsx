'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { type Comment } from '@/lib/types';
import Skeleton from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import { getFormattedDate } from '@/lib/utils';

const AdminComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(firestore, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData: Comment[] = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ id: doc.id, ...doc.data() } as Comment);
      });
      setComments(commentsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      await deleteDoc(doc(firestore, 'comments', id));
    }
  };

  if (loading) {
    return <Skeleton className="h-96 rounded-2xl" />;
  }

  return (
    <div className="glass-strong rounded-2xl border border-white/20 p-4 md:p-6">
        <h3 className="font-display text-xl font-bold text-white mb-4">Manage Comments</h3>
        <div className="space-y-4">
        {comments.map((comment) => (
            <div key={comment.id} className="bg-white/10 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <div>
                        <p className="font-bold text-white">{comment.name} - <span className="text-yellow-400">{'★'.repeat(comment.stars)}</span></p>
                        <p className="text-xs text-white/50 mt-1">
                            {getFormattedDate(comment.createdAt)}
                        </p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, backgroundColor: '#ef4444' }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(comment.id)}
                        className="bg-red-600 text-white rounded-full px-3 py-1 text-xs font-bold mt-3 sm:mt-0 self-start sm:self-center"
                    >
                        Delete
                    </motion.button>
                </div>
                <p className="text-sm text-white/80 mt-3">{comment.text}</p>
            </div>
        ))}
        </div>
    </div>
  );
};

export default AdminComments;
