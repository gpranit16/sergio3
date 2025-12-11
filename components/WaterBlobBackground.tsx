'use client';

import { motion } from 'framer-motion';

export default function WaterBlobBackground() {
  const blobs = [
    { size: 400, duration: 20, delay: 0, color: 'bg-neon-purple/20' },
    { size: 350, duration: 25, delay: 2, color: 'bg-neon-blue/20' },
    { size: 450, duration: 22, delay: 4, color: 'bg-neon-pink/15' },
    { size: 300, duration: 18, delay: 1, color: 'bg-purple-500/10' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {blobs.map((blob, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${blob.color} blur-3xl`}
          style={{
            width: blob.size,
            height: blob.size,
            left: `${(index * 25) % 100}%`,
            top: `${(index * 30) % 100}%`,
          }}
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -100, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            delay: blob.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-background/50 to-background" />
    </div>
  );
}
