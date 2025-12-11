'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      className={`
        relative backdrop-blur-md bg-glass-bg border border-glass-border
        rounded-2xl p-8 shadow-glass
        ${hover ? 'hover:border-neon-purple transition-all duration-300' : ''}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)' } : {}}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-purple/10 via-transparent to-neon-blue/10 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
