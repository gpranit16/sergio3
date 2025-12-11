'use client';

import { useState } from 'react';
import GlassCard from '@/components/GlassCard';
import GradientButton from '@/components/GradientButton';
import WaterBlobBackground from '@/components/WaterBlobBackground';

export default function TestVerification() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(selectedFile);
            setResult(null);
        }
    };

    const handleVerify = async () => {
        if (!file) return;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('aadhaar', file);
            formData.append('fullName', 'Nikhil Kumar');
            formData.append('aadhaarName', 'Nikhil Kumar');
            formData.append('age', '35');

            const response = await fetch('/api/verify-aadhaar', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Verification error:', error);
            setResult({ error: 'Verification failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen relative overflow-hidden py-12 px-4">
            <WaterBlobBackground />

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-neon-purple to-neon-blue bg-clip-text text-transparent">
                        Aadhaar Verification Test
                    </h1>
                    <p className="text-gray-400">Test the document authentication system</p>
                </div>

                <GlassCard>
                    <div className="space-y-6">
                        {/* File Upload */}
                        <div>
                            <label className="block text-white font-semibold mb-2">
                                Upload Aadhaar Card
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-400
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-neon-purple file:text-white
                  hover:file:bg-purple-600 cursor-pointer"
                            />
                        </div>

                        {/* Preview */}
                        {preview && (
                            <div>
                                <p className="text-white font-semibold mb-2">Preview:</p>
                                <img
                                    src={preview}
                                    alt="Aadhaar preview"
                                    className="max-w-md rounded-lg border-2 border-glass-border"
                                />
                            </div>
                        )}

                        {/* Verify Button */}
                        <GradientButton
                            onClick={handleVerify}
                            disabled={!file || loading}
                            className="w-full"
                        >
                            {loading ? 'Verifying...' : 'Verify Document'}
                        </GradientButton>

                        {/* Results */}
                        {result && (
                            <div className="mt-6 p-6 rounded-lg bg-glass-bg border border-glass-border">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-3xl">
                                        {result.passed ? '✅' : '❌'}
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">
                                            {result.passed ? 'VERIFICATION PASSED' : 'VERIFICATION FAILED'}
                                        </h3>
                                        <p className="text-gray-400">
                                            Score: {result.score}/100 | Risk: {result.fraudRiskLevel}
                                        </p>
                                    </div>
                                </div>

                                {/* Flags */}
                                <div className="space-y-2">
                                    <p className="text-white font-semibold mb-2">Details:</p>
                                    {result.flags?.map((flag: string, index: number) => (
                                        <div
                                            key={index}
                                            className="text-sm text-gray-300 bg-black/30 p-2 rounded"
                                        >
                                            {flag}
                                        </div>
                                    ))}
                                </div>

                                {/* Details */}
                                {result.details && (
                                    <div className="mt-4 pt-4 border-t border-glass-border">
                                        <p className="text-white font-semibold mb-2">Technical Details:</p>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div>
                                                <span className="text-gray-400">Name Similarity:</span>
                                                <span className="text-white ml-2">
                                                    {(result.details.nameSimilarity * 100).toFixed(1)}%
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-400">Age Match:</span>
                                                <span className="text-white ml-2">
                                                    {result.details.ageMatch ? 'Yes' : 'No'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {result.error && (
                                    <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded">
                                        <p className="text-red-400">{result.error}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </GlassCard>

                {/* Instructions */}
                <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                    <p className="text-blue-300 text-sm">
                        <strong>Test Instructions:</strong>
                        <br />
                        1. Upload the genuine Nikhil Kumar Aadhaar card → Should PASS with 90-100 score
                        <br />
                        2. Upload a fake/AI-generated Aadhaar → Should FAIL with low score
                        <br />
                        3. Upload a different person's Aadhaar → Should FAIL (image mismatch)
                    </p>
                </div>
            </div>
        </main>
    );
}
