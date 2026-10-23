'use client';

import { useState, useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { firestore } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { type Comment } from '@/lib/types';
import CommentCard from '@/components/ui/CommentCard';
import Skeleton from '@/components/ui/Skeleton';

function CountUp({ value }: { value: number }) {
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => v.toFixed(1));

  useEffect(() => {
    const controls = animate(mv, value, { duration: 1.2, ease: 'easeOut' });
    return () => controls.stop();
  }, [value, mv]);

  return <motion.span>{text}</motion.span>;
}

const CommentList = () => {
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

  if (loading) {
    return (
      <div className="space-y-5">
        <Skeleton className="h-24 rounded-[28px]" />
        <Skeleton className="h-24 rounded-[28px]" />
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-[28px] border-2 border-dashed border-bone/30 p-8 text-center text-muted">
        <p className="font-display text-2xl font-extrabold text-bone">No feedback yet.</p>
        <p className="mt-1">Be the first to leave a note.</p>
      </div>
    );
  }

  // Real numbers only: computed from the comments that exist
  const average = comments.reduce((sum, c) => sum + (c.stars || 0), 0) / comments.length;
  const rounded = Math.round(average);

  return (
    <div className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 110, damping: 15 }}
        className="flex items-center gap-5 rounded-[28px] border-2 border-ink bg-electric p-5 text-bone shadow-[6px_6px_0_0_rgba(244,241,255,0.18)] md:p-6"
      >
        <p className="font-display text-6xl font-extrabold leading-none text-lime md:text-7xl">
          <CountUp value={average} />
        </p>
        <div>
          <div className="flex text-2xl text-sun" aria-label={`Average ${average.toFixed(1)} out of 5`}>
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < rounded ? '' : 'opacity-25'}>★</span>
            ))}
          </div>
          <p className="mt-1 text-sm text-bone/80">
            from {comments.length} feedback{comments.length === 1 ? '' : 's'}
          </p>
        </div>
      </motion.div>

      {comments.map((comment, i) => (
        <CommentCard key={comment.id} comment={comment} index={i} />
      ))}
    </div>
  );
};

export default CommentList;
