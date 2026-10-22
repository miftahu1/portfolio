'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** "dark" sets ink text for use on lime / pink / sun blocks. */
  tone?: 'light' | 'dark';
};

/** Section title whose words spring up out of a mask when it scrolls into view. */
export default function SectionHeading({ title, description, action, className = '', tone = 'light' }: Props) {
  const reduce = useReducedMotion();
  const words = title.split(' ');
  const dark = tone === 'dark';

  return (
    <div className={`mb-10 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-4xl">
        <h2
          className={`font-display text-[clamp(2.75rem,8vw,6.5rem)] font-extrabold leading-[1] tracking-[-0.03em] ${
            dark ? 'text-ink' : 'text-bone'
          }`}
        >
          {words.map((word, i) => (
            <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.16em] align-bottom">
              <motion.span
                className="inline-block"
                initial={reduce ? false : { y: '115%', rotate: 6 }}
                whileInView={{ y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ type: 'spring', stiffness: 140, damping: 16, delay: i * 0.07 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>
        {description && (
          <p className={`mt-5 max-w-[60ch] text-base md:text-lg ${dark ? 'text-ink/80' : 'text-muted'}`}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}
