'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const processSteps = [
  {
    id: 1,
    title: 'Smart Application',
    icon: '📝',
    description: 'Start your loan journey with our AI-powered chat interface. Simply answer a few questions about yourself.',
    color: 'from-red-600 to-red-500',
    details: ['Personal Details', 'Employment Info', 'Income Details', 'Loan Amount']
  },
  {
    id: 2,
    title: 'Document Upload',
    icon: '📄',
    description: 'Securely upload your KYC documents. Our system accepts all standard formats.',
    color: 'from-orange-600 to-orange-500',
    details: ['Aadhaar Card', 'PAN Card', 'Selfie Photo', 'Bank Statement']
  },
  {
    id: 3,
    title: 'AI Extraction',
    icon: '🔍',
    description: 'Our advanced AI extracts and validates all information from your documents automatically.',
    color: 'from-amber-600 to-amber-500',
    details: ['OCR Processing', 'Data Validation', 'Cross-verification', 'Fraud Detection']
  },
  {
    id: 4,
    title: 'Risk Analysis',
    icon: '📊',
    description: 'Automated risk scoring engine evaluates your profile using multiple factors.',
    color: 'from-yellow-600 to-yellow-500',
    details: ['Credit Analysis', 'Debt-to-Income', 'Employment Check', 'Behavior Score']
  },
  {
    id: 5,
    title: 'AI Decision',
    icon: '🤖',
    description: 'Get instant loan decision powered by AI. No waiting, no uncertainty.',
    color: 'from-lime-600 to-lime-500',
    details: ['Instant Approval', 'Best Rates', 'Clear Terms', 'Full Transparency']
  },
  {
    id: 6,
    title: 'Disbursement',
    icon: '💰',
    description: 'Funds transferred directly to your bank account within 24-48 hours.',
    color: 'from-green-600 to-green-500',
    details: ['Quick Transfer', 'No Hidden Fees', 'Flexible EMI', 'Digital Agreement']
  }
];

