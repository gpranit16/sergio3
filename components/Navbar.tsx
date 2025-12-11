'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Apply', href: '/apply-loan', icon: '📝' },
    { name: 'About', href: '/about', icon: 'ℹ️' },
    { name: 'How It Works', href: '/how-it-works', icon: '⚙️' },
    { name: 'Contact', href: '/contact', icon: '📞' },
    { name: 'Support', href: '/support', icon: '💝' },
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-black/80 backdrop-blur-xl border-b border-red-900/30 shadow-lg shadow-red-900/10' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => router.push('/')}
              whileHover={{ scale: 1.02 }}
            >
              {/* Animated Logo */}
              <motion.div
                className="relative w-10 h-10"
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <span className="text-xl">🎭</span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-red-400/50"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              
              <div className="hidden sm:block">
                <span className="text-lg font-bold bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                  La Casa de Loans
                </span>
                <div className="text-[10px] text-red-400/70 -mt-1">AI Lending Platform</div>
              </div>
            </motion.div>

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    pathname === item.href
                      ? 'text-red-400'
                      : item.name === 'Support'
                        ? 'text-amber-400 hover:text-amber-300'
                        : 'text-gray-300 hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Active indicator */}
                  {pathname === item.href && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-red-500/20 rounded-lg border border-red-500/30"
                      transition={{ type: 'spring', bounce: 0.3, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Hover glow for Support */}
                  {item.name === 'Support' && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg opacity-0 hover:opacity-100"
                      whileHover={{ opacity: 1 }}
                    />
                  )}
                  
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{item.icon}</span>
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden relative w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-xl text-red-400">
                  {mobileMenuOpen ? '✕' : '☰'}
                </span>
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-red-900/30 bg-black/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                      pathname === item.href
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                    {pathname === item.href && (
                      <motion.div
                        className="ml-auto w-2 h-2 rounded-full bg-red-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                ))}
                
                {/* Mobile CTA */}
                <motion.button
                  onClick={() => handleNavClick('/apply-loan')}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl"
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  🎭 Apply for Loan Now
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Top accent line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent z-50" />
    </>
  );
}
