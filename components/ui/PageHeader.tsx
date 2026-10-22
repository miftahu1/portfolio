'use client';

import { motion } from 'framer-motion';

type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <motion.header 
        className="py-16 md:py-24 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-gradient bg-gradient-primary bg-clip-text text-transparent">
                {title}
            </span>
        </h1>
        <p className="text-lg text-white/70">
            {description}
        </p>
      </div>
    </motion.header>
  );
}
