'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import WaterBlobBackground from '@/components/WaterBlobBackground';
import GlassCard from '@/components/GlassCard';
import FormField from '@/components/FormField';
import GradientButton from '@/components/GradientButton';

export default function ApplyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    employment_type: '',
    monthly_income: '',
    existing_emi: '',
    loan_type: '',
    loan_amount: '',
    tenure_months: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Convert string values to numbers
      const payload = {
        name: formData.name,
        age: parseInt(formData.age),
        employment_type: formData.employment_type,
        monthly_income: parseFloat(formData.monthly_income),
        existing_emi: parseFloat(formData.existing_emi),
        loan_type: formData.loan_type,
        loan_amount: parseFloat(formData.loan_amount),
        tenure_months: parseInt(formData.tenure_months),
      };

      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application');
      }

      // Redirect to result page
      router.push(`/result?id=${data.application.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden py-12 px-4">
      <WaterBlobBackground />

      <div className="relative z-10 max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
            Loan Application
          </h1>
          <p className="text-gray-400">Fill in your details to get an instant decision</p>
        </motion.div>

        <GlassCard hover={false}>
          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-neon-purple">👤</span> Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
                <FormField
                  label="Age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="30"
                  required
                  min={21}
                  max={60}
                />
              </div>
            </div>

            {/* Employment & Income */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-neon-blue">💼</span> Employment & Income
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Employment Type"
                  type="select"
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  required
                  options={[
                    { value: 'salaried', label: 'Salaried' },
                    { value: 'self_employed', label: 'Self Employed' },
                  ]}
                />
                <FormField
                  label="Monthly Income (₹)"
                  type="number"
                  name="monthly_income"
                  value={formData.monthly_income}
                  onChange={handleChange}
                  placeholder="50000"
                  required
                  min={20000}
                  step={1000}
                />
                <FormField
                  label="Existing EMI (₹)"
                  type="number"
                  name="existing_emi"
                  value={formData.existing_emi}
                  onChange={handleChange}
                  placeholder="10000"
                  required
                  min={0}
                  step={500}
                />
              </div>
            </div>

            {/* Loan Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <span className="text-neon-pink">💰</span> Loan Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Loan Type"
                  type="select"
                  name="loan_type"
                  value={formData.loan_type}
                  onChange={handleChange}
                  required
                  options={[
                    { value: 'personal', label: 'Personal Loan' },
                    { value: 'home', label: 'Home Loan' },
                    { value: 'car', label: 'Car Loan' },
                    { value: 'education', label: 'Education Loan' },
                    { value: 'business', label: 'Business Loan' },
                  ]}
                />
                <FormField
                  label="Loan Amount (₹)"
                  type="number"
                  name="loan_amount"
                  value={formData.loan_amount}
                  onChange={handleChange}
                  placeholder="500000"
                  required
                  min={1000}
                  step={10000}
                />
                <FormField
                  label="Tenure (Months)"
                  type="number"
                  name="tenure_months"
                  value={formData.tenure_months}
                  onChange={handleChange}
                  placeholder="24"
                  required
                  min={6}
                  max={360}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500 text-red-400"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <GradientButton
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      ⚡
                    </motion.span>
                    Processing...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </GradientButton>
              
              <GradientButton
                type="button"
                variant="secondary"
                onClick={() => router.push('/')}
              >
                Cancel
              </GradientButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </main>
  );
}
