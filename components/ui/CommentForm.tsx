'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const RATING_LABELS = ['', 'Not great', 'Okay', 'Good', 'Great', 'Loved it'];

const field =
  'w-full rounded-[14px] border-2 border-ink bg-white px-4 py-3 text-ink placeholder:text-ink/40 transition-shadow duration-200 focus:outline-none focus:ring-4 focus:ring-pink/50';

const CommentForm = () => {
  const [name, setName] = useState('');
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
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

  const shown = hover || stars;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className="relative rounded-[28px] border-2 border-ink bg-bone p-5 text-ink shadow-[8px_8px_0_0_rgba(244,241,255,0.2)] md:p-8"
    >
      <h3 className="mb-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Leave a Feedback</h3>
      <p className="mb-6 text-sm text-ink/70">It takes a minute, and it means a lot.</p>

      <AnimatePresence>
        {success && (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 16 }}
            className="mb-5 rounded-[14px] border-2 border-ink bg-lime p-3 text-sm font-bold"
          >
            Thank you for your feedback!
          </motion.div>
        )}
        {error && (
          <motion.div
            key="err"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: [0, -8, 8, -4, 0] }}
            exit={{ opacity: 0 }}
            className="mb-5 rounded-[14px] border-2 border-ink bg-pink p-3 text-sm font-bold"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-extrabold">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-extrabold">Your Rating</label>
          <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                type="button"
                aria-label={`Rate ${star} out of 5`}
                aria-pressed={star === stars}
                whileHover={{ scale: 1.25, rotate: -8 }}
                whileTap={{ scale: 0.85 }}
                animate={star === stars ? { scale: [1, 1.5, 1], rotate: [0, -18, 0] } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 14 }}
                onMouseEnter={() => setHover(star)}
                onClick={() => setStars(star)}
                className={`text-4xl leading-none transition-colors md:text-5xl ${
                  star <= shown ? 'text-sun drop-shadow-[2px_2px_0_#0B0B14]' : 'text-ink/20'
                }`}
              >
                ★
              </motion.button>
            ))}
            <span className="ml-3 min-w-[5rem] text-sm font-extrabold">{RATING_LABELS[shown]}</span>
          </div>
        </div>

        <div>
          <label htmlFor="text" className="mb-2 block text-sm font-extrabold">
            Feedback
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className={field}
            maxLength={500}
            required
          />
          <p className="mt-1 text-right text-xs font-bold text-ink/60">{text.length} / 500</p>
        </div>

        <motion.button
          type="submit"
          whileHover={{ y: -3 }}
          whileTap={{ y: 2 }}
          className="w-full rounded-full border-2 border-ink bg-lime px-4 py-3.5 font-display text-lg font-extrabold text-ink shadow-[5px_5px_0_0_#0B0B14] transition-colors hover:bg-pink disabled:cursor-not-allowed disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CommentForm;
