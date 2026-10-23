'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { type Comment } from '@/lib/types';
import { Timestamp } from 'firebase/firestore';

interface CommentCardProps {
  comment: Comment;
  index?: number;
}

const PALETTE = [
  { bg: '#FFC83D', fg: '#0B0B14' },
  { bg: '#D4FF3A', fg: '#0B0B14' },
  { bg: '#FF3D8B', fg: '#0B0B14' },
  { bg: '#F4F1FF', fg: '#0B0B14' },
];

const CommentCard = ({ comment, index = 0 }: CommentCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const MAX_LENGTH = 120; // Slightly reduced for mobile
  const { bg, fg } = PALETTE[index % PALETTE.length];
  const odd = index % 2 === 1;

  const formattedDate = comment.createdAt instanceof Timestamp
    ? comment.createdAt.toDate().toLocaleDateString()
    : 'Invalid Date';

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, rotate: odd ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: odd ? 0.8 : -0.8 }}
      whileHover={{ rotate: 0, y: -4 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className="relative overflow-hidden rounded-[28px] border-2 border-ink p-5 shadow-[6px_6px_0_0_rgba(244,241,255,0.18)] md:p-6"
      style={{ background: bg, color: fg }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 right-5 font-display text-[7rem] font-extrabold leading-none opacity-15"
      >
        ”
      </span>

      <div className="relative mb-3 flex items-start justify-between gap-3">
        <p className="font-display text-xl font-extrabold md:text-2xl">{comment.name}</p>
        <div className="flex flex-shrink-0 items-center" aria-label={`${comment.stars} out of 5 stars`}>
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-xl md:text-2xl ${i < comment.stars ? '' : 'opacity-25'}`}>
              ★
            </span>
          ))}
        </div>
      </div>

      <div className="relative text-sm leading-relaxed md:text-base">
        {comment.text.length > MAX_LENGTH && !isExpanded
          ? <p>{`${comment.text.substring(0, MAX_LENGTH)}...`}</p>
          : <p>{comment.text}</p>}
        {comment.text.length > MAX_LENGTH && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-extrabold underline underline-offset-4"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>

      <p className="relative mt-4 text-right text-xs font-bold opacity-60">{formattedDate}</p>
    </motion.article>
  );
};

export default CommentCard;
