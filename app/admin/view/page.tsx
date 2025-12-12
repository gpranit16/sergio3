'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface Document {
  id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  uploaded_at: string;
  verified: boolean;
  verification_details?: any;
  extracted_data?: any;
}

interface Application {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  loan_amount: number;
  loan_type: string;
  tenure_months: number;
  employment_type: string;
  monthly_income: number;
  existing_emi: number;
  credit_score: number;
  risk_score: number;
  decision: string;
  ai_explanation: string;
  workflow_stage: string;
  status: string;
  created_at: string;
  documents?: Document[];
  kyc_result?: any;
  fraud_indicators?: any;
  credit_analysis?: any;
}

interface AILog {
  id: string;
  agent_type: string;
  action: string;
  input_data: any;
  output_data: any;
  status: string;
  created_at: string;
}

export default function AdminViewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [application, setApplication] = useState<Application | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [aiLogs, setAILogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<Application>>({});
  const [saving, setSaving] = useState(false);
  const [overriding, setOverriding] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const ADMIN_PIN = '123456';

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid PIN');
      setPin('');
    }
  };

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchApplicationDetails();
    }
  }, [isAuthenticated, id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch application details
      const appRes = await fetch(`/api/admin/application?id=${id}`);
      const appData = await appRes.json();
      console.log('Application fetch response:', appData);
      if (appData.success && appData.application) {
        setApplication(appData.application);
        setEditedData(appData.application);
      } else if (appData.application) {
        // Handle legacy response format
        setApplication(appData.application);
        setEditedData(appData.application);
      } else {
        console.error('Failed to fetch application:', appData.error);
      }
      
      // Fetch documents
      const docsRes = await fetch(`/api/admin/documents?application_id=${id}`);
      const docsData = await docsRes.json();
      if (docsData.documents) {
        setDocuments(docsData.documents);
      }
      
      // Fetch AI logs
      const logsRes = await fetch(`/api/admin/logs?application_id=${id}`);
      const logsData = await logsRes.json();
      if (logsData.logs) {
        setAILogs(logsData.logs);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!application) return;
    
    setSaving(true);
    try {
      const res = await fetch('/api/admin/application', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: application.id,
          updates: editedData
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setApplication(data.application);
        setIsEditing(false);
        alert('Application updated successfully!');
      } else {
        alert('Failed to update application');
      }
    } catch (error) {
      console.error('Error updating:', error);
      alert('Error updating application');
    } finally {
      setSaving(false);
    }
  };

  const handleOverride = async (newDecision: string) => {
    if (!application) return;
    
    const reason = prompt(`Enter reason for ${newDecision} override:`);
    if (!reason) return;
    
    setOverriding(true);
    try {
      const res = await fetch('/api/admin/override', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: application.id,
          new_decision: newDecision,
          reason
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setApplication(data.application);
        alert(`Decision overridden to ${newDecision}`);
      } else {
        alert('Failed to override decision');
      }
    } catch (error) {
      console.error('Error overriding:', error);
      alert('Error overriding decision');
    } finally {
      setOverriding(false);
    }
  };

  const handleDelete = async () => {
    if (!application) return;
    
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/application?id=${application.id}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        alert('Application deleted successfully!');
        router.push('/dashboard');
      } else {
        alert('Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Error deleting application');
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  // PIN Screen with Money Heist Theme
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-red-600/10 text-6xl"
              initial={{ 
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                y: -100,
                rotate: 0
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 100,
                rotate: 360
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            >
              💰
            </motion.div>
          ))}
        </div>

        {/* Scan Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(220,38,38,0.03)_2px,rgba(220,38,38,0.03)_4px)]" />
        </div>
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-10"
        >
          {/* Dalí Mask Animation */}
          <motion.div
            className="text-8xl text-center mb-8"
            animate={{ 
              scale: [1, 1.1, 1],
              rotateY: [0, 10, -10, 0]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🎭
          </motion.div>

          <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-8 border-2 border-red-600/50 shadow-[0_0_50px_rgba(220,38,38,0.3)]">
            <h1 className="text-3xl font-bold text-center mb-2 font-['Orbitron'] text-red-500">
              RESTRICTED ACCESS
            </h1>
            <p className="text-yellow-500 text-center mb-6 font-['Orbitron'] text-sm tracking-widest">
              LA RESISTENCIA
            </p>
            
            <form onSubmit={handlePinSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-400 mb-2 text-sm">Enter Security Code</label>
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-black/50 border-2 border-red-600/50 rounded-lg text-white text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-red-500 focus:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(220,38,38,0.6)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white rounded-lg font-bold font-['Orbitron'] tracking-wider hover:from-red-600 hover:to-red-600 transition-all border border-red-500/50"
              >
                AUTHENTICATE
              </motion.button>
            </form>
            
            <p className="text-gray-500 text-center mt-4 text-xs">
              Authorized Personnel Only
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🎭
        </motion.div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl font-['Orbitron']">Application Not Found</p>
          <Link href="/dashboard" className="text-yellow-500 hover:text-yellow-400 mt-4 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Details', icon: '📋' },
    { id: 'documents', label: 'Documents', icon: '📁' },
    { id: 'kyc', label: 'KYC', icon: '🔍' },
    { id: 'logs', label: 'AI Logs', icon: '🤖' }
  ];

  const getDecisionColor = (decision: string) => {
    switch (decision?.toLowerCase()) {
      case 'approved': return 'text-green-400 bg-green-500/20 border-green-500/50';
      case 'rejected': return 'text-red-400 bg-red-500/20 border-red-500/50';
      default: return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 30) return 'text-green-400';
    if (score <= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Helper to get display name
  const getDisplayName = () => application?.name || 'Unknown';
  const getDecisionDisplay = () => application?.decision || application?.status || 'PENDING';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 relative">
      {/* Scan Lines Overlay */}
      <div className="fixed inset-0 pointer-events-none z-10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(220,38,38,0.02)_2px,rgba(220,38,38,0.02)_4px)]" />
      </div>

      <div className="relative z-20 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="text-red-500 hover:text-red-400 transition-colors font-['Orbitron'] text-sm"
            >
              ← BACK
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold font-['Orbitron'] text-white">
              <span className="text-red-500">CASE</span> #{application.id.slice(0, 8).toUpperCase()}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-4 py-2 rounded-lg border font-bold font-['Orbitron'] text-sm ${getDecisionColor(getDecisionDisplay())}`}>
              {getDecisionDisplay().toUpperCase()}
            </span>
            
            {/* Edit Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isEditing) {
                  setEditedData(application);
                }
                setIsEditing(!isEditing);
              }}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                isEditing 
                  ? 'bg-gray-600 text-white' 
                  : 'bg-yellow-600 hover:bg-yellow-500 text-black'
              }`}
            >
              {isEditing ? '✕ Cancel' : '✏️ Edit'}
            </motion.button>
            
            {isEditing && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold disabled:opacity-50"
              >
                {saving ? '⏳' : '💾'} Save
              </motion.button>
            )}
            
            {/* Delete Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold"
            >
              🗑️ Delete
            </motion.button>
          </div>
        </motion.div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-black/90 rounded-2xl p-8 border-2 border-red-600/50 max-w-md w-full mx-4"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">⚠️</div>
                  <h3 className="text-2xl font-bold text-red-500 font-['Orbitron'] mb-2">DELETE APPLICATION?</h3>
                  <p className="text-gray-400 mb-6">
                    This action cannot be undone. All data including documents will be permanently deleted.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold disabled:opacity-50 transition-colors"
                    >
                      {deleting ? 'Deleting...' : 'Delete Forever'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Viewer Modal */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-4xl max-h-[90vh] w-full"
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-12 right-0 text-white hover:text-red-500 text-2xl font-bold"
                >
                  ✕ Close
                </button>
                <img 
                  src={selectedImage} 
                  alt="Document Preview" 
                  className="w-full h-full object-contain rounded-lg border-2 border-red-600/50"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-700 to-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
                  : 'bg-black/40 text-gray-400 hover:text-white border border-red-600/30 hover:border-red-600/60'
              }`}
            >
              <span>{tab.icon}</span>
              <span className="font-['Orbitron'] text-sm">{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Details Tab */}
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 gap-6"
            >
              {/* Personal Information */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                <h3 className="text-lg font-bold text-red-500 font-['Orbitron'] mb-4 flex items-center gap-2">
                  <span>👤</span> PERSONAL INFO
                </h3>
                <div className="space-y-4">
                  <EditableField
                    label="Full Name"
                    value={editedData.name || ''}
                    isEditing={isEditing}
                    onChange={(v) => setEditedData({...editedData, name: v})}
                  />
                  <EditableField
                    label="Email"
                    value={editedData.email || ''}
                    isEditing={isEditing}
                    onChange={(v) => setEditedData({...editedData, email: v})}
                  />
                  <EditableField
                    label="Phone"
                    value={editedData.phone || ''}
                    isEditing={isEditing}
                    onChange={(v) => setEditedData({...editedData, phone: v})}
                  />
                </div>
              </div>

              {/* Loan Details */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                <h3 className="text-lg font-bold text-yellow-500 font-['Orbitron'] mb-4 flex items-center gap-2">
                  <span>💰</span> LOAN DETAILS
                </h3>
                <div className="space-y-4">
                  <EditableField
                    label="Loan Amount"
                    value={editedData.loan_amount?.toString() || ''}
                    isEditing={isEditing}
                    type="number"
                    onChange={(v) => setEditedData({...editedData, loan_amount: parseFloat(v)})}
                    prefix="₹"
                  />
                  <EditableField
                    label="Loan Type"
                    value={editedData.loan_type || ''}
                    isEditing={isEditing}
                    onChange={(v) => setEditedData({...editedData, loan_type: v})}
                  />
                  <EditableField
                    label="Employment Type"
                    value={editedData.employment_type || ''}
                    isEditing={isEditing}
                    onChange={(v) => setEditedData({...editedData, employment_type: v})}
                  />
                  <EditableField
                    label="Monthly Income"
                    value={editedData.monthly_income?.toString() || ''}
                    isEditing={isEditing}
                    type="number"
                    onChange={(v) => setEditedData({...editedData, monthly_income: parseFloat(v)})}
                    prefix="₹"
                  />
                </div>
              </div>

              {/* Scores */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                <h3 className="text-lg font-bold text-green-500 font-['Orbitron'] mb-4 flex items-center gap-2">
                  <span>📊</span> SCORES
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-black/30 rounded-xl border border-green-500/30">
                    <div className="text-4xl font-bold text-green-400 font-['Orbitron']">
                      {application.credit_score || 'N/A'}
                    </div>
                    <div className="text-gray-400 text-sm">Credit Score</div>
                  </div>
                  <div className="text-center p-4 bg-black/30 rounded-xl border border-red-500/30">
                    <div className={`text-4xl font-bold font-['Orbitron'] ${getRiskColor(application.risk_score || 0)}`}>
                      {application.risk_score || 0}
                    </div>
                    <div className="text-gray-400 text-sm">Risk Score</div>
                  </div>
                </div>
              </div>

              {/* Workflow Stage */}
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                <h3 className="text-lg font-bold text-blue-400 font-['Orbitron'] mb-4 flex items-center gap-2">
                  <span>⚙️</span> WORKFLOW
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['intake', 'kyc_verification', 'credit_scoring', 'decision', 'completed'].map((stage, idx) => (
                    <div
                      key={stage}
                      className={`px-3 py-2 rounded-lg text-sm font-bold ${
                        application.workflow_stage === stage
                          ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                          : idx < ['intake', 'kyc_verification', 'credit_scoring', 'decision', 'completed'].indexOf(application.workflow_stage || '')
                          ? 'bg-green-600/30 text-green-400 border border-green-500/50'
                          : 'bg-gray-800 text-gray-500 border border-gray-600/50'
                      }`}
                    >
                      {stage.replace('_', ' ').toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>

              {/* Decision Reasoning */}
              {application.ai_explanation && (
                <div className="md:col-span-2 bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                  <h3 className="text-lg font-bold text-red-500 font-['Orbitron'] mb-4 flex items-center gap-2">
                    <span>🤖</span> AI DECISION REASONING
                  </h3>
                  <p className="text-gray-300 leading-relaxed">{application.ai_explanation}</p>
                </div>
              )}

              {/* Decision Override Panel */}
              <div className="md:col-span-2 bg-black/40 backdrop-blur-xl rounded-2xl p-6 border-2 border-yellow-600/50">
                <h3 className="text-lg font-bold text-yellow-500 font-['Orbitron'] mb-4 flex items-center gap-2">
                  <span>⚡</span> DECISION CONTROL
                </h3>
                <div className="flex flex-wrap gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOverride('approved')}
                    disabled={overriding || application.decision === 'approved'}
                    className="px-6 py-3 bg-green-700 hover:bg-green-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                  >
                    ✓ APPROVE
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOverride('under_review')}
                    disabled={overriding || application.decision === 'under_review'}
                    className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-black rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  >
                    ⚠ REVIEW
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOverride('rejected')}
                    disabled={overriding || application.decision === 'rejected'}
                    className="px-6 py-3 bg-red-700 hover:bg-red-600 text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                  >
                    ✕ REJECT
                  </motion.button>
                  {overriding && <span className="text-yellow-500 animate-pulse">Processing override...</span>}
                </div>
              </div>
            </motion.div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                <h3 className="text-lg font-bold text-red-500 font-['Orbitron'] mb-6 flex items-center gap-2">
                  <span>📁</span> UPLOADED DOCUMENTS ({documents.length})
                </h3>
                
                {documents.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No documents uploaded</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.map((doc) => (
                      <motion.div
                        key={doc.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-black/50 rounded-xl p-4 border border-red-600/30 hover:border-red-500/60 transition-all cursor-pointer"
                        onClick={() => doc.file_path && setSelectedImage(doc.file_path)}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-3xl">
                            {doc.document_type?.includes('photo') ? '📸' : '📄'}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-bold truncate">{doc.document_type}</p>
                            <p className="text-gray-500 text-xs truncate">{doc.file_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded ${
                            doc.verified 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {doc.verified ? '✓ Verified' : '⏳ Pending'}
                          </span>
                          <span className="text-gray-500 text-xs">
                            {new Date(doc.uploaded_at).toLocaleDateString()}
                          </span>
                        </div>
                        {doc.file_path && (
                          <div className="mt-3 aspect-video bg-black/30 rounded-lg overflow-hidden border border-red-600/20">
                            <img 
                              src={doc.file_path} 
                              alt={doc.document_type}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {/* Extracted Data Section */}
                        {doc.extracted_data && (
                          <div className="mt-3 bg-black/70 rounded-lg p-3 border border-yellow-600/30">
                            <h4 className="text-yellow-400 text-xs font-bold mb-2 flex items-center gap-1">
                              <span>📋</span> EXTRACTED DATA
                            </h4>
                            <div className="space-y-1">
                              {Object.entries(doc.extracted_data).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                  <span className="text-gray-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                                  <span className="text-white font-medium truncate ml-2">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Verification Details */}
                        {doc.verification_details && (
                          <div className="mt-2 text-xs">
                            <details className="bg-black/50 rounded-lg border border-blue-600/30">
                              <summary className="cursor-pointer p-2 text-blue-400 font-bold hover:bg-blue-500/10">
                                🔍 Verification Details
                              </summary>
                              <pre className="p-2 text-gray-300 text-[10px] overflow-auto max-h-32">
                                {JSON.stringify(doc.verification_details, null, 2)}
                              </pre>
                            </details>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* KYC Tab */}
          {activeTab === 'kyc' && (
            <motion.div
              key="kyc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* KYC Result */}
              {application.kyc_result && (
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                  <h3 className="text-lg font-bold text-green-400 font-['Orbitron'] mb-4 flex items-center gap-2">
                    <span>🔍</span> KYC VERIFICATION
                  </h3>
                  <pre className="text-gray-300 text-sm overflow-auto bg-black/30 p-4 rounded-lg border border-gray-700">
                    {JSON.stringify(application.kyc_result, null, 2)}
                  </pre>
                </div>
              )}

              {/* Fraud Indicators */}
              {application.fraud_indicators && (
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                  <h3 className="text-lg font-bold text-red-400 font-['Orbitron'] mb-4 flex items-center gap-2">
                    <span>🚨</span> FRAUD ANALYSIS
                  </h3>
                  <pre className="text-gray-300 text-sm overflow-auto bg-black/30 p-4 rounded-lg border border-gray-700">
                    {JSON.stringify(application.fraud_indicators, null, 2)}
                  </pre>
                </div>
              )}

              {/* Credit Analysis */}
              {application.credit_analysis && (
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                  <h3 className="text-lg font-bold text-yellow-400 font-['Orbitron'] mb-4 flex items-center gap-2">
                    <span>💳</span> CREDIT ANALYSIS
                  </h3>
                  <pre className="text-gray-300 text-sm overflow-auto bg-black/30 p-4 rounded-lg border border-gray-700">
                    {JSON.stringify(application.credit_analysis, null, 2)}
                  </pre>
                </div>
              )}

              {!application.kyc_result && !application.fraud_indicators && !application.credit_analysis && (
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-8 border border-red-600/30 text-center">
                  <p className="text-gray-500">No KYC data available for this application</p>
                </div>
              )}
            </motion.div>
          )}

          {/* AI Logs Tab */}
          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-red-600/30">
                <h3 className="text-lg font-bold text-red-500 font-['Orbitron'] mb-6 flex items-center gap-2">
                  <span>🤖</span> AI AGENT LOGS ({aiLogs.length})
                </h3>
                
                {aiLogs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No AI logs recorded</p>
                ) : (
                  <div className="space-y-4">
                    {aiLogs.map((log, idx) => (
                      <motion.div
                        key={log.id || idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-black/50 rounded-xl p-4 border border-red-600/30"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <span className="text-red-400 font-bold font-['Orbitron'] text-sm uppercase">
                              {log.agent_type}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              log.status === 'success' 
                                ? 'bg-green-500/20 text-green-400' 
                                : 'bg-red-500/20 text-red-400'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                          <span className="text-gray-500 text-xs">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-2">{log.action}</p>
                        <pre className="text-gray-300 text-xs overflow-auto bg-black/30 p-3 rounded-lg border border-gray-700 max-h-48">
                          {JSON.stringify(log.output_data, null, 2)}
                        </pre>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Editable Field Component with Money Heist Theme
interface EditableFieldProps {
  label: string;
  value: string;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: string;
  prefix?: string;
}

function EditableField({ label, value, isEditing, onChange, type = 'text', prefix }: EditableFieldProps) {
  return (
    <div>
      <label className="text-gray-500 text-sm block mb-1">{label}</label>
      {isEditing ? (
        <div className="relative">
          {prefix && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-500 font-bold">
              {prefix}
            </span>
          )}
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 bg-black/50 border-2 border-yellow-600/50 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all ${prefix ? 'pl-8' : ''}`}
          />
        </div>
      ) : (
        <p className="text-white font-medium">
          {prefix}{value || 'N/A'}
        </p>
      )}
    </div>
  );
}
