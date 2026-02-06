'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const CommentForm = () => {
  const [name, setName] = useState('');
  const [stars, setStars] = useState(0);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || stars === 0 || !text) {
      setError('Please fill out all fields and provide a star rating.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await addDoc(collection(firestore, 'comments'), {
        name,
        stars,
        text,
        createdAt: Timestamp.now(),
      });
      setSuccess(true);
      setName('');
      setStars(0);
      setText('');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-strong rounded-2xl border border-white/20 p-6"
    >
      <h3 className="font-display text-xl font-bold text-white mb-4">Leave a Feedback</h3>
      {success && (
        <div className="mb-4 text-green-500">
          Thank you for your feedback!
        </div>
      )}
      {error && (
        <div className="mb-4 text-red-500">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-white/70 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/10 rounded-lg border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white/70 text-sm font-bold mb-2">
            Stars
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setStars(star)}
                className={`text-2xl ${star <= stars ? 'text-yellow-400' : 'text-white/30'}`}
              >
                ★
              </motion.button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="text" className="block text-white/70 text-sm font-bold mb-2">
            Feedback
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-white/10 rounded-lg border border-white/20 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan"
            maxLength={500}
            required
          />
          <p className="text-right text-xs text-white/50">{text.length} / 500</p>
        </div>
        <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CommentForm;
