'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createContact } from '@/lib/firestore';

type FormState = {
  name: string;
  email: string;
  budget: string;
  message: string;
};

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', budget: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await createContact({ name: form.name.trim(), email: form.email.trim(), budget, message: form.message.trim() });
      setSent(true);
      setForm({ name: '', email: '', budget: '', message: '' });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const MotionForm = isMobile ? 'form' : motion.form;
  const MotionButton = isMobile ? 'button' : motion.button;

  // Base classes
  const formBaseClass = "space-y-4 rounded-2xl border border-white/10 p-6";
  const inputBaseClass = "w-full rounded-xl border border-white/10 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition-all duration-300";
  const buttonBaseClass = "w-full rounded-xl bg-gradient-primary px-6 py-3 text-base font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-300";

  // Conditional classes for performance
  const formPerfClass = isMobile ? "bg-white/5" : "glass-strong";
  const inputPerfClass = isMobile ? "bg-white/10" : "glass";
  const nameFocusClass = isMobile ? "focus:border-accent-purple" : "focus:border-accent-purple focus:shadow-glow-pink";
  const emailFocusClass = isMobile ? "focus:border-accent-blue" : "focus:border-accent-blue focus:shadow-glow-blue";
  const budgetFocusClass = isMobile ? "focus:border-accent-cyan" : "focus:border-accent-cyan focus:shadow-glow-cyan";
  const messageFocusClass = isMobile ? "focus:border-accent-yellow" : "focus:border-accent-yellow focus:shadow-glow";
  const buttonPerfClass = isMobile ? "" : "shadow-glow-sm hover:shadow-glow-pink";

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl glass-strong border border-white/10 p-8 text-center"
      >
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }} className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
          <span className="text-2xl">✓</span>
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">Message sent!</h3>
        <p className="text-sm text-white/70">I&apos;ll review it and get back to you shortly.</p>
      </motion.div>
    );
  }

  return (
    <MotionForm onSubmit={handleSubmit} className={`${formBaseClass} ${formPerfClass}`}>
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-semibold text-white/90">Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" required className={`${inputBaseClass} ${inputPerfClass} ${nameFocusClass}`} />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-semibold text-white/90">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="your@email.com" required className={`${inputBaseClass} ${inputPerfClass} ${emailFocusClass}`} />
      </div>
      <div className="space-y-2">
        <label htmlFor="budget" className="text-sm font-semibold text-white/90">Budget <span className="text-white/50 font-normal">(optional)</span></label>
        <input id="budget" name="budget" value={form.budget} onChange={handleChange} placeholder="e.g. $3k - $8k" className={`${inputBaseClass} ${inputPerfClass} ${budgetFocusClass}`} />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-semibold text-white/90">Project details</label>
        <textarea id="message" name="message" rows={5} value={form.message} onChange={handleChange} placeholder="Tell me about your project..." required className={`${inputBaseClass} ${inputPerfClass} ${messageFocusClass} resize-none`} />
      </div>
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2">{error}</p>
      )}
      <MotionButton type="submit" disabled={loading} {...(!isMobile && { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } })} className={`${buttonBaseClass} ${buttonPerfClass}`}>
        {loading ? 'Sending...' : 'Send Message'}
      </MotionButton>
    </MotionForm>
  );
}
