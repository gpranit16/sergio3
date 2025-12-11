'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Application {
  id: string;
  application_number: string;
  name: string;
  age: number;
  employment_type: string;
  monthly_income: number;
  existing_emi: number;
  loan_type: string;
  loan_amount: number;
  tenure_months: number;
  risk_score: number;
  decision: string;
  reason: string;
  created_at: string;
}

export default function ApplicationStatusPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const status = searchParams.get('status') || 'pending';

  useEffect(() => {
    async function fetchApplication() {
      try {
        const response = await fetch(`/api/applications?id=${params.id}`);
        const data = await response.json();
        if (data.success && data.application) {
          setApplication(data.application);
        } else {
          setError('Application not found');
        }
      } catch (err) {
        setError('Failed to load application');
      } finally {
        setLoading(false);
      }
    }
    fetchApplication();
  }, [params.id]);

  const getStatusConfig = (decision: string) => {
    switch (decision) {
      case 'approved':
        return {
          icon: '✅',
          title: 'Congratulations!',
          subtitle: 'Your loan has been approved',
          color: 'from-green-500 to-emerald-600',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/50',
        };
      case 'rejected':
        return {
          icon: '❌',
          title: 'Application Declined',
          subtitle: 'Unfortunately, we cannot approve your loan at this time',
          color: 'from-red-500 to-rose-600',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/50',
        };
      default:
        return {
          icon: '⏳',
          title: 'Under Review',
          subtitle: 'Your application is being processed',
          color: 'from-yellow-500 to-orange-600',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/50',
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-neon-purple mx-auto mb-4"></div>
          <p className="text-gray-400">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">{error}</p>
          <Link href="/apply-loan" className="text-neon-purple hover:underline">
            ← Apply for a new loan
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(application?.decision || status);

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Status Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-center p-8 rounded-2xl ${statusConfig.bgColor} ${statusConfig.borderColor} border mb-8`}
        >
          <div className="text-6xl mb-4">{statusConfig.icon}</div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${statusConfig.color} bg-clip-text text-transparent mb-2`}>
            {statusConfig.title}
          </h1>
          <p className="text-gray-300">{statusConfig.subtitle}</p>
        </motion.div>

        {application && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-dark-800/50 rounded-2xl border border-neon-purple/20 p-6 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              📋 Application Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-900/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Application Number</p>
                <p className="text-white font-semibold">{application.application_number}</p>
              </div>
              <div className="bg-dark-900/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Applicant Name</p>
                <p className="text-white font-semibold">{application.name}</p>
              </div>
              <div className="bg-dark-900/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Loan Amount</p>
                <p className="text-white font-semibold">₹{application.loan_amount?.toLocaleString()}</p>
              </div>
              <div className="bg-dark-900/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Tenure</p>
                <p className="text-white font-semibold">{application.tenure_months} months</p>
              </div>
              <div className="bg-dark-900/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Monthly Income</p>
                <p className="text-white font-semibold">₹{application.monthly_income?.toLocaleString()}</p>
              </div>
              <div className="bg-dark-900/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Risk Score</p>
                <p className="text-white font-semibold">{application.risk_score}/100</p>
              </div>
            </div>

            {application.reason && (
              <div className="mt-6 bg-dark-900/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm mb-2">Decision Reasoning</p>
                <p className="text-gray-300 text-sm">{application.reason}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-gradient-to-r from-neon-purple to-neon-blue rounded-xl text-white font-semibold text-center hover:opacity-90 transition-opacity"
          >
            🎯 View Dashboard
          </Link>
          <Link
            href="/apply-loan"
            className="px-6 py-3 bg-dark-800 border border-neon-purple/30 rounded-xl text-white font-semibold text-center hover:bg-dark-700 transition-colors"
          >
            📝 Apply for Another Loan
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-dark-800 border border-gray-600 rounded-xl text-gray-300 font-semibold text-center hover:bg-dark-700 transition-colors"
          >
            🏠 Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
