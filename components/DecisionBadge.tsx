'use client';

import { motion } from 'framer-motion';

interface DecisionBadgeProps {
  decision: 'approved' | 'pending' | 'rejected';
}

export default function DecisionBadge({ decision }: DecisionBadgeProps) {
  const styles = {
    approved: {
      bg: 'bg-green-500/20',
      border: 'border-green-500',
      text: 'text-green-400',
      shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
      icon: '✓',
    },
    pending: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500',
      text: 'text-yellow-400',
      shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
      icon: '⏱',
    },
    rejected: {
      bg: 'bg-red-500/20',
      border: 'border-red-500',
      text: 'text-red-400',
      shadow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
      icon: '✕',
    },
  };

  const style = styles[decision];

  return (
    <motion.div
      className={`
        inline-flex items-center gap-3 px-6 py-3 rounded-full
        ${style.bg} ${style.border} border-2 ${style.shadow}
      `}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <motion.span
        className={`text-2xl ${style.text}`}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5, repeat: 2 }}
      >
        {style.icon}
      </motion.span>
      <span className={`text-xl font-bold uppercase tracking-wide ${style.text}`}>
        {decision}
      </span>
    </motion.div>
  );
}
