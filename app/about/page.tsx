'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import MoneyHeistBackground from '@/components/MoneyHeistBackground';

const teamMembers = [
  { name: 'The Professor', role: 'AI Decision Engine', icon: '🎭', desc: 'Mastermind behind every loan decision' },
  { name: 'Tokyo', role: 'Document Scanner', icon: '📄', desc: 'Fast and accurate document processing' },
  { name: 'Berlin', role: 'Risk Analyzer', icon: '📊', desc: 'Strategic risk assessment' },
  { name: 'Nairobi', role: 'Support Agent', icon: '💬', desc: 'Customer care and guidance' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <MoneyHeistBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <span className="text-7xl">🎭</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-500 bg-clip-text text-transparent">
              About Us
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Welcome to the most sophisticated loan heist in history - where AI meets financial freedom
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="relative">
              <motion.div
                className="absolute -inset-4 bg-gradient-to-r from-red-600/20 to-amber-600/20 blur-3xl"
                animate={{ opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-red-900/30">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl">🎯</span> Our Mission
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  We believe everyone deserves <span className="text-red-400 font-semibold">quick and fair access</span> to loans. 
                  Traditional banks are slow, confusing, and often unfair.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  That's why we built <span className="text-amber-400 font-semibold">La Casa de Loans</span> — 
                  an AI-powered system that makes loan decisions in minutes, not weeks. 
                  No hidden rules, no bias, just smart and transparent decisions.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { icon: '🚀', title: 'Lightning Fast', desc: 'Get decisions in under 5 minutes', color: 'from-yellow-500 to-orange-500' },
                { icon: '🤖', title: 'AI-Powered', desc: 'Smart algorithms, fair decisions', color: 'from-cyan-500 to-blue-500' },
                { icon: '🔍', title: 'Fully Transparent', desc: 'Every decision explained clearly', color: 'from-green-500 to-emerald-500' },
                { icon: '🛡️', title: 'Bank-Level Security', desc: 'Your data is 100% protected', color: 'from-purple-500 to-pink-500' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10, scale: 1.02 }}
                  className="p-4 bg-black/30 backdrop-blur-xl rounded-xl border border-white/10 hover:border-red-500/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-lg`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-white font-bold group-hover:text-red-400 transition-colors">{item.title}</h3>
                      <p className="text-gray-500 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* The Crew Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Meet <span className="text-red-500">The Crew</span>
            </h2>
            <p className="text-gray-400">Our AI agents work together like a well-planned heist</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative p-6 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-red-500/50 transition-all text-center h-full">
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-4xl shadow-lg shadow-red-500/30"
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                  >
                    {member.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-1">{member.name}</h3>
                  <p className="text-red-400 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-500 text-sm">{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="relative p-8 md:p-12 bg-gradient-to-r from-red-900/30 via-black/50 to-red-900/30 rounded-3xl border border-red-900/30 overflow-hidden">
            <motion.div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
            
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">
                  🤖 Our <span className="text-amber-400">Technology</span>
                </h2>
                <p className="text-gray-400">Powered by cutting-edge AI</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: '🧠', title: 'Google Gemini AI', desc: 'Advanced language understanding for smart conversations' },
                  { icon: '📄', title: 'AI Document OCR', desc: 'Instant reading and verification of all documents' },
                  { icon: '⚡', title: 'Real-time Processing', desc: 'Lightning-fast decisions with no delays' },
                ].map((tech, i) => (
                  <motion.div
                    key={tech.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-6 bg-black/30 rounded-xl"
                  >
                    <div className="text-5xl mb-4">{tech.icon}</div>
                    <h3 className="text-lg font-bold text-white mb-2">{tech.title}</h3>
                    <p className="text-gray-500 text-sm">{tech.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Join the <span className="text-red-500">Heist</span>?
          </h2>
          <Link href="/apply-loan">
            <motion.button
              className="px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-xl rounded-xl shadow-lg shadow-red-500/30"
              whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(220, 38, 38, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              Apply for Loan Now 🎭
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
