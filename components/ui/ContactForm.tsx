'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createContact } from '@/lib/firestore';

type FormState = {
  name: string;
  email: string;
  budget: string;
  message: string;
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    budget: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name || !form.email || !form.message) {
      setError('Name, email, and message are required.');
      return;
    }

    setLoading(true);
    try {
      const budgetString = form.budget.replace(/[^0-9]/g, '');
      const budget = budgetString ? parseInt(budgetString, 10) : undefined;

      await createContact({
        name: form.name.trim(),
        email: form.email.trim(),
        budget,
        message: form.message.trim(),
      });
      setSent(true);
      setForm({ name: '', email: '', budget: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl glass-strong border border-white/20 p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center"
        >
          <span className="text-2xl">✓</span>
        </motion.div>
        <p className="text-lg font-bold text-white mb-2">Message sent!</p>
        <p className="text-sm text-white/70">
          I&apos;ll review it and get back with next steps.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl glass-strong border border-white/20 p-6"
    >
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-white/90">
          Name
        </label>
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.01 }}
        >
          <input
            id="name"
            name="name"
            onFocus={() => setFocused('name')}
            onBlur={() => setFocused(null)}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-accent-purple focus:shadow-glow-pink"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
          {focused === 'name' && (
            <motion.div
              layoutId="inputFocus"
              className="absolute inset-0 rounded-xl border-2 border-accent-purple pointer-events-none"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-white/90">
          Email
        </label>
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.01 }}
        >
          <input
            id="email"
            name="email"
            type="email"
            onFocus={() => setFocused('email')}
            onBlur={() => setFocused(null)}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-accent-blue focus:shadow-glow-blue"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
          {focused === 'email' && (
            <motion.div
              layoutId="inputFocus"
              className="absolute inset-0 rounded-xl border-2 border-accent-blue pointer-events-none"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </div>

      <div className="space-y-2">
        <label htmlFor="budget" className="text-sm font-semibold text-white/90">
          Budget <span className="text-white/50 font-normal">(optional)</span>
        </label>
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.01 }}
        >
          <input
            id="budget"
            name="budget"
            onFocus={() => setFocused('budget')}
            onBlur={() => setFocused(null)}
            className="w-full rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-accent-cyan focus:shadow-glow-cyan"
            value={form.budget}
            onChange={handleChange}
            placeholder="e.g. $3k–$8k"
          />
          {focused === 'budget' && (
            <motion.div
              layoutId="inputFocus"
              className="absolute inset-0 rounded-xl border-2 border-accent-cyan pointer-events-none"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-white/90">
          Project details
        </label>
        <motion.div
          className="relative"
          whileFocus={{ scale: 1.01 }}
        >
          <textarea
            id="message"
            name="message"
            rows={5}
            onFocus={() => setFocused('message')}
            onBlur={() => setFocused(null)}
            className="w-full resize-none rounded-xl glass border border-white/20 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-300 focus:border-accent-yellow focus:shadow-glow"
            value={form.message}
            onChange={handleChange}
            placeholder="Tell me about your project..."
            required
          />
          {focused === 'message' && (
            <motion.div
              layoutId="inputFocus"
              className="absolute inset-0 rounded-xl border-2 border-accent-yellow pointer-events-none"
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full rounded-xl bg-gradient-primary px-6 py-4 text-sm font-semibold text-white shadow-glow hover:shadow-glow-pink disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-300"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
            />
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </motion.button>
    </motion.form>
  );
}
