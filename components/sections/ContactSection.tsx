'use client';

import { motion } from 'framer-motion';
import { Code, Gauge, Palette, Rocket } from 'lucide-react';
import ContactForm from '@/components/ui/ContactForm';
import SectionHeading from '@/components/ui/SectionHeading';
import CircularBadge from '@/components/ui/CircularBadge';
import { socials } from '@/components/ui/SocialLinks';

const chips = [
  { text: "Quick Response", bg: "#0B0B14", fg: "#D4FF3A", rotate: -4 },
  { text: "Focused Solutions", bg: "#D4FF3A", fg: "#0B0B14", rotate: 3 },
  { text: "Beautiful Design", bg: "#F4F1FF", fg: "#0B0B14", rotate: -2 },
];

const handles = [
  { label: "UI design", Icon: Palette, bg: "#F4F1FF", fg: "#0B0B14" },
  { label: "Development", Icon: Code, bg: "#D4FF3A", fg: "#0B0B14" },
  { label: "Optimization", Icon: Gauge, bg: "#FFC83D", fg: "#0B0B14" },
  { label: "Deployment", Icon: Rocket, bg: "#0B0B14", fg: "#D4FF3A" },
];

export default function ContactSection() {
  return (
    <section id="contact" className="my-24">
      <div
        className="relative overflow-hidden rounded-[40px] bg-pink text-ink"
        style={{ marginLeft: "calc(50% - 50vw)", width: "100vw" }}
      >
        <div className="float-c pointer-events-none absolute -right-6 top-8 hidden md:block" style={{ "--r": "8deg" } as React.CSSProperties}>
          <CircularBadge fill="#D4FF3A" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
          <div className="grid items-start gap-12 md:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading
                title="Let’s build something extraordinary"
                tone="dark"
                className="!mb-8 md:!mb-8"
                description="Tell me about your vision, the challenges you're facing, and what success looks like. I'll respond with a thoughtful, personalized approach—not a template."
              />

              <div className="flex flex-wrap gap-3">
                {chips.map((chip, idx) => (
                  <motion.div
                    key={chip.text}
                    initial={{ opacity: 0, scale: 0.6, rotate: 0 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: chip.rotate }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 160, damping: 11, delay: 0.2 + idx * 0.1 }}
                    whileHover={{ scale: 1.1, rotate: 0 }}
                    className="rounded-full border-2 border-ink px-4 py-2 text-sm font-extrabold shadow-[4px_4px_0_0_#0B0B14]"
                    style={{ background: chip.bg, color: chip.fg }}
                  >
                    {chip.text}
                  </motion.div>
                ))}
              </div>

              {/* What I handle: straight from the experience section */}
              <div className="mt-12">
                <h3 className="mb-4 font-display text-2xl font-extrabold">What I handle</h3>
                <div className="grid grid-cols-2 gap-4">
                  {handles.map(({ label, Icon, bg, fg }, idx) => (
                    <motion.div
                      key={label}
                      initial={{ opacity: 0, y: 40, rotate: idx % 2 ? 4 : -4 }}
                      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ type: "spring", stiffness: 120, damping: 13, delay: idx * 0.08 }}
                      whileHover={{ y: -6, rotate: idx % 2 ? 2 : -2 }}
                      className="flex items-center gap-3 rounded-[20px] border-2 border-ink p-4 shadow-[5px_5px_0_0_#0B0B14]"
                      style={{ background: bg, color: fg }}
                    >
                      <Icon size={26} strokeWidth={2.4} />
                      <span className="font-display text-lg font-extrabold leading-tight">{label}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Find me online */}
              <div className="mt-12">
                <h3 className="mb-4 font-display text-2xl font-extrabold">Find me online</h3>
                <div className="flex flex-wrap gap-3">
                  {socials.map((s, idx) => (
                    <motion.a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0.7 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 14, delay: idx * 0.07 }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-bone px-4 py-2 text-sm font-extrabold text-ink shadow-[4px_4px_0_0_#0B0B14] transition-colors hover:bg-lime"
                    >
                      <span className="[&>svg]:h-4 [&>svg]:w-4">{s.icon}</span>
                      {s.name}
                      <span aria-hidden="true">↗</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.15 }}
              className="rounded-[28px] border-2 border-ink bg-ink p-1 shadow-[10px_10px_0_0_#0B0B14] md:sticky md:top-24"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
