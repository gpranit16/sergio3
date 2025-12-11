'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const ADMIN_PIN = '123456';

interface Application {
  id: string;
  application_number: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  employment_type: string;
  monthly_income: number;
  loan_amount: number;
  risk_score: number;
  credit_score: number;
  decision: 'approved' | 'pending' | 'rejected' | 'under_review';
  status: string;
  workflow_stage: string;
  created_at: string;
}

type FilterType = 'all' | 'approved' | 'pending' | 'rejected' | 'under_review';
type StatusFilter = 'all' | 'submitted' | 'processing' | 'approved' | 'rejected' | 'disbursed';

export default function DashboardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // PIN Protection - requires PIN every time
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid PIN. Please try again.');
      setPinInput('');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    
    fetch('/api/applications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApplications(data.applications || []);
          setFilteredApplications(data.applications || []);
        } else {
          setError(data.error || 'Failed to fetch applications');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [isAuthenticated]);

  // Apply filters
  useEffect(() => {
    let filtered = [...applications];

    // Decision filter
    if (decisionFilter !== 'all') {
      filtered = filtered.filter((app) => app.decision === decisionFilter);
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Search filter - improved to handle null/undefined values
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((app) => {
        const nameMatch = app.name && app.name.toLowerCase().includes(query);
        const appNumMatch = app.application_number && app.application_number.toLowerCase().includes(query);
        const emailMatch = app.email && app.email.toLowerCase().includes(query);
        const phoneMatch = app.phone && app.phone.toLowerCase().includes(query);
        return nameMatch || appNumMatch || emailMatch || phoneMatch;
      });
    }

    setFilteredApplications(filtered);
  }, [decisionFilter, statusFilter, searchQuery, applications]);

  // PIN Entry Screen - Money Heist Theme
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden flex items-center justify-center py-12 px-4">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-yellow-600/20 rounded-3xl blur-xl" />
            <div className="relative bg-black/70 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
              <div className="text-center mb-8">
                <motion.div
                  className="text-7xl mb-4"
                  animate={{ rotateY: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  🎭
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                    Admin Access
                  </span>
                </h1>
                <p className="text-gray-400">Enter your security PIN to access the vault</p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-6">
                <div>
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value.replace(/\D/g, ''));
                      setPinError('');
                    }}
                    placeholder="● ● ● ● ● ●"
                    className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-600 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                    autoFocus
                  />
                  {pinError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-red-400 text-center text-sm"
                    >
                      {pinError}
                    </motion.p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={pinInput.length !== 6}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-bold rounded-xl relative overflow-hidden group disabled:opacity-50"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    🔓 Unlock Dashboard
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push('/')}
                  className="text-gray-400 hover:text-red-400 transition-colors text-sm"
                >
                  ← Back to Home
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case 'approved':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'under_review':
        return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'rejected':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const stats = {
    total: applications.length,
    approved: applications.filter((a) => a.decision === 'approved').length,
    pending: applications.filter((a) => a.decision === 'pending').length,
    under_review: applications.filter((a) => a.decision === 'under_review').length,
    rejected: applications.filter((a) => a.decision === 'rejected').length,
    processing: applications.filter((a) => a.status === 'processing').length,
    avgRiskScore: applications.length
      ? Math.round(applications.reduce((sum, a) => sum + (a.risk_score || 0), 0) / applications.length)
      : 0,
    totalLoanAmount: applications
      .filter((a) => a.decision === 'approved')
      .reduce((sum, a) => sum + a.loan_amount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 relative overflow-hidden py-12 px-4 pt-24">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-3xl" />
        
        {/* Floating Elements */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            initial={{ x: `${Math.random() * 100}%`, y: -50 }}
            animate={{ y: '120vh' }}
            transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, delay: i * 3, ease: 'linear' }}
          >
            {['🎭', '💰', '📊', '💎', '🏦'][i]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-gray-400">La Casa de Loans - Command Center</p>
        </motion.div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <StatCard label="Total" value={stats.total} icon="📋" color="from-red-500 to-yellow-500" />
          <StatCard label="Approved" value={stats.approved} icon="✅" color="from-green-500 to-emerald-500" />
          <StatCard label="Pending" value={stats.pending} icon="⏳" color="from-yellow-500 to-orange-500" />
          <StatCard label="Review" value={stats.under_review} icon="🔍" color="from-blue-500 to-cyan-500" />
          <StatCard label="Rejected" value={stats.rejected} icon="❌" color="from-red-500 to-pink-500" />
          <StatCard label="Processing" value={stats.processing} icon="⚙️" color="from-purple-500 to-indigo-500" />
          <StatCard label="Avg Risk" value={stats.avgRiskScore} icon="📊" color="from-orange-500 to-red-500" suffix="/100" />
          <StatCard label="Approved ₹" value={`${(stats.totalLoanAmount / 100000).toFixed(1)}L`} icon="💰" color="from-green-500 to-teal-500" isText />
        </div>

        {/* Filters and Search */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-yellow-600/10 rounded-2xl blur-xl" />
          <div className="relative bg-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <FilterButton active={decisionFilter === 'all'} onClick={() => setDecisionFilter('all')}>
                  All
                </FilterButton>
                <FilterButton active={decisionFilter === 'approved'} onClick={() => setDecisionFilter('approved')}>
                  ✅ Approved
                </FilterButton>
                <FilterButton active={decisionFilter === 'pending'} onClick={() => setDecisionFilter('pending')}>
                  ⏳ Pending
                </FilterButton>
                <FilterButton active={decisionFilter === 'under_review'} onClick={() => setDecisionFilter('under_review')}>
                  🔍 Review
                </FilterButton>
                <FilterButton active={decisionFilter === 'rejected'} onClick={() => setDecisionFilter('rejected')}>
                  ❌ Rejected
                </FilterButton>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search by name, email, or app number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 md:w-72 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30 transition-all"
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/apply-loan')}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-bold rounded-lg"
                >
                  + New
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-yellow-600/10 rounded-2xl blur-xl" />
          <div className="relative bg-black/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                Applications ({filteredApplications.length})
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  className="text-6xl inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                >
                  🎭
                </motion.div>
                <p className="text-gray-400 mt-4">Loading applications...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-400 text-lg mb-4">No applications found</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/apply-loan')}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white font-bold rounded-xl"
                >
                  Submit First Application
                </motion.button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">App #</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Age</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Employment</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Income</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Loan Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Risk</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Credit</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Decision</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Stage</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app, index) => (
                      <motion.tr
                        key={app.id}
                        className="border-b border-gray-800/50 hover:bg-red-500/5 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <td className="py-3 px-4 text-gray-300 font-mono text-sm">
                          {app.application_number || 'N/A'}
                        </td>
                        <td className="py-3 px-4 text-white font-medium">{app.name}</td>
                        <td className="py-3 px-4 text-gray-300">{app.age}</td>
                        <td className="py-3 px-4 text-gray-300 capitalize">
                          {app.employment_type?.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-gray-300">₹{app.monthly_income?.toLocaleString()}</td>
                        <td className="py-3 px-4 text-yellow-400 font-semibold">₹{app.loan_amount?.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span
                            className="font-semibold"
                            style={{
                              color: app.risk_score >= 70 ? '#22c55e' : app.risk_score >= 40 ? '#eab308' : '#ef4444',
                            }}
                          >
                            {app.risk_score || 'N/A'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{app.credit_score || 'N/A'}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDecisionColor(app.decision)}`}>
                            {app.decision?.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm capitalize">
                          {app.workflow_stage?.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-4 text-gray-300 text-sm">
                          {new Date(app.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => router.push(`/result?id=${app.id}`)}
                              className="text-yellow-400 hover:text-yellow-300 transition-colors text-sm"
                            >
                              View
                            </button>
                            <button
                              onClick={() => router.push(`/admin/view?id=${app.id}`)}
                              className="text-red-400 hover:text-red-300 transition-colors text-sm font-semibold"
                            >
                              Admin →
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-gray-900 border border-gray-700 text-white font-medium rounded-xl hover:border-red-500/50 transition-all"
          >
            ← Back to Home
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  suffix,
  isText,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  suffix?: string;
  isText?: boolean;
}) {
  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity`} />
      <div className="relative bg-black/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 text-center hover:border-red-500/30 transition-all">
        <div className="text-2xl mb-1">{icon}</div>
        <div className={`${isText ? 'text-xl' : 'text-3xl'} font-bold text-transparent bg-clip-text bg-gradient-to-r ${color} mb-1`}>
          {value}{suffix}
        </div>
        <div className="text-gray-500 text-xs uppercase tracking-wide">{label}</div>
      </div>
    </motion.div>
  );
}

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all ${
        active
          ? 'bg-gradient-to-r from-red-600 to-yellow-600 text-white'
          : 'bg-gray-900/50 text-gray-400 border border-gray-700 hover:border-red-500/50 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