const speedOptions = [
  { label: '0.5x', value: 6000 },
  { label: '1x', value: 3000 },
  { label: '2x', value: 1500 },
  { label: '3x', value: 1000 }
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(3000);
  const [dataFlowActive, setDataFlowActive] = useState(true);

  // Auto-advance animation
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % processSteps.length);
    }, speed);
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  // Data flow animation toggle
  useEffect(() => {
    const interval = setInterval(() => {
      setDataFlowActive(prev => !prev);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleRestart = () => {
    setActiveStep(0);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <motion.div 
          className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-block text-6xl mb-4"
          >
            🎭
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
              How It Works
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto">
            From application to disbursement in 6 simple steps
          </p>
        </motion.div>

        {/* Control Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-center items-center gap-4 mb-10"
        >
          {/* Restart Button */}
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white hover:border-red-500/50 hover:bg-gray-800 transition-all"
          >
            <span>⟲</span>
            <span>Restart</span>
          </button>

          {/* Play/Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isPlaying 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-red-500/50'
            }`}
          >
            <span>{isPlaying ? '⏸' : '▶'}</span>
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          {/* Speed Control */}
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-1">
            <span className="text-gray-400 text-sm">Speed:</span>
            {speedOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => setSpeed(opt.value)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  speed === opt.value 
                    ? 'bg-gradient-to-r from-red-600 to-yellow-600 text-white' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Animation - Horizontal Flow */}
        <div className="mb-12">
          {/* Desktop: Horizontal Steps */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Connection Line */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-gray-800 rounded-full mx-16" />
              <motion.div 
                className="absolute top-12 left-16 h-1 bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"
                style={{ width: `${(activeStep / (processSteps.length - 1)) * (100 - 8)}%` }}
                transition={{ duration: 0.5 }}
              />

              {/* Data Flow Animation */}
              <div className="absolute top-11 left-16 right-16 overflow-hidden h-3 pointer-events-none">
                {dataFlowActive && (
                  <motion.div
                    className="absolute w-8 h-3 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full opacity-60"
                    initial={{ left: '-10%' }}
                    animate={{ left: `${(activeStep / (processSteps.length - 1)) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                )}
              </div>

              {/* Steps */}
              <div className="flex justify-between relative">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => { setActiveStep(index); setIsPlaying(false); }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <motion.div
                      className={`w-24 h-24 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                        index <= activeStep 
                          ? `bg-gradient-to-br ${step.color} shadow-lg` 
                          : 'bg-gray-800/80 border border-gray-700'
                      }`}
                      animate={index === activeStep ? {
                        scale: [1, 1.05, 1],
                        boxShadow: ['0 0 0 0 rgba(220, 38, 38, 0.4)', '0 0 30px 10px rgba(220, 38, 38, 0.2)', '0 0 0 0 rgba(220, 38, 38, 0.4)']
                      } : {}}
                      transition={{ duration: 1.5, repeat: index === activeStep ? Infinity : 0 }}
                    >
                      <span className="text-3xl mb-1">{step.icon}</span>
                      <span className={`text-xs font-bold ${index <= activeStep ? 'text-white' : 'text-gray-400'}`}>
                        Step {step.id}
                      </span>
                    </motion.div>
                    <div className={`mt-3 text-sm font-medium text-center max-w-[100px] ${
                      index === activeStep ? 'text-yellow-400' : index < activeStep ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile: Vertical Steps */}
          <div className="lg:hidden">
            <div className="relative pl-8">
              {/* Vertical Line */}
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-800 rounded-full" />
              <motion.div 
                className="absolute left-4 top-0 w-1 bg-gradient-to-b from-red-500 to-yellow-500 rounded-full"
                style={{ height: `${((activeStep + 1) / processSteps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />

              {/* Steps */}
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className="flex items-start gap-4 cursor-pointer"
                    onClick={() => { setActiveStep(index); setIsPlaying(false); }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center -ml-6 z-10 ${
                        index <= activeStep 
                          ? `bg-gradient-to-br ${step.color}` 
                          : 'bg-gray-800 border border-gray-700'
                      }`}
                      animate={index === activeStep ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1, repeat: index === activeStep ? Infinity : 0 }}
                    >
                      <span className="text-xl">{step.icon}</span>
                    </motion.div>
                    <div className={`flex-1 pb-4 ${index === activeStep ? '' : 'opacity-60'}`}>
                      <div className={`font-bold ${index === activeStep ? 'text-yellow-400' : 'text-white'}`}>
                        {step.title}
                      </div>
                      {index === activeStep && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-gray-400 text-sm mt-1"
                        >
                          {step.description}
                        </motion.p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Active Step Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="max-w-3xl mx-auto mb-16"
          >
            <div className="relative">
              <div className={`absolute inset-0 bg-gradient-to-br ${processSteps[activeStep].color} rounded-3xl blur-2xl opacity-20`} />
              <div className="relative bg-black/70 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Left - Icon and Title */}
                  <div className="flex-shrink-0">
                    <motion.div 
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${processSteps[activeStep].color} flex items-center justify-center`}
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-4xl">{processSteps[activeStep].icon}</span>
                    </motion.div>
                  </div>

                  {/* Right - Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-red-400 text-sm font-medium">
                        Step {processSteps[activeStep].id} of {processSteps.length}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      {processSteps[activeStep].title}
                    </h3>
                    <p className="text-gray-400 mb-5">{processSteps[activeStep].description}</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {processSteps[activeStep].details.map((detail, i) => (
                        <motion.div
                          key={detail}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <span className="text-green-400">✓</span>
                          <span className="text-gray-300 text-sm">{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(((activeStep + 1) / processSteps.length) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-red-500 to-yellow-500 rounded-full"
                      style={{ width: `${((activeStep + 1) / processSteps.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Step Navigation Dots */}
        <div className="flex justify-center gap-2 mb-16">
          {processSteps.map((_, index) => (
            <button
              key={index}
              onClick={() => { setActiveStep(index); setIsPlaying(false); }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === activeStep 
                  ? 'bg-gradient-to-r from-red-500 to-yellow-500 w-8' 
                  : index < activeStep 
                    ? 'bg-red-500/50' 
                    : 'bg-gray-700'
              }`}
            />
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
        >
          {[
            { value: '2 Min', label: 'Decision Time', icon: '⚡' },
            { value: '99%', label: 'AI Accuracy', icon: '🎯' },
            { value: '50K+', label: 'Customers', icon: '👥' },
            { value: '24/7', label: 'Available', icon: '🤖' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-black/40 border border-gray-800 rounded-xl p-5 text-center"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                {stat.value}
              </div>
              <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            Ready to Begin?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/smart-intake"
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all inline-flex items-center justify-center gap-2"
            >
              🎭 Apply Now
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-black/50 border border-red-500/50 text-white rounded-xl font-bold text-lg hover:bg-red-600/20 transition-all inline-flex items-center justify-center gap-2"
            >
              📞 Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
