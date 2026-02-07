'use client';

import { motion } from 'framer-motion';
import ContactForm from '@/components/ui/ContactForm';
import { useEffect, useState } from 'react';

export default function ContactSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => window.innerWidth < 768;
    setIsMobile(checkIsMobile());
    const handleResize = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Render a slim, performant version for mobile
  if (isMobile) {
    return (
      <section id="contact" className="my-16 relative">
        <div className="grid gap-8 items-start">
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-4">
                Let&apos;s build something{" "}
                <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
                  extraordinary
                </span>
              </h2>
              <p className="text-base text-white/80 leading-relaxed">
                Tell me about your vision, the challenges you&apos;re facing, and
                what success looks like. I&apos;ll respond with a thoughtful,
                personalized approach—not a template.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "💬", text: "Quick Response" },
                { icon: "🎯", text: "Focused Solutions" },
                { icon: "✨", text: "Beautiful Design" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="glass rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80"
                >
                  <span className="mr-1.5">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>
          </div>
          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    );
  }

  // Render the full, animated version for desktop
  return (
    <motion.section
      id="contact"
      className="my-24 relative"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="absolute inset-0 bg-gradient-mesh opacity-20 rounded-3xl blur-2xl -z-10" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid gap-12 md:grid-cols-[1fr_1.2fr] items-start"
      >
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Let&apos;s build something{" "}
              <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
                extraordinary
              </span>
            </h2>
            <p className="text-lg text-white/80 leading-relaxed">
              Tell me about your vision, the challenges you&apos;re facing, and
              what success looks like. I&apos;ll respond with a thoughtful,
              personalized approach—not a template.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { icon: "💬", text: "Quick Response" },
              { icon: "🎯", text: "Focused Solutions" },
              { icon: "✨", text: "Beautiful Design" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/80"
              >
                <span className="mr-1.5">{item.icon}</span>
                {item.text}
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <ContactForm />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
