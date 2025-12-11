'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface FormData {
  name: string;
  age: string;
  phone: string;
  email: string;
  employment_type: string;
  monthly_income: string;
  existing_emi: string;
  loan_amount: string;
  tenure_months: string;
}

interface Documents {
  aadhaar: File | null;
  pan: File | null;
  salary_slip: File | null;
  bank_statement: File | null;
  selfie: File | null;
}

interface AadhaarVerificationResult {
  passed: boolean;
  score: number;
  fraudRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
  aadhaarExtracted: {
    name: string | null;
    dob: string | null;
    yob: string | null;
  };
  details?: {
    nameSimilarity: number;
    ageMatch: boolean;
    extractedAge: number | null;
    formAge: number;
  };
}

interface PanVerificationResult {
  passed: boolean;
  score: number;
  flags: string[];
  panExtracted: {
    name: string | null;
    panNumber: string | null;
    dob: string | null;
  };
  details?: {
    nameSimilarity: number;
    panFormat: boolean;
  };
}

interface SelfieVerificationResult {
  passed: boolean;
  score: number;
  flags: string[];
  details?: {
    faceDetected: boolean;
    matchScore: number;
  };
}

interface BankStatementVerificationResult {
  passed: boolean;
  score: number;
  flags: string[];
  extractedData: {
    accountName: string | null;
    accountNumber: string | null;
    bank: string | null;
  };
  details?: {
    nameSimilarity: number;
    validFormat: boolean;
  };
}

interface SalarySlipVerificationResult {
  passed: boolean;
  score: number;
  confidence: number;
  flags: string[];
  details?: {
    employeeName: string;
    salaryAmount: string;
    nameSimilarity: number;
    validFormat: boolean;
  };
}

