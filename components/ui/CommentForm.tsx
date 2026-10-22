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
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass rounded-xl border border-white/10 p-4 md:p-6"
    >
      <h3 className="font-display text-xl md:text-2xl font-bold text-white mb-4">Leave a Feedback</h3>
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          Thank you for your feedback!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-white/70 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 rounded-lg border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-shadow duration-300"
            required
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm font-bold mb-2">
            Your Rating
          </label>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setStars(star)}
                className={`text-2xl md:text-3xl mr-1 transition-colors ${star <= stars ? 'text-yellow-400' : 'text-white/30 hover:text-yellow-400/50'}`}
              >
                ★
              </motion.button>
            ))}
          </div>
        </div>
        <div>
          <label htmlFor="text" className="block text-white/70 text-sm font-bold mb-2">
            Feedback
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full bg-white/5 rounded-lg border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-shadow duration-300"
            maxLength={500}
            required
          />
          <p className="text-right text-xs text-white/50 mt-1">{text.length} / 500</p>
        </div>
        <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-accent-purple to-accent-blue text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CommentForm;
