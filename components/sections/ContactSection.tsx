"use client";

import { motion } from "framer-motion";
import ContactForm from "@/components/ui/ContactForm";

export default function ContactSection() {
  return (
    <section id="contact" className="mt-32 relative">
      <div className="absolute inset-0 bg-gradient-mesh opacity-30 rounded-3xl blur-3xl -z-10" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="grid gap-12 md:grid-cols-[1fr_1.2fr] items-start"
      >
        <div className="space-y-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-display text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Let&apos;s build something{" "}
              <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
                extraordinary
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/80 leading-relaxed"
            >
              Tell me about your vision, the challenges you&apos;re facing, and
              what success looks like. I&apos;ll respond with a thoughtful,
              personalized approach—not a template.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            {[
              { icon: "💬", text: "Quick Response" },
              { icon: "🎯", text: "Focused Solutions" },
              { icon: "✨", text: "Beautiful Design" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + idx * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80"
              >
                <span className="mr-2">{item.icon}</span>
                {item.text}
              </motion.div>
            ))}
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ContactForm />
        </motion.div>
      </motion.div>
    </section>
  );
}

