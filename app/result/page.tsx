'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import WaterBlobBackground from '@/components/WaterBlobBackground';
import GlassCard from '@/components/GlassCard';
import DecisionBadge from '@/components/DecisionBadge';
import ScoreCircle from '@/components/ScoreCircle';
import GradientButton from '@/components/GradientButton';

interface Application {
  id: string;
  name: string;
  age: number;
  employment_type: string;
  monthly_income: number;
  existing_emi: number;
  loan_type: string;
  loan_amount: number;
  tenure_months: number;
  risk_score: number;
  decision: 'approved' | 'pending' | 'rejected';
  reason: string;
  created_at: string;
}

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) {
      setError('No application ID provided');
      setLoading(false);
      return;
    }

    fetch(`/api/applications?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApplication(data.application);
        } else {
          setError(data.error || 'Failed to fetch application');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <WaterBlobBackground />
        <motion.div
          className="text-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <span className="text-6xl">⚡</span>
        </motion.div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <WaterBlobBackground />
        <GlassCard className="max-w-md text-center">
          <h1 className="text-3xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300 mb-6">{error || 'Application not found'}</p>
          <GradientButton onClick={() => router.push('/')}>Go Home</GradientButton>
        </GlassCard>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden py-12 px-4">
      <WaterBlobBackground />

      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
            Application Result
          </h1>
          <p className="text-gray-400">Your loan application has been processed</p>
        </motion.div>

        <GlassCard hover={false} className="mb-6">
          <div className="flex flex-col items-center mb-8">
            <DecisionBadge decision={application.decision} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Risk Score */}
            <div className="flex flex-col items-center">
              <ScoreCircle score={application.risk_score} />
              <p className="text-gray-400 mt-4 text-center">
                Based on your financial profile
              </p>
            </div>

            {/* Application Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold text-white mb-4">Application Details</h3>
              <InfoRow label="Applicant" value={application.name} />
              <InfoRow label="Age" value={`${application.age} years`} />
              <InfoRow label="Employment" value={application.employment_type.replace('_', ' ')} />
              <InfoRow label="Monthly Income" value={`₹${application.monthly_income.toLocaleString()}`} />
              <InfoRow label="Loan Type" value={application.loan_type} />
              <InfoRow label="Loan Amount" value={`₹${application.loan_amount.toLocaleString()}`} />
              <InfoRow label="Tenure" value={`${application.tenure_months} months`} />
            </div>
          </div>

          {/* AI Explanation */}
          <motion.div
            className="p-6 rounded-xl bg-gradient-to-r from-neon-purple/10 to-neon-blue/10 border border-neon-purple/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
              <span className="text-2xl">🤖</span> AI Explanation
            </h3>
            <p className="text-gray-300 leading-relaxed">{application.reason}</p>
          </motion.div>
        </GlassCard>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GradientButton onClick={() => router.push('/apply')}>
            New Application
          </GradientButton>
          <GradientButton onClick={() => router.push('/dashboard')} variant="secondary">
            View Dashboard
          </GradientButton>
          <GradientButton onClick={() => router.push('/')} variant="secondary">
            Home
          </GradientButton>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-glass-border">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <WaterBlobBackground />
        <motion.div
          className="text-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <span className="text-6xl">⚡</span>
        </motion.div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
