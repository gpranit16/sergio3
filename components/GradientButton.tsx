'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GradientButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export default function GradientButton({
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  fullWidth = false,
}: GradientButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-neon-purple to-neon-blue hover:from-neon-blue hover:to-neon-purple',
    secondary: 'bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-700',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        text-white font-semibold py-3 px-8 rounded-xl
        shadow-lg hover:shadow-neon-purple
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        relative overflow-hidden
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      <motion.span
        className="absolute inset-0 bg-white"
        initial={{ x: '-100%', opacity: 0 }}
        whileHover={{ x: '100%', opacity: 0.2 }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
