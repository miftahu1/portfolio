'use client';

import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <motion.div
      className="fixed inset-0 glass-strong z-[9999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-20 h-20">
        <motion.div
          className="absolute inset-0 border-4 border-white/20 border-t-accent rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 1,
          }}
        />
        <motion.div
          className="absolute inset-0 opacity-60"
          style={{ inset: '8px' }}
          animate={{ rotate: -360 }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 1.5,
          }}
        >
          <div className="w-full h-full border-4 border-white/10 border-b-accent rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}
