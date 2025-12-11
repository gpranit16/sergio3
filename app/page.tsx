'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import MoneyHeistBackground from '@/components/MoneyHeistBackground';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

// Glowing Logo Component with Click Animation
const GlowingLogo = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 1500);
  };

  return (
    <motion.div
      className="relative cursor-pointer"
      initial={{ scale: 0, rotate: -720, x: -500, y: -300 }}
      animate={{ scale: 1, rotate: 0, x: 0, y: 0 }}
      transition={{ 
        type: 'spring', 
        duration: 2, 
        bounce: 0.6,
        delay: 0.2 
      }}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
    >
      {/* Outer glow rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 60%, ${i === 0 ? '#dc2626' : i === 1 ? '#fbbf24' : '#06b6d4'}20 100%)`,
            transform: `scale(${1.5 + i * 0.3})`,
          }}
          animate={{
            scale: [1.5 + i * 0.3, 1.7 + i * 0.3, 1.5 + i * 0.3],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 360],
          }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3, ease: "linear" }}
        />
      ))}
      
      {/* Main logo */}
      <motion.div
        className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-red-600 via-red-700 to-red-900 flex items-center justify-center shadow-2xl"
        style={{ boxShadow: '0 0 60px rgba(220, 38, 38, 0.5)' }}
        animate={isAnimating ? {
          scale: [1, 1.3, 0.8, 1.2, 1],
          rotate: [0, 180, 360, 540, 720],
          boxShadow: [
            '0 0 60px rgba(220, 38, 38, 0.5)',
            '0 0 200px rgba(220, 38, 38, 1)',
            '0 0 100px rgba(251, 191, 36, 1)',
            '0 0 200px rgba(220, 38, 38, 1)',
            '0 0 60px rgba(220, 38, 38, 0.5)',
          ]
        } : { 
          rotate: [0, 360],
          boxShadow: [
            '0 0 60px rgba(220, 38, 38, 0.5)',
            '0 0 100px rgba(220, 38, 38, 0.8)',
            '0 0 60px rgba(220, 38, 38, 0.5)',
          ]
        }}
        transition={isAnimating ? { 
          duration: 1.5, 
          ease: 'easeInOut' 
        } : { 
          duration: 8, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Inner ring */}
        <motion.div 
          className="absolute inset-2 rounded-full border-2 border-red-400/30"
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute inset-4 rounded-full border border-red-400/20"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Icon */}
        <motion.span 
          className="text-6xl md:text-7xl"
          animate={isAnimating ? { 
            rotate: [0, -30, 30, -30, 30, 0],
            scale: [1, 1.4, 0.8, 1.3, 1],
            y: [0, -10, 10, -5, 0]
          } : { 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1]
          }}
          transition={isAnimating ? { 
            duration: 1.2,
            ease: "easeInOut"
          } : { 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎭
        </motion.span>
      </motion.div>
      
      {/* Click hint */}
      <motion.div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Click for animation
      </motion.div>
    </motion.div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, delay, color }: {
  icon: string;
  title: string;
  description: string;
  delay: number;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -10, scale: 1.02 }}
    className="group relative"
  >
    <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl`} />
    <div className="relative p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-red-500/50 transition-all duration-300 h-full">
      <motion.div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl mb-4 shadow-lg`}
        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  </motion.div>
);

