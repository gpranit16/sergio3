'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import WaterBlobBackground from '@/components/WaterBlobBackground';
import GlassCard from '@/components/GlassCard';
import GradientButton from '@/components/GradientButton';

export default function KYCPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get('applicationId');

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedDocs, setUploadedDocs] = useState({
    aadhaar: null as File | null,
    pan: null as File | null,
    selfie: null as File | null,
  });

  const [previews, setPreviews] = useState({
    aadhaar: '',
    pan: '',
    selfie: '',
  });

  const handleFileSelect = (type: 'aadhaar' | 'pan' | 'selfie', file: File) => {
    setUploadedDocs((prev) => ({ ...prev, [type]: file }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviews((prev) => ({ ...prev, [type]: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!uploadedDocs.aadhaar || !uploadedDocs.pan || !uploadedDocs.selfie) {
      alert('Please upload all required documents');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('aadhaar', uploadedDocs.aadhaar);
      formData.append('pan', uploadedDocs.pan);
      formData.append('selfie', uploadedDocs.selfie);
      if (applicationId) {
        formData.append('applicationId', applicationId);
      }

      const response = await fetch('/api/kyc/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/kyc/verification?sessionId=${data.sessionId}`);
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (error) {
      alert('Failed to upload documents');
    } finally {
      setLoading(false);
    }
  };

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
            KYC Verification
          </h1>
          <p className="text-gray-400">Upload your documents for instant verification</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <Step number={1} label="Aadhaar" active={currentStep >= 1} />
            <div className="w-12 h-0.5 bg-glass-border" />
            <Step number={2} label="PAN Card" active={currentStep >= 2} />
            <div className="w-12 h-0.5 bg-glass-border" />
            <Step number={3} label="Selfie" active={currentStep >= 3} />
          </div>
        </div>

        <GlassCard hover={false}>
          <div className="space-y-8">
            {/* Aadhaar Upload */}
            <DocumentUpload
              title="Aadhaar Card"
              description="Upload a clear photo of your Aadhaar card (front side)"
              icon="🪪"
              file={uploadedDocs.aadhaar}
              preview={previews.aadhaar}
              onFileSelect={(file) => {
                handleFileSelect('aadhaar', file);
                setCurrentStep(Math.max(currentStep, 2));
              }}
            />

            {/* PAN Upload */}
            <DocumentUpload
              title="PAN Card"
              description="Upload a clear photo of your PAN card"
              icon="💳"
              file={uploadedDocs.pan}
              preview={previews.pan}
              onFileSelect={(file) => {
                handleFileSelect('pan', file);
                setCurrentStep(Math.max(currentStep, 3));
              }}
            />

            {/* Selfie Upload */}
            <DocumentUpload
              title="Selfie"
              description="Take a clear selfie for face verification"
              icon="📸"
              file={uploadedDocs.selfie}
              preview={previews.selfie}
              onFileSelect={(file) => handleFileSelect('selfie', file)}
              isSelfie
            />

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <GradientButton
                onClick={handleSubmit}
                disabled={loading || !uploadedDocs.aadhaar || !uploadedDocs.pan || !uploadedDocs.selfie}
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
                  'Submit for Verification'
                )}
              </GradientButton>

              <GradientButton onClick={() => router.push('/')} variant="secondary">
                Cancel
              </GradientButton>
            </div>
          </div>
        </GlassCard>

        {/* Security Notice */}
        <motion.div
          className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-blue-300 text-sm">
            🔒 Your documents are encrypted and securely stored. We use advanced OCR and AI verification.
          </p>
        </motion.div>
      </div>
    </main>
  );
}

function Step({ number, label, active }: { number: number; label: string; active: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
          active
            ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-neon-purple'
            : 'bg-gray-700 text-gray-400'
        }`}
      >
        {number}
      </div>
      <span className={`text-xs mt-1 ${active ? 'text-white' : 'text-gray-500'}`}>{label}</span>
    </div>
  );
}

function DocumentUpload({
  title,
  description,
  icon,
  file,
  preview,
  onFileSelect,
  isSelfie = false,
}: {
  title: string;
  description: string;
  icon: string;
  file: File | null;
  preview: string;
  onFileSelect: (file: File) => void;
  isSelfie?: boolean;
}) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      onFileSelect(droppedFile);
    }
  };

  return (
    <div className="border-2 border-dashed border-glass-border rounded-xl p-6 hover:border-neon-purple transition-all">
      <div className="flex items-start gap-4">
        <span className="text-4xl">{icon}</span>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white mb-1">{title}</h3>
          <p className="text-gray-400 text-sm mb-4">{description}</p>

          {preview ? (
            <div className="relative">
              <img src={preview} alt={title} className="w-full max-w-xs rounded-lg border border-glass-border" />
              <button
                onClick={() => onFileSelect(null as any)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
              >
                ✕
              </button>
              <div className="mt-2 text-green-400 text-sm flex items-center gap-2">
                ✓ {file?.name}
              </div>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-neon-purple transition-all cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById(`upload-${title}`)?.click()}
            >
              <p className="text-gray-400 mb-2">
                {isSelfie ? '📸 Click to take/upload selfie' : '📁 Click or drag to upload'}
              </p>
              <p className="text-gray-500 text-xs">Supports: JPG, PNG (Max 5MB)</p>
            </div>
          )}

          <input
            type="file"
            id={`upload-${title}`}
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0];
              if (selectedFile) onFileSelect(selectedFile);
            }}
            capture={isSelfie ? 'user' : undefined}
          />
        </div>
      </div>
    </div>
  );
}