export default function ApplyLoanPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Aadhaar verification state
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);
  const [aadhaarVerification, setAadhaarVerification] = useState<AadhaarVerificationResult | null>(null);
  const [aadhaarName, setAadhaarName] = useState('');
  
  // PAN verification state
  const [panVerifying, setPanVerifying] = useState(false);
  const [panVerification, setPanVerification] = useState<PanVerificationResult | null>(null);
  const [panName, setPanName] = useState('');
  const [panNumber, setPanNumber] = useState('');
  
  // Selfie verification state
  const [selfieVerifying, setSelfieVerifying] = useState(false);
  const [selfieVerification, setSelfieVerification] = useState<SelfieVerificationResult | null>(null);
  
  // Bank statement verification state
  const [bankStatementVerifying, setBankStatementVerifying] = useState(false);
  const [bankStatementVerification, setBankStatementVerification] = useState<BankStatementVerificationResult | null>(null);
  const [bankStatementName, setBankStatementName] = useState('');
  
  // Salary slip verification state
  const [salarySlipVerifying, setSalarySlipVerifying] = useState(false);
  const [salarySlipVerification, setSalarySlipVerification] = useState<SalarySlipVerificationResult | null>(null);
  const [salarySlipEmployeeName, setSalarySlipEmployeeName] = useState('');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    phone: '',
    email: '',
    employment_type: '',
    monthly_income: '',
    existing_emi: '',
    loan_amount: '',
    tenure_months: '',
  });

  const [documents, setDocuments] = useState<Documents>({
    aadhaar: null,
    pan: null,
    salary_slip: null,
    bank_statement: null,
    selfie: null,
  });

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age || parseInt(formData.age) < 21 || parseInt(formData.age) > 60) {
      newErrors.age = 'Age must be between 21-60';
    }
    if (!formData.phone.match(/^\d{10}$/)) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.employment_type) {
      newErrors.employment_type = 'Employment type is required';
    }
    if (!formData.monthly_income || parseInt(formData.monthly_income) < 20000) {
      newErrors.monthly_income = 'Minimum income is ₹20,000';
    }
    if (formData.existing_emi === '') {
      newErrors.existing_emi = 'Existing EMI is required (enter 0 if none)';
    }
    if (!formData.loan_amount || parseInt(formData.loan_amount) < 1000) {
      newErrors.loan_amount = 'Loan amount must be at least ₹1,000';
    }
    if (!formData.tenure_months || parseInt(formData.tenure_months) < 6 || parseInt(formData.tenure_months) > 60) {
      newErrors.tenure_months = 'Tenure must be between 6-60 months';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!documents.aadhaar) newErrors.aadhaar = 'Aadhaar card is required';
    if (!documents.pan) newErrors.pan = 'PAN card is required';
    if (!documents.salary_slip) newErrors.salary_slip = 'Salary slip is required';
    if (!documents.bank_statement) newErrors.bank_statement = 'Bank statement is required';
    if (!documents.selfie) newErrors.selfie = 'Selfie is required for verification';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // Verify Aadhaar card against form data
  const verifyAadhaarCard = async (file: File) => {
    setAadhaarVerifying(true);
    setAadhaarVerification(null);
    
    try {
      const verifyFormData = new FormData();
      verifyFormData.append('fullName', formData.name);
      verifyFormData.append('age', formData.age);
      verifyFormData.append('aadhaar', file);
      verifyFormData.append('aadhaarName', aadhaarName); // Send the name from Aadhaar card

      const response = await fetch('/api/verify-aadhaar', {
        method: 'POST',
        body: verifyFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Verification failed');
      }

      const result: AadhaarVerificationResult = await response.json();
      setAadhaarVerification(result);
      
      // If verification failed with high fraud risk, show error
      if (!result.passed && result.fraudRiskLevel === 'HIGH') {
        setErrors({ ...errors, aadhaar: 'Aadhaar verification failed - high fraud risk detected' });
      }
      
      return result;
    } catch (error) {
      console.error('Aadhaar verification error:', error);
      setAadhaarVerification({
        passed: false,
        score: 0,
        fraudRiskLevel: 'HIGH',
        flags: ['Verification failed - please try again'],
        aadhaarExtracted: { name: null, dob: null, yob: null },
      });
    } finally {
      setAadhaarVerifying(false);
    }
  };

  // Verify PAN card against form data
  const verifyPanCard = async (file: File) => {
    setPanVerifying(true);
    setPanVerification(null);
    
    try {
      const verifyFormData = new FormData();
      verifyFormData.append('fullName', formData.name);
      verifyFormData.append('pan', file);
      verifyFormData.append('panName', panName);
      verifyFormData.append('panNumber', panNumber);

      const response = await fetch('/api/verify-pan', {
        method: 'POST',
        body: verifyFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'PAN verification failed');
      }

      const result: PanVerificationResult = await response.json();
      setPanVerification(result);
      
      if (!result.passed) {
        setErrors({ ...errors, pan: 'PAN verification failed' });
      }
      
      return result;
    } catch (error) {
      console.error('PAN verification error:', error);
      setPanVerification({
        passed: false,
        score: 0,
        flags: ['Verification failed - please try again'],
        panExtracted: { name: null, panNumber: null, dob: null },
      });
    } finally {
      setPanVerifying(false);
    }
  };

  // Verify selfie against Aadhaar photo
  const verifySelfie = async (file: File) => {
    // Check if Aadhaar is uploaded first
    if (!documents.aadhaar) {
      setErrors({ ...errors, selfie: 'Please upload Aadhaar card first' });
      return;
    }

    setSelfieVerifying(true);
    setSelfieVerification(null);
    
    try {
      const verifyFormData = new FormData();
      verifyFormData.append('selfie', file);
      verifyFormData.append('aadhaar', documents.aadhaar);
      verifyFormData.append('fullName', formData.name);

      const response = await fetch('/api/verify-selfie', {
        method: 'POST',
        body: verifyFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Selfie verification failed');
      }

      const result: SelfieVerificationResult = await response.json();
      setSelfieVerification(result);
      
      if (!result.passed) {
        setErrors({ ...errors, selfie: 'Selfie does not match Aadhaar photo' });
      }
      
      return result;
    } catch (error) {
      console.error('Selfie verification error:', error);
      setSelfieVerification({
        passed: false,
        score: 0,
        flags: ['Verification failed - please try again'],
      });
    } finally {
      setSelfieVerifying(false);
    }
  };

  // Verify bank statement against form data
  const verifyBankStatement = async (file: File) => {
    setBankStatementVerifying(true);
    setBankStatementVerification(null);
    
    try {
      const verifyFormData = new FormData();
      verifyFormData.append('fullName', formData.name);
      verifyFormData.append('bankStatement', file);
      verifyFormData.append('statementName', bankStatementName);

      const response = await fetch('/api/verify-bank-statement', {
        method: 'POST',
        body: verifyFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Bank statement verification failed');
      }

      const result: BankStatementVerificationResult = await response.json();
      setBankStatementVerification(result);
      
      if (!result.passed) {
        setErrors({ ...errors, bank_statement: 'Bank statement verification failed' });
      }
      
      return result;
    } catch (error) {
      console.error('Bank statement verification error:', error);
      setBankStatementVerification({
        passed: false,
        score: 0,
        flags: ['Verification failed - please try again'],
        extractedData: { accountName: null, accountNumber: null, bank: null },
      });
    } finally {
      setBankStatementVerifying(false);
    }
  };

  const verifySalarySlip = async (file: File) => {
    setSalarySlipVerifying(true);
    setSalarySlipVerification(null);
    
    try {
      const verifyFormData = new FormData();
      verifyFormData.append('fullName', formData.name);
      verifyFormData.append('salarySlip', file);
      verifyFormData.append('employeeName', salarySlipEmployeeName);

      const response = await fetch('/api/verify-salary-slip', {
        method: 'POST',
        body: verifyFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Salary slip verification failed');
      }

      const result: SalarySlipVerificationResult = await response.json();
      setSalarySlipVerification(result);
      
      if (!result.passed) {
        setErrors({ ...errors, salary_slip: 'Salary slip verification failed' });
      }
      
      return result;
    } catch (error) {
      console.error('Salary slip verification error:', error);
      setSalarySlipVerification({
        passed: false,
        score: 0,
        confidence: 0,
        flags: ['Verification failed - please try again'],
      });
    } finally {
      setSalarySlipVerifying(false);
    }
  };

  const handleFileChange = async (docType: keyof Documents, file: File | null) => {
    setDocuments({ ...documents, [docType]: file });
    if (errors[docType]) {
      setErrors({ ...errors, [docType]: '' });
    }
    
    // If Aadhaar is uploaded, verify it
    if (docType === 'aadhaar' && file) {
      await verifyAadhaarCard(file);
    }
    
    // Clear verification if Aadhaar is removed
    if (docType === 'aadhaar' && !file) {
      setAadhaarVerification(null);
    }
    
    // If PAN is uploaded, verify it
    if (docType === 'pan' && file) {
      await verifyPanCard(file);
    }
    
    // Clear verification if PAN is removed
    if (docType === 'pan' && !file) {
      setPanVerification(null);
    }
    
    // If Selfie is uploaded, verify it
    if (docType === 'selfie' && file) {
      await verifySelfie(file);
    }
    
    // Clear verification if Selfie is removed
    if (docType === 'selfie' && !file) {
      setSelfieVerification(null);
    }
    
    // If Bank Statement is uploaded, verify it
    if (docType === 'bank_statement' && file) {
      await verifyBankStatement(file);
    }
    
    // Clear verification if Bank Statement is removed
    if (docType === 'bank_statement' && !file) {
      setBankStatementVerification(null);
    }
    
    // If Salary Slip is uploaded, verify it
    if (docType === 'salary_slip' && file) {
      await verifySalarySlip(file);
    }
    
    // Clear verification if Salary Slip is removed
    if (docType === 'salary_slip' && !file) {
      setSalarySlipVerification(null);
    }
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    
    try {
      // Parse numeric values safely
      const ageValue = parseInt(formData.age) || 0;
      const incomeValue = parseInt(formData.monthly_income) || 0;
      const emiValue = formData.existing_emi ? parseInt(formData.existing_emi) : 0;
      const loanValue = parseInt(formData.loan_amount) || 0;
      const tenureValue = parseInt(formData.tenure_months) || 0;

      // STEP 1: Create application first to get application ID
      const appResponse = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          age: ageValue,
          employment_type: formData.employment_type,
          monthly_income: incomeValue,
          existing_emi: emiValue >= 0 ? emiValue : 0,
          loan_type: 'personal',
          loan_amount: loanValue,
          tenure_months: tenureValue,
        }),
      });

      const appResult = await appResponse.json();
      
      if (!appResult.success) {
        const errorDetails = appResult.details ? appResult.details.map((d: any) => d.message).join(', ') : appResult.error;
        alert('Application failed: ' + errorDetails);
        setLoading(false);
        return;
      }

      const applicationId = appResult.application.id;

      // STEP 2: Upload documents with application ID
      const uploadPromises = Object.entries(documents).map(async ([type, file]) => {
        if (!file) return null;
        
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        uploadFormData.append('type', type);
        uploadFormData.append('applicationId', applicationId);
        
        const response = await fetch('/api/upload-verified', {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error(`Upload error for ${type}:`, errorData);
          // Don't fail the whole process for upload errors
          return { success: false, type, error: errorData.error };
        }
        return response.json();
      });

      const uploadResults = await Promise.all(uploadPromises);
      console.log('Upload results:', uploadResults);
      
      // Redirect to result page
      router.push(`/application/${applicationId}?status=${appResult.application.decision}`);
      
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-900">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        
        {/* Floating Masks */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`mask-${i}`}
            className="absolute text-4xl opacity-5"
            initial={{ x: `${Math.random() * 100}%`, y: -100 }}
            animate={{ y: '120vh', rotate: 360 }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear'
            }}
          >
            {i % 2 === 0 ? '🎭' : '💰'}
          </motion.div>
        ))}
        
        {/* Corner Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-3xl" />
      </div>
      
      <main className="relative z-10 container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10 }}
              className="inline-block text-6xl mb-4"
            >
              🎭
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
                Join The Heist
              </span>
            </h1>
            <p className="text-gray-400">Complete your loan application in just 2 steps</p>
          </div>

          {/* Progress Indicator - Heist Style */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-red-500' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? 'bg-gradient-to-br from-red-600 to-yellow-600 text-white' : 'bg-gray-800 border border-gray-700'
                }`}>
                  {step > 1 ? '✓' : '1'}
                </div>
                <span className="hidden md:inline font-medium">Personal Details</span>
              </div>
              
              <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-gradient-to-r from-red-600 to-yellow-600' : 'bg-gray-700'}`} />
              
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-red-500' : 'text-gray-500'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? 'bg-gradient-to-br from-red-600 to-yellow-600 text-white' : 'bg-gray-800 border border-gray-700'
                }`}>
                  2
                </div>
                <span className="hidden md:inline font-medium">Upload Documents</span>
              </div>
            </div>
          </div>

          {/* Main Card - Heist Theme */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-yellow-600/20 rounded-3xl blur-xl" />
            <div className="relative bg-black/70 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 hover:border-red-500/30 transition-all duration-500">
            {step === 1 ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                  Step 1: Personal Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                        👤 Full Name *
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-semibold placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠</span> {errors.name}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                        🎂 Age *
                      </span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-semibold placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                      placeholder="21-60 years"
                    />
                    {errors.age && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠</span> {errors.age}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                        📱 Phone Number *
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-semibold placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                      placeholder="10 digit mobile number"
                    />
                    {errors.phone && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠</span> {errors.phone}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                        ✉️ Email *
                      </span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-semibold placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠</span> {errors.email}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                        💼 Employment Type *
                      </span>
                    </label>
                    <select
                      name="employment_type"
                      value={formData.employment_type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-semibold focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                    >
                      <option value="" className="bg-gray-900">Select employment type</option>
                      <option value="salaried" className="bg-gray-900">💵 Salaried</option>
                      <option value="self_employed" className="bg-gray-900">🏢 Self Employed</option>
                    </select>
                    {errors.employment_type && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠</span> {errors.employment_type}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                        💰 Monthly Income (₹) *
                      </span>
                    </label>
                    <input
                      type="number"
                      name="monthly_income"
                      value={formData.monthly_income}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-semibold placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                      placeholder="Minimum ₹20,000"
                    />
                    {errors.monthly_income && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠</span> {errors.monthly_income}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                        📊 Existing EMI (₹) *
                      </span>
                    </label>
                    <input
                      type="number"
                      name="existing_emi"
                      value={formData.existing_emi}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-semibold placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                      placeholder="Enter 0 if none"
                    />
                    {errors.existing_emi && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠</span> {errors.existing_emi}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                        🎯 Loan Amount (₹) *
                      </span>
                    </label>
                    <input
                      type="number"
                      name="loan_amount"
                      value={formData.loan_amount}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-semibold placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                      placeholder="Amount you need"
                    />
                    {errors.loan_amount && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠</span> {errors.loan_amount}
                      </motion.p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium mb-2">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-yellow-400">
                        ⏱️ Tenure (Months) *
                      </span>
                    </label>
                    <input
                      type="number"
                      name="tenure_months"
                      value={formData.tenure_months}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white font-semibold placeholder:text-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none transition-all duration-300"
                      placeholder="6-60 months"
                    />
                    {errors.tenure_months && (
                      <motion.p 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2 flex items-center gap-1"
                      >
                        <span>⚠</span> {errors.tenure_months}
                      </motion.p>
                    )}
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-end pt-4"
                >
                  <motion.button 
                    onClick={handleNext} 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-4 text-lg font-bold bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-xl relative overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Next: Upload Documents
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </motion.div>
              </div>
            ) : (
              <div className="space-y-6">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold mb-6" style={{ fontFamily: 'Orbitron, sans-serif' }}
                >
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 to-red-500">
                    📄 Step 2: Upload Documents
                  </span>
                </motion.h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-red-600/10 to-yellow-600/10 border border-red-500/30 rounded-xl mb-6"
                >
                  <p className="text-gray-300 text-sm">
                    🔒 All documents will be verified using AI. Upload clear images or PDFs for best results.
                  </p>
                </motion.div>

                <div className="space-y-4">
                  {/* Aadhaar Card with Verification */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0 }}
                    className="group relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-700 bg-opacity-10">
                        🪪
                      </div>
                      <div className="flex-1">
                        <label className="block text-lg font-semibold mb-1">
                          <span className="text-white">
                            Aadhaar Card *
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mb-4">12-digit Aadhaar number must be visible</p>
                        
                        {/* Name on Aadhaar Card Input */}
                        <div className="mb-3">
                          <label className="block text-sm text-gray-400 mb-2">
                            Enter name as written on Aadhaar card *
                          </label>
                          <input
                            type="text"
                            value={aadhaarName}
                            onChange={(e) => setAadhaarName(e.target.value)}
                            placeholder="e.g., Pranit Kumar"
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-red-500/50 transition-all"
                          />
                          <p className="text-xs text-gray-500 mt-1">This will be compared with your form name for verification</p>
                        </div>
                        
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange('aadhaar', e.target.files?.[0] || null)}
                            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-red-600 file:to-yellow-600 file:text-white hover:file:opacity-80 file:cursor-pointer cursor-pointer transition-all duration-300 hover:border-red-500/50"
                          />
                        </div>
                        
                        {/* Aadhaar Verification Status */}
                        {aadhaarVerifying && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2"
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="text-blue-400 text-xl"
                            >
                              ⏳
                            </motion.span>
                            <p className="text-blue-400 text-sm font-medium">
                              Verifying Aadhaar card with AI...
                            </p>
                          </motion.div>
                        )}
                        
                        {documents.aadhaar && !aadhaarVerifying && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2"
                          >
                            <span className="text-green-400 text-xl">✓</span>
                            <p className="text-green-400 text-sm font-medium flex-1">
                              {documents.aadhaar?.name}
                            </p>
                            <span className="text-xs text-green-400/70">
                              {(documents.aadhaar!.size / 1024).toFixed(1)} KB
                            </span>
                          </motion.div>
                        )}
                        
                        {/* Aadhaar Verification Result */}
                        {aadhaarVerification && !aadhaarVerifying && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 p-4 rounded-lg border ${
                              aadhaarVerification.passed 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : aadhaarVerification.fraudRiskLevel === 'MEDIUM'
                                ? 'bg-yellow-500/10 border-yellow-500/30'
                                : 'bg-red-500/10 border-red-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-semibold ${
                                aadhaarVerification.passed ? 'text-green-400' : 
                                aadhaarVerification.fraudRiskLevel === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {aadhaarVerification.passed ? '✓ Verification Passed' : 
                                 aadhaarVerification.fraudRiskLevel === 'MEDIUM' ? '⚠ Needs Review' : '✗ Verification Failed'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                aadhaarVerification.fraudRiskLevel === 'LOW' ? 'bg-green-500/20 text-green-400' :
                                aadhaarVerification.fraudRiskLevel === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                Score: {aadhaarVerification.score}/100
                              </span>
                            </div>
                            
                            {/* Extracted Data */}
                            {aadhaarVerification.aadhaarExtracted.name && (
                              <div className="text-xs text-gray-400 mb-2">
                                <span className="text-gray-500">Extracted Name:</span> {aadhaarVerification.aadhaarExtracted.name}
                              </div>
                            )}
                            
                            {aadhaarVerification.details && (
                              <div className="text-xs text-gray-400 mb-2 flex gap-4">
                                <span>
                                  Name Match: {Math.round(aadhaarVerification.details.nameSimilarity * 100)}%
                                </span>
                                <span>
                                  Age Match: {aadhaarVerification.details.ageMatch ? '✓' : '✗'}
                                  {aadhaarVerification.details.extractedAge && ` (${aadhaarVerification.details.extractedAge})`}
                                </span>
                              </div>
                            )}
                            
                            {/* Flags */}
                            {aadhaarVerification.flags.length > 0 && (
                              <div className="space-y-1">
                                {aadhaarVerification.flags.map((flag, i) => (
                                  <p key={i} className={`text-xs ${
                                    aadhaarVerification.passed ? 'text-yellow-400' : 'text-red-400'
                                  }`}>
                                    ⚠ {flag}
                                  </p>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                        
                        {errors.aadhaar && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2 flex items-center gap-1"
                          >
                            <span>⚠</span> {errors.aadhaar}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* PAN Card with Verification */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-700 bg-opacity-10">
                        💳
                      </div>
                      <div className="flex-1">
                        <label className="block text-lg font-semibold mb-1">
                          <span className="text-white">
                            PAN Card *
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mb-4">PAN format: AAAAA9999A</p>
                        
                        {/* Name on PAN Card Input */}
                        <div className="mb-3">
                          <label className="block text-sm text-gray-400 mb-2">
                            Enter name as written on PAN card *
                          </label>
                          <input
                            type="text"
                            value={panName}
                            onChange={(e) => setPanName(e.target.value)}
                            placeholder="e.g., NIKHIL KUMAR"
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500/50 transition-all"
                          />
                        </div>
                        
                        {/* PAN Number Input */}
                        <div className="mb-3">
                          <label className="block text-sm text-gray-400 mb-2">
                            Enter PAN number *
                          </label>
                          <input
                            type="text"
                            value={panNumber}
                            onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                            placeholder="NILPS5066N"
                            maxLength={10}
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:border-yellow-500/50 transition-all"
                          />
                          <p className="text-xs text-gray-500 mt-1">Format: 5 letters + 4 digits + 1 letter</p>
                        </div>
                        
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange('pan', e.target.files?.[0] || null)}
                            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-yellow-600 file:to-yellow-700 file:text-white hover:file:opacity-80 file:cursor-pointer cursor-pointer transition-all duration-300 hover:border-yellow-500/50"
                          />
                        </div>
                        
                        {/* PAN Verification Status */}
                        {panVerifying && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2"
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="text-blue-400 text-xl"
                            >
                              ⏳
                            </motion.span>
                            <p className="text-blue-400 text-sm font-medium">
                              Verifying PAN card...
                            </p>
                          </motion.div>
                        )}
                        
                        {documents.pan && !panVerifying && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2"
                          >
                            <span className="text-green-400 text-xl">✓</span>
                            <p className="text-green-400 text-sm font-medium flex-1">
                              {documents.pan?.name}
                            </p>
                            <span className="text-xs text-green-400/70">
                              {(documents.pan!.size / 1024).toFixed(1)} KB
                            </span>
                          </motion.div>
                        )}
                        
                        {/* PAN Verification Result */}
                        {panVerification && !panVerifying && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 p-4 rounded-lg border ${
                              panVerification.passed 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-red-500/10 border-red-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-semibold ${
                                panVerification.passed ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {panVerification.passed ? '✓ Verification Passed' : '✗ Verification Failed'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                panVerification.score >= 80 ? 'bg-green-500/20 text-green-400' :
                                panVerification.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                Score: {panVerification.score}/100
                              </span>
                            </div>
                            <div className="space-y-1">
                              {panVerification.flags.map((flag, i) => (
                                <p key={i} className="text-xs text-gray-400">• {flag}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                        
                        {errors.pan && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2 flex items-center gap-1"
                          >
                            <span>⚠</span> {errors.pan}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Other Documents */}
                  {/* Salary Slip with Verification */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl p-3 rounded-xl bg-gradient-to-br from-red-600 to-yellow-600 bg-opacity-10">
                        💵
                      </div>
                      <div className="flex-1">
                        <label className="block text-lg font-semibold mb-1">
                          <span className="text-white">
                            Latest Salary Slip *
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mb-4">Last 3 months salary slip</p>
                        
                        {/* Employee Name on Salary Slip Input */}
                        {/* Employee Name on Salary Slip Input */}
                        <div className="mb-3">
                          <label className="block text-sm text-gray-400 mb-2">
                            Enter employee name from salary slip *
                          </label>
                          <input
                            type="text"
                            value={salarySlipEmployeeName}
                            onChange={(e) => setSalarySlipEmployeeName(e.target.value)}
                            placeholder="e.g., Nikhil Kumar"
                            className="w-full px-4 py-2 bg-gray-900/70 border border-gray-700 rounded-lg text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none"
                          />
                        </div>
                        
                        {/* File Upload */}
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange('salary_slip', e.target.files?.[0] || null)}
                            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-red-600 file:to-yellow-600 file:text-white hover:file:opacity-80 file:cursor-pointer cursor-pointer transition-all duration-300 hover:border-red-500/50"
                          />
                        </div>

                        {/* Verification Status */}
                        {salarySlipVerifying && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                              <p className="text-blue-400 text-sm font-medium">Verifying salary slip...</p>
                            </div>
                          </motion.div>
                        )}

                        {salarySlipVerification && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`mt-3 p-4 rounded-lg border ${
                              salarySlipVerification.passed 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-red-500/10 border-red-500/30'
                            }`}
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <span className={`text-2xl ${salarySlipVerification.passed ? 'text-green-400' : 'text-red-400'}`}>
                                {salarySlipVerification.passed ? '✓' : '✗'}
                              </span>
                              <div className="flex-1">
                                <p className={`font-semibold ${salarySlipVerification.passed ? 'text-green-400' : 'text-red-400'}`}>
                                  {salarySlipVerification.passed ? 'Salary Slip Verified' : 'Verification Failed'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Score: <span className={`font-bold ${
                                    salarySlipVerification.score >= 80 ? 'text-green-400' :
                                    salarySlipVerification.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                                  }`}>{salarySlipVerification.score}/100</span>
                                </p>
                              </div>
                            </div>
                            <div className="space-y-1">
                              {salarySlipVerification.flags.map((flag, idx) => (
                                <p key={idx} className="text-xs text-gray-300">
                                  {flag}
                                </p>
                              ))}
                            </div>
                          </motion.div>
                        )}

                        {documents.salary_slip && !salarySlipVerifying && !salarySlipVerification && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                          >
                            <p className="text-yellow-400 text-sm">
                              ⚠ Please enter employee name, then upload file again to verify
                            </p>
                          </motion.div>
                        )}

                        {errors.salary_slip && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2 flex items-center gap-1"
                          >
                            <span>⚠</span> {errors.salary_slip}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Bank Statement with Verification */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl p-3 rounded-xl bg-gradient-to-br from-yellow-600 to-red-600 bg-opacity-10">
                        🏦
                      </div>
                      <div className="flex-1">
                        <label className="block text-lg font-semibold mb-1">
                          <span className="text-white">
                            Bank Statement *
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mb-4">Last 6 months statement</p>
                        
                        {/* Account Name on Statement Input */}
                        <div className="mb-3">
                          <label className="block text-sm text-gray-400 mb-2">
                            Enter account name from bank statement *
                          </label>
                          <input
                            type="text"
                            value={bankStatementName}
                            onChange={(e) => setBankStatementName(e.target.value)}
                            placeholder="e.g., NIKHIL KUMAR"
                            className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-yellow-500/50 transition-all"
                          />
                          <p className="text-xs text-gray-500 mt-1">This will be compared with your form name</p>
                        </div>
                        
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileChange('bank_statement', e.target.files?.[0] || null)}
                            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-yellow-600 file:to-red-600 file:text-white hover:file:opacity-80 file:cursor-pointer cursor-pointer transition-all duration-300 hover:border-yellow-500/50"
                          />
                        </div>
                        
                        {/* Bank Statement Verification Status */}
                        {bankStatementVerifying && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2"
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="text-blue-400 text-xl"
                            >
                              ⏳
                            </motion.span>
                            <p className="text-blue-400 text-sm font-medium">
                              Verifying bank statement...
                            </p>
                          </motion.div>
                        )}
                        
                        {documents.bank_statement && !bankStatementVerifying && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2"
                          >
                            <span className="text-green-400 text-xl">✓</span>
                            <p className="text-green-400 text-sm font-medium flex-1">
                              {documents.bank_statement?.name}
                            </p>
                            <span className="text-xs text-green-400/70">
                              {(documents.bank_statement!.size / 1024).toFixed(1)} KB
                            </span>
                          </motion.div>
                        )}
                        
                        {/* Bank Statement Verification Result */}
                        {bankStatementVerification && !bankStatementVerifying && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 p-4 rounded-lg border ${
                              bankStatementVerification.passed 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-red-500/10 border-red-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-semibold ${
                                bankStatementVerification.passed ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {bankStatementVerification.passed ? '✓ Verification Passed' : '✗ Verification Failed'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                bankStatementVerification.score >= 80 ? 'bg-green-500/20 text-green-400' :
                                bankStatementVerification.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                Score: {bankStatementVerification.score}/100
                              </span>
                            </div>
                            <div className="space-y-1">
                              {bankStatementVerification.flags.map((flag, i) => (
                                <p key={i} className="text-xs text-gray-400">• {flag}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                        
                        {errors.bank_statement && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2 flex items-center gap-1"
                          >
                            <span>⚠</span> {errors.bank_statement}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Selfie Photo with Face Verification */}
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="group relative p-6 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl p-3 rounded-xl bg-gradient-to-br from-red-500 to-yellow-500 bg-opacity-10">
                        🤳
                      </div>
                      <div className="flex-1">
                        <label className="block text-lg font-semibold mb-1">
                          <span className="text-white">
                            Selfie Photo *
                          </span>
                        </label>
                        <p className="text-xs text-gray-500 mb-2">Clear face photo for verification</p>
                        <p className="text-xs text-yellow-400/80 mb-4">⚠️ Your face must match the photo on Aadhaar card</p>
                        
                        <div className="relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange('selfie', e.target.files?.[0] || null)}
                            disabled={!documents.aadhaar}
                            className="w-full px-4 py-3 bg-gray-900/50 border-2 border-dashed border-gray-700 rounded-xl text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-red-600 file:to-yellow-600 file:text-white hover:file:opacity-80 file:cursor-pointer cursor-pointer transition-all duration-300 hover:border-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                          />
                          {!documents.aadhaar && (
                            <p className="text-xs text-gray-500 mt-2">Please upload Aadhaar card first</p>
                          )}
                        </div>
                        
                        {/* Selfie Verification Status */}
                        {selfieVerifying && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-2"
                          >
                            <motion.span
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="text-blue-400 text-xl"
                            >
                              🔍
                            </motion.span>
                            <p className="text-blue-400 text-sm font-medium">
                              Comparing face with Aadhaar photo...
                            </p>
                          </motion.div>
                        )}
                        
                        {documents.selfie && !selfieVerifying && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2"
                          >
                            <span className="text-green-400 text-xl">✓</span>
                            <p className="text-green-400 text-sm font-medium flex-1">
                              {documents.selfie?.name}
                            </p>
                            <span className="text-xs text-green-400/70">
                              {(documents.selfie!.size / 1024).toFixed(1)} KB
                            </span>
                          </motion.div>
                        )}
                        
                        {/* Selfie Verification Result */}
                        {selfieVerification && !selfieVerifying && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-3 p-4 rounded-lg border ${
                              selfieVerification.passed 
                                ? 'bg-green-500/10 border-green-500/30' 
                                : 'bg-red-500/10 border-red-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className={`font-semibold ${
                                selfieVerification.passed ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {selfieVerification.passed ? '✓ Face Verified' : '✗ Face Mismatch'}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                selfieVerification.score >= 80 ? 'bg-green-500/20 text-green-400' :
                                selfieVerification.score >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                Score: {selfieVerification.score}/100
                              </span>
                            </div>
                            <div className="space-y-1">
                              {selfieVerification.flags.map((flag, i) => (
                                <p key={i} className="text-xs text-gray-400">• {flag}</p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                        
                        {errors.selfie && (
                          <motion.p 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-red-400 text-sm mt-2 flex items-center gap-1"
                          >
                            <span>⚠</span> {errors.selfie}
                          </motion.p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-between pt-6 gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBack}
                    className="group px-8 py-4 bg-gray-900/95 border-2 border-gray-700 rounded-xl text-white font-semibold hover:border-red-500/50 transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Back
                  </motion.button>
                  <motion.button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-10 py-4 text-lg font-bold bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-xl relative overflow-hidden group disabled:opacity-70"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        >
                          ⏳
                        </motion.span>
                        Processing...
                      </span>
                    ) : (
                      <span className="relative z-10 flex items-center gap-2">
                        🎭 Submit Application
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>
                </motion.div>
              </div>
            )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}