export default function HomePage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const features = [
    { icon: '⚡', title: 'Lightning Fast', description: 'Get your loan decision in under 5 minutes with our AI-powered system', color: 'from-yellow-500 to-orange-500' },
    { icon: '🤖', title: 'AI-Powered', description: 'Smart algorithms analyze your application with precision and fairness', color: 'from-cyan-500 to-blue-500' },
    { icon: '🔒', title: 'Bank-Level Security', description: 'Your data is encrypted and protected with military-grade security', color: 'from-green-500 to-emerald-500' },
    { icon: '📊', title: 'Transparent Scoring', description: 'Clear explanation of every decision - no hidden rules or bias', color: 'from-purple-500 to-pink-500' },
    { icon: '📱', title: '100% Digital', description: 'Apply from anywhere, anytime - no paperwork, no branch visits', color: 'from-red-500 to-rose-500' },
    { icon: '💬', title: 'AI Chat Support', description: 'El Profesor Bot guides you through the entire application process', color: 'from-amber-500 to-yellow-500' },
  ];

  const stats = [
    { value: 50000, suffix: '+', label: 'Applications Processed' },
    { value: 98, suffix: '%', label: 'Approval Rate' },
    { value: 5, suffix: ' min', label: 'Average Decision Time' },
    { value: 4.9, suffix: '/5', label: 'Customer Rating' },
  ];

  return (
    <main className="min-h-screen relative overflow-hidden">
      <MoneyHeistBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <GlowingLogo />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-6xl md:text-8xl font-bold text-center mb-4 leading-tight"
        >
          <span className="block bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent">
            La Casa
          </span>
          <span className="block bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
            de Loans
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl md:text-2xl text-gray-300 text-center max-w-3xl mb-3"
        >
          AI-Powered Lending Platform
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-base md:text-lg text-gray-400 text-center max-w-2xl mb-12 italic"
        >
          "Every great heist needs a perfect plan. Let us plan your financial future."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link href="/apply-loan">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-lg font-bold rounded-xl shadow-2xl shadow-red-500/50 hover:shadow-red-500/70 transition-all flex items-center gap-2"
            >
              🔥 Apply for Loan →
            </motion.button>
          </Link>
          <Link href="/smart-intake">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-black/60 backdrop-blur-md border border-white/20 text-white text-lg font-semibold rounded-xl hover:bg-black/80 hover:border-white/40 transition-all flex items-center gap-2"
            >
              💬 Chat with AI Agent
            </motion.button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8"
        >
          <div className="text-gray-400 text-sm">Scroll to explore</div>
          <div className="text-2xl text-center">↓</div>
        </motion.div>
      </section>
      
      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10"
              >
                <div className="text-3xl md:text-4xl font-bold text-red-400 mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose <span className="text-red-500">Us?</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience the future of lending with our cutting-edge AI technology
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explore <span className="text-amber-400">More</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'About Us', href: '/about', icon: 'ℹ️', desc: 'Learn about our mission', gradient: 'from-blue-500 to-cyan-500' },
              { name: 'How It Works', href: '/how-it-works', icon: '⚙️', desc: 'See our AI process', gradient: 'from-purple-500 to-pink-500' },
              { name: 'Contact Us', href: '/contact', icon: '📞', desc: 'Get in touch', gradient: 'from-green-500 to-emerald-500' },
            ].map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={link.href}>
                  <motion.div
                    className="group p-8 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-red-500/50 transition-all cursor-pointer h-full relative overflow-hidden"
                    whileHover={{ y: -10 }}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                    />
                    <div className="relative z-10">
                      <div className="text-5xl mb-4">{link.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors">{link.name}</h3>
                      <p className="text-gray-400">{link.desc}</p>
                      <div className="mt-4 text-red-400 font-medium flex items-center gap-2">
                        Learn more 
                        <motion.span
                          className="inline-block"
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-900/50 via-red-800/50 to-red-900/50" />
            <div className="absolute inset-0 backdrop-blur-xl" />
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23dc2626" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}
            />
            
            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div
                className="text-6xl mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                🎭
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Your <span className="text-amber-400">Heist</span>?
              </h2>
              <p className="text-gray-300 mb-8 text-lg max-w-lg mx-auto">
                Join thousands who got their loans approved. The Professor's plan never fails!
              </p>
              <motion.button
                onClick={() => router.push('/apply-loan')}
                className="px-12 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold text-xl rounded-xl shadow-lg shadow-amber-500/30"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(251, 191, 36, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                Apply Now - It's Free ⚡
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎭</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                La Casa de Loans
              </span>
            </div>
            
            <div className="flex gap-6">
              {['About', 'How It Works', 'Contact', 'Support', 'Dashboard'].map((item) => (
                <Link 
                  key={item} 
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
            <p>© 2025 La Casa de Loans. All rights reserved.</p>
            <p className="mt-2">Built with 🎭 by <span className="text-red-400">Pranit Kumar</span></p>
          </div>
        </div>
      </footer>
    </main>
  );
}
