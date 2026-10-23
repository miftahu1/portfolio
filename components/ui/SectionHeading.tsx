'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** "dark" sets ink text for use on lime / pink / sun blocks. */
  tone?: 'light' | 'dark';
  /** 1 renders an h1 (page titles), 2 an h2 (section titles). */
  level?: 1 | 2;
  size?: 'lg' | 'md';
};

const wordVariants: Variants = {
  hidden: { y: '115%', rotate: 6 },
  visible: (i: number) => ({
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 140, damping: 16, delay: i * 0.07 },
  }),
};

/**
 * Section title whose words spring up out of a mask when it scrolls into view.
 *
 * The scroll trigger sits on the heading itself (never on the clipped, shifted
 * words), and a lightweight position check backs it up so a heading can never
 * stay hidden if the observer misses it.
 */
export default function SectionHeading({
  title,
  description,
  action,
  className = '',
  tone = 'light',
  level = 2,
  size = 'lg',
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLHeadingElement>(null);
  const [revealed, setRevealed] = useState(false);
  const words = title.split(' ');
  const dark = tone === 'dark';
  const sizeClass = size === 'md' ? 'text-[clamp(2.25rem,5.5vw,4.75rem)]' : 'text-[clamp(2.75rem,8vw,6.5rem)]';
  const headingClass = `font-display ${sizeClass} font-extrabold leading-[1] tracking-[-0.03em] ${
    dark ? 'text-ink' : 'text-bone'
  }`;

  // Safety net: reveal as soon as the heading is on screen, observer or not
  useEffect(() => {
    if (reduce || revealed) return;
    const check = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) setRevealed(true);
    };
    const t = window.setTimeout(check, 1200);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [reduce, revealed]);

  const motionProps = reduce
    ? {}
    : {
        initial: 'hidden',
        whileInView: 'visible',
        animate: revealed ? 'visible' : undefined,
        viewport: { once: true, amount: 0.2 },
      };

  const content = words.map((word, i) => (
    <span key={i} className="mr-[0.25em] inline-block overflow-hidden pb-[0.16em] align-bottom">
      <motion.span className="inline-block" {...(reduce ? {} : { variants: wordVariants, custom: i })}>
        {word}
      </motion.span>
    </span>
  ));

  return (
    <div className={`mb-10 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-4xl">
        {level === 1 ? (
          <motion.h1 ref={ref} className={headingClass} {...motionProps}>
            {content}
          </motion.h1>
        ) : (
          <motion.h2 ref={ref} className={headingClass} {...motionProps}>
            {content}
          </motion.h2>
        )}
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
