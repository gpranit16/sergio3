'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    }, 5000);
  };

  const contactMethods = [
    {
      icon: '📞',
      title: 'Phone Support',
      value: '+91 1800-HEIST-00',
      subtext: '24/7 Available',
      color: 'from-red-600 to-red-800'
    },
    {
      icon: '📧',
      title: 'Email Us',
      value: 'guptapranit34@gmail.com',
      subtext: 'Response within 2 hours',
      color: 'from-yellow-600 to-yellow-800'
    },
    {
      icon: '📍',
      title: 'Headquarters',
      value: 'BMS Institute of Technology',
      subtext: 'Bengaluru, Karnataka, India',
      color: 'from-red-700 to-yellow-600'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      value: 'El Profesor AI Assistant',
      subtext: 'Instant Response',
      color: 'from-yellow-500 to-red-600'
    }
  ];

  const faqs = [
    {
      question: 'What documents do I need to apply?',
      answer: 'You need PAN card, Aadhaar card, bank statements (6 months), and salary slips or ITR for income verification.'
    },
    {
      question: 'How long does approval take?',
      answer: 'Our AI agents process applications in under 2 minutes. Disbursement happens within 24-48 hours of approval.'
    },
    {
      question: 'What is the interest rate?',
      answer: 'Interest rates start from 10.5% p.a. depending on your credit score and risk profile determined by our AI.'
    },
    {
      question: 'Can I prepay my loan?',
      answer: 'Yes! We offer flexible prepayment options with minimal foreclosure charges after 6 months.'
    }
  ];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating Dalí Masks */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`mask-${i}`}
            className="absolute text-4xl opacity-10"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: -100 
            }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1000,
              rotate: 360
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear'
            }}
          >
            🎭
          </motion.div>
        ))}

        {/* Red Scan Lines */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent"
          animate={{ y: ['-100%', '100%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-red-600/20 border border-red-500/30 rounded-full mb-8"
          >
            <span className="text-3xl">📞</span>
            <span className="text-red-400 font-medium">SECURE COMMUNICATION LINE</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <span className="text-white">Contact </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
              The Professor
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Ready to execute the perfect financial plan? Our team is standing by 
            to assist with your loan application journey.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="relative py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="relative bg-black/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 h-full hover:border-red-500/50 transition-all duration-300">
                  {/* Icon */}
                  <div className="text-5xl mb-4">{method.icon}</div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">{method.title}</h3>
                  <p className="text-yellow-400 font-medium mb-1">{method.value}</p>
                  <p className="text-sm text-gray-500">{method.subtext}</p>

                  {/* Corner Decoration */}
                  <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-red-500/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-yellow-600/20 rounded-3xl blur-xl" />
              <div className="relative bg-black/70 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📝</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      Send a Message
                    </h2>
                    <p className="text-gray-500 text-sm">We&apos;ll respond within 2 hours</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', damping: 10 }}
                        className="text-6xl mb-4"
                      >
                        ✅
                      </motion.div>
                      <h3 className="text-2xl font-bold text-green-400 mb-2">Message Sent!</h3>
                      <p className="text-gray-400">El Profesor will contact you soon.</p>
                    </motion.div>
                  ) : (
                    <motion.form
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                            placeholder="Your name..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                            placeholder="+91 XXXXX XXXXX"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Subject</label>
                        <select
                          required
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none"
                        >
                          <option value="">Select a topic...</option>
                          <option value="loan-inquiry">Loan Inquiry</option>
                          <option value="application-status">Application Status</option>
                          <option value="technical-support">Technical Support</option>
                          <option value="partnership">Partnership Opportunity</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Your Message</label>
                        <textarea
                          required
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all outline-none resize-none"
                          placeholder="Tell us about your inquiry..."
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-red-600 to-yellow-600 text-white font-bold py-4 rounded-xl relative overflow-hidden group disabled:opacity-70"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <motion.span
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              >
                                ⏳
                              </motion.span>
                              Sending...
                            </>
                          ) : (
                            <>
                              <span>🎭</span>
                              Send Message
                            </>
                          )}
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-600 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-2xl">❓</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Frequently Asked
                </h2>
                <p className="text-gray-500 text-sm">Quick answers to common questions</p>
              </div>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full text-left"
                  >
                    <div className={`bg-black/50 backdrop-blur-xl border rounded-xl p-5 transition-all duration-300 ${
                      openFaq === index 
                        ? 'border-red-500/50 shadow-lg shadow-red-500/10' 
                        : 'border-gray-800 hover:border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-white pr-4">{faq.question}</h3>
                        <motion.span
                          animate={{ rotate: openFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-red-500 text-xl"
                        >
                          ▼
                        </motion.span>
                      </div>
                      <AnimatePresence>
                        {openFaq === index && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-gray-400 mt-4 pt-4 border-t border-gray-800"
                          >
                            {faq.answer}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-yellow-600/20 rounded-3xl blur-xl" />
            <div className="relative bg-black/70 backdrop-blur-xl border border-gray-800 rounded-3xl overflow-hidden">
              {/* Fake Map with Heist Style */}
              <div className="h-80 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
                {/* Grid Lines */}
                <div className="absolute inset-0" style={{
                  backgroundImage: 'linear-gradient(rgba(255,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.1) 1px, transparent 1px)',
                  backgroundSize: '50px 50px'
                }} />

                {/* Radar Sweep */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                  <div className="absolute top-0 left-1/2 w-1/2 h-1/2 bg-gradient-to-r from-red-500/30 to-transparent origin-bottom-left" 
                    style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }} 
                  />
                </motion.div>

                {/* Location Marker */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">🎭</span>
                    </div>
                    <motion.div
                      className="absolute inset-0 bg-red-500 rounded-full"
                      animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-red-500 rounded-full"
                      animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    />
                  </div>
                </motion.div>

                {/* HQ Label */}
                <div className="absolute top-1/2 left-1/2 translate-x-8 -translate-y-8">
                  <div className="bg-black/80 border border-red-500 px-4 py-2 rounded-lg">
                    <p className="text-red-500 font-bold text-sm" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                      LA CASA DE LOANS HQ
                    </p>
                    <p className="text-gray-400 text-xs">Mumbai, India</p>
                  </div>
                </div>

                {/* Corner Decorations */}
                <div className="absolute top-4 left-4 text-xs text-red-500/50 font-mono">
                  LAT: 19.0760° N
                </div>
                <div className="absolute top-4 right-4 text-xs text-red-500/50 font-mono">
                  LONG: 72.8777° E
                </div>
                <div className="absolute bottom-4 left-4 text-xs text-red-500/50 font-mono">
                  SECURE ZONE
                </div>
                <div className="absolute bottom-4 right-4 text-xs text-red-500/50 font-mono">
                  ENCRYPTED
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Ready to Start Your <span className="text-red-500">Heist</span>?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Join thousands who have successfully secured their financial future with La Casa de Loans.
            </p>
            <motion.a
              href="/smart-intake"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-bold px-8 py-4 rounded-full text-lg"
            >
              <span className="text-2xl">🎭</span>
              Talk to El Profesor
              <span className="text-xl">→</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Footer Space */}
      <div className="h-20" />
    </div>
  );
}
