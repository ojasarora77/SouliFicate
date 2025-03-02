// app/verify/page.tsx
'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ethers } from 'ethers';

// SBT contract ABI (minimal for verification)
const VERIFY_ABI = [
  "function ownerOf(uint256 tokenId) external view returns (address)"
];

// Contract address from env
const SBT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS || '';

export default function VerifyCertificate() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tokenId, setTokenId] = useState(searchParams?.get('id') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<{
    isValid: boolean;
    owner?: string;
    timestamp?: string;
  } | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tokenId || !tokenId.trim()) {
      setError('Please enter a valid certificate ID');
      return;
    }

    setLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      // Create a provider for Base network
      const provider = new ethers.JsonRpcProvider('https://sepolia.base.org');
      
      // Create contract instance
      const contract = new ethers.Contract(SBT_CONTRACT_ADDRESS, VERIFY_ABI, provider);
      
      // Try to get the owner of the token
      const owner = await contract.ownerOf(tokenId);
      
      // If we get here, the token exists and is owned by someone
      setVerificationResult({
        isValid: true,
        owner,
        timestamp: new Date().toISOString()
      });
      
    } catch (err) {
      console.error('Verification error:', err);
      
      // Check if the error is because the token doesn't exist
      const error = err as any;
      if (error?.code === 'CALL_EXCEPTION' || error?.message?.includes('nonexistent token')) {
        setVerificationResult({
          isValid: false,
          timestamp: new Date().toISOString()
        });
      } else {
        setError('An error occurred during verification. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle view certificate
  const handleViewCertificate = () => {
    router.push(`/certificate/${tokenId}`);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Certificate Verification</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Verify the authenticity of a blockchain certificate
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="mb-4">
                <label htmlFor="tokenId" className="block mb-2 font-medium">
                  Certificate ID
                </label>
                <div className="flex">
                  <input
                    type="text"
                    id="tokenId"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                    placeholder="Enter the certificate ID"
                    className="flex-grow p-2 border border-gray-300 rounded-l dark:bg-gray-800 dark:border-gray-600"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded">
                {error}
              </div>
            )}

            {verificationResult && (
              <div className={`mb-6 p-4 rounded ${
                verificationResult.isValid 
                  ? 'bg-green-100 dark:bg-green-900/20' 
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                <div className="flex items-center mb-4">
                  {verificationResult.isValid ? (
                    <>
                      <svg 
                        className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">Certificate is Valid</h3>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          This certificate exists on the blockchain and is authentic.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <svg 
                        className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Invalid Certificate</h3>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          This certificate does not exist on the blockchain.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {verificationResult.isValid && (
                  <>
                    <div className="mb-4 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                      <div className="mb-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Owner Address:</span>
                        <div className="font-mono text-xs break-all">{verificationResult.owner}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Token ID:</span>
                        <div className="font-mono">{tokenId}</div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleViewCertificate}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      View Certificate
                    </button>
                  </>
                )}
                
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Verification timestamp: {new Date(verificationResult.timestamp || '').toLocaleString()}
                </div>
              </div>
            )}
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <h4 className="font-medium mb-2">How verification works:</h4>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Enter the certificate ID (token ID) from the certificate</li>
                <li>Our system checks if the certificate exists on the Base blockchain</li>
                <li>If found, the certificate is verified as authentic</li>
                <li>The owner address and timestamp are displayed for additional verification</li>
              </ol>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm">
              University Certificate SBT — Blockchain-verified credentials
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}