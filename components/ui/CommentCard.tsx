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
  const MAX_LENGTH = 120; // Slightly reduced for mobile

  const formattedDate = comment.createdAt instanceof Timestamp
    ? comment.createdAt.toDate().toLocaleDateString()
    : 'Invalid Date';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl border border-white/10 p-4 md:p-6"
    >
      <div className="flex items-start justify-between mb-2">
        <p className="font-bold text-base md:text-lg text-white pr-2">{comment.name}</p>
        <div className="flex items-center flex-shrink-0">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-lg md:text-xl ${i < comment.stars ? 'text-yellow-400' : 'text-white/30'}`}>
              ★
            </span>
          ))}
        </div>
      </div>
      <div className="text-sm md:text-base text-white/80 leading-relaxed">
        {comment.text.length > MAX_LENGTH && !isExpanded
          ? <p>{`${comment.text.substring(0, MAX_LENGTH)}...`}</p>
          : <p>{comment.text}</p>}
        {comment.text.length > MAX_LENGTH && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-accent-cyan hover:underline mt-2 text-sm font-semibold"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
      <p className="text-xs text-white/50 text-right mt-3 md:mt-4">{formattedDate}</p>
    </motion.div>
  );
};

export default CommentCard;
