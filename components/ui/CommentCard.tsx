'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { type Comment } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

interface CommentCardProps {
  comment: Comment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 150;

  const formattedDate = comment.createdAt instanceof Timestamp
    ? comment.createdAt.toDate().toLocaleDateString()
    : 'Invalid Date';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl border border-white/20 p-6"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="font-bold text-white">{comment.name}</p>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-xl ${i < comment.stars ? 'text-yellow-400' : 'text-white/30'}`}>
              ★
            </span>
          ))}
        </div>
      </div>
      <p className="text-white/80">
        {comment.text.length > MAX_LENGTH && !isExpanded
          ? `${comment.text.substring(0, MAX_LENGTH)}...`
          : comment.text}
      </p>
      {comment.text.length > MAX_LENGTH && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-accent-cyan hover:underline mt-2 text-sm"
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </button>
      )}
      <p className="text-xs text-white/50 text-right mt-4">{formattedDate}</p>
    </motion.div>
  );
};

export default CommentCard;
