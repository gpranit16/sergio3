'use client';

import { motion } from 'framer-motion';
import { ChangeEvent } from 'react';

interface FormFieldProps {
  label: string;
  type: 'text' | 'number' | 'select';
  name: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
}

export default function FormField({
  label,
  type,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  min,
  max,
  step,
  error,
}: FormFieldProps) {
  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label htmlFor={name} className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-neon-pink">*</span>}
      </label>
      
      {type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-white/5 border-2 ${error ? 'border-red-500' : 'border-glass-border'}
            text-white placeholder-gray-500
            focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/50
            transition-all duration-300
            backdrop-blur-sm
          `}
        >
          <option value="" disabled>Select {label}</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-gray-900">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-white/5 border-2 ${error ? 'border-red-500' : 'border-glass-border'}
            text-white placeholder-gray-500
            focus:border-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/50
            transition-all duration-300
            backdrop-blur-sm
            hover:border-neon-blue/50
          `}
        />
      )}
      
      {error && (
        <motion.p
          className="mt-2 text-sm text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
}
