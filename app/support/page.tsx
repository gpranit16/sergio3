'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Sponsor {
  id: number;
  name: string;
  logo: string;
  description: string;
  tagline: string;
  color: string;
  link: string;
}

interface Collaborator {
  name: string;
  role: string;
  avatar: string;
  github?: string;
  linkedin?: string;
}

export default function SupportPage() {
  const [closedAds, setClosedAds] = useState<number[]>([]);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);

  const sponsors: Sponsor[] = [
    {
      id: 1,
      name: 'TechBangalore',
      logo: '🏢',
      description: 'Leading tech hub providing co-working spaces for fintech startups in Bengaluru. Offering state-of-the-art facilities in Koramangala and Electronic City.',
      tagline: 'Where Innovation Meets Finance',
      color: 'from-blue-600 to-cyan-600',
      link: '#'
    },
    {
      id: 2,
      name: 'Karnataka Bank Digital',
      logo: '🏦',
      description: 'Digital banking partner enabling seamless loan disbursements across Karnataka. Fast, secure, and reliable banking infrastructure.',
      tagline: 'Banking Made Digital',
      color: 'from-green-600 to-emerald-600',
      link: '#'
    },
    {
      id: 3,
      name: 'Namma Bengaluru Finance',
      logo: '💰',
      description: 'Local microfinance initiative supporting small businesses in Bengaluru. Empowering local entrepreneurs with accessible credit.',
      tagline: 'Empowering Local Dreams',
      color: 'from-yellow-600 to-orange-600',
      link: '#'
    },
    {
      id: 4,
      name: 'Silicon Valley Connect',
      logo: '🚀',
      description: 'Bridging Bengaluru startups with global investors. Providing mentorship and funding opportunities for fintech innovations.',
      tagline: 'From Garden City to Global',
      color: 'from-purple-600 to-pink-600',
      link: '#'
    }
  ];

  const collaborators: Collaborator[] = [
    {
      name: 'Pranit Gupta',
      role: 'Lead Developer & Founder',
      avatar: '👨‍💻',
      github: 'https://github.com/pranitgupta',
      linkedin: 'https://linkedin.com/in/pranitgupta'
    },
    {
      name: 'El Profesor AI',
      role: 'AI Decision Engine',
      avatar: '🤖',
    },
    {
      name: 'BMS Tech Team',
      role: 'Technical Advisors',
      avatar: '👥',
    }
  ];

  const closeAd = (id: number) => {
    setClosedAds([...closedAds, id]);
  };

  const visibleSponsors = sponsors.filter(s => !closedAds.includes(s.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden pt-24 pb-16">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(220,38,38,0.03)_2px,rgba(220,38,38,0.03)_4px)]" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-3xl" />
        
        {/* Floating Elements */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-10"
            initial={{ x: `${Math.random() * 100}%`, y: -50 }}
            animate={{ y: '120vh' }}
            transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, delay: i * 2.5, ease: 'linear' }}
          >
            {['🎭', '💰', '❤️', '🙏', '🤝', '💎', '🏆', '⭐'][i]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="inline-block text-6xl mb-4"
          >
            💝
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="text-white">Support </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
              La Resistencia
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Meet our sponsors, collaborators, and the amazing community that makes La Casa de Loans possible.
          </p>
        </motion.div>

        {/* Sponsored Ads Section */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <span className="text-yellow-500">📢</span> Our Sponsors
            <span className="text-sm text-gray-500 font-normal">(Bengaluru Based)</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {visibleSponsors.map((sponsor, index) => (
                <motion.div
                  key={sponsor.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: -100 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => closeAd(sponsor.id)}
                    className="absolute -top-2 -right-2 z-20 w-8 h-8 bg-gray-900 border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all opacity-0 group-hover:opacity-100"
                  >
                    ✕
                  </button>

                  {/* Ad Card */}
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => setSelectedSponsor(sponsor)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${sponsor.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                    <div className="relative bg-black/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300">
                      {/* Sponsored Tag */}
                      <div className="absolute top-3 right-3 text-[10px] text-gray-500 px-2 py-1 bg-gray-800/50 rounded">
                        SPONSORED
                      </div>

                      <div className="text-5xl mb-4">{sponsor.logo}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{sponsor.name}</h3>
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{sponsor.description}</p>
                      <p className="text-yellow-400 text-sm font-medium italic">"{sponsor.tagline}"</p>
                      
                      <motion.div
                        className="mt-4 text-red-400 text-sm flex items-center gap-2"
                        whileHover={{ x: 5 }}
                      >
                        Learn More →
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {visibleSponsors.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-black/30 rounded-2xl border border-gray-800"
            >
              <p className="text-gray-500 text-lg">All sponsor ads closed</p>
              <button
                onClick={() => setClosedAds([])}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 transition-colors"
              >
                Show All Sponsors
              </button>
            </motion.div>
          )}
        </section>

        {/* Sponsor Detail Modal */}
        <AnimatePresence>
          {selectedSponsor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedSponsor(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-black/90 border border-gray-800 rounded-2xl p-8 max-w-lg w-full"
              >
                <button
                  onClick={() => setSelectedSponsor(null)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                  ✕
                </button>
                <div className="text-6xl mb-4 text-center">{selectedSponsor.logo}</div>
                <h3 className="text-2xl font-bold text-white text-center mb-2">{selectedSponsor.name}</h3>
                <p className="text-yellow-400 text-center mb-4 italic">"{selectedSponsor.tagline}"</p>
                <p className="text-gray-400 mb-6">{selectedSponsor.description}</p>
                <div className="flex gap-4 justify-center">
                  <a
                    href={selectedSponsor.link}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity"
                  >
                    Visit Website
                  </a>
                  <button
                    onClick={() => setSelectedSponsor(null)}
                    className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collaborators Section */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <span className="text-red-500">🤝</span> Collaborators & Team
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collaborators.map((collab, index) => (
              <motion.div
                key={collab.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-yellow-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-black/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 text-center hover:border-red-500/50 transition-all duration-300">
                  <div className="text-5xl mb-4">{collab.avatar}</div>
                  <h3 className="text-lg font-bold text-white mb-1">{collab.name}</h3>
                  <p className="text-sm text-yellow-400 mb-4">{collab.role}</p>
                  
                  {(collab.github || collab.linkedin) && (
                    <div className="flex justify-center gap-3">
                      {collab.github && (
                        <a href={collab.github} target="_blank" className="text-gray-400 hover:text-white transition-colors">
                          GitHub
                        </a>
                      )}
                      {collab.linkedin && (
                        <a href={collab.linkedin} target="_blank" className="text-gray-400 hover:text-white transition-colors">
                          LinkedIn
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Support Ways Section */}
        <section className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-white mb-6 flex items-center gap-3"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            <span className="text-green-500">💚</span> Ways to Support Us
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '⭐',
                title: 'Star on GitHub',
                description: 'Show your support by starring our repository. It helps us reach more developers.',
                action: 'Star Now',
                color: 'from-yellow-600 to-orange-600'
              },
              {
                icon: '🐛',
                title: 'Report Issues',
                description: 'Found a bug? Help us improve by reporting issues and suggesting features.',
                action: 'Report Issue',
                color: 'from-red-600 to-pink-600'
              },
              {
                icon: '📢',
                title: 'Spread the Word',
                description: 'Share La Casa de Loans with your network. Help us reach more users.',
                action: 'Share Now',
                color: 'from-blue-600 to-cyan-600'
              }
            ].map((way, index) => (
              <motion.div
                key={way.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${way.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                <div className="relative bg-black/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300 h-full flex flex-col">
                  <div className="text-4xl mb-4">{way.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{way.title}</h3>
                  <p className="text-sm text-gray-400 mb-4 flex-grow">{way.description}</p>
                  <button className="w-full py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg font-bold hover:opacity-90 transition-opacity">
                    {way.action}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact for Sponsorship */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-yellow-600/20 rounded-3xl blur-xl" />
          <div className="relative bg-black/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              Become a Sponsor
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-6">
              Want to reach thousands of potential customers in the fintech space? 
              Partner with La Casa de Loans and showcase your brand to our growing community in Bengaluru and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:guptapranit34@gmail.com?subject=Sponsorship Inquiry - La Casa de Loans"
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                📧 Contact for Sponsorship
              </a>
              <Link
                href="/contact"
                className="px-8 py-4 bg-gray-800 text-white rounded-xl font-bold hover:bg-gray-700 transition-colors inline-flex items-center justify-center gap-2"
              >
                💬 General Inquiries
              </Link>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              📍 Based in BMS Institute of Technology, Bengaluru, Karnataka, India
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
