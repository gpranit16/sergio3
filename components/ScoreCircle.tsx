'use client';

import { motion } from 'framer-motion';

interface ScoreCircleProps {
  score: number;
  size?: number;
}

export default function ScoreCircle({ score, size = 200 }: ScoreCircleProps) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (score: number) => {
    if (score >= 70) return '#22c55e'; // green
    if (score >= 40) return '#eab308'; // yellow
    return '#ef4444'; // red
  };

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, type: 'spring' }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="10"
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 10px ${getColor(score)})`,
          }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl font-bold"
          style={{ color: getColor(score) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-gray-400 text-sm mt-1">Risk Score</span>
      </div>
    </motion.div>
  );
}
