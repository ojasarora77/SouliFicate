// app/components/SBTCertificates.tsx
'use client';

import { useState } from 'react';
import { useSBTContract } from '../hooks/useSBTContract';
import CertificateUpload from './CertificateUpload';
import CertificatePreview from './CertificatePreview';
import CertificateDetail from './CertificateDetail';

export default function SBTCertificates() {
  const {
    isOwner,
    certificates,
    loading,
    error,
    mintCertificate,
    approveCertificate,
    burnCertificate,
    refreshCertificates
  } = useSBTContract();

  const [studentAddress, setStudentAddress] = useState('');
  const [mintLoading, setMintLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<{[key: number]: boolean}>({});
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null);
  
  // File upload state
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Handle minting certificate
  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAddress) return;
    
    setMintLoading(true);
    try {
      // Mint the certificate on-chain
      const success = await mintCertificate(studentAddress);
      
      if (success) {
        // Handle file upload logic here
        setStudentAddress('');
        setCertificateFile(null);
        refreshCertificates();
      }
    } finally {
      setMintLoading(false);
    }
  };

  // Handle approving certificate
  const handleApprove = async (tokenId: number) => {
    setActionLoading(prev => ({ ...prev, [tokenId]: true }));
    try {
      const success = await approveCertificate(tokenId);
      if (success) {
        refreshCertificates();
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [tokenId]: false }));
    }
  };

  // Handle burning certificate
  const handleBurn = async (tokenId: number) => {
    setActionLoading(prev => ({ ...prev, [tokenId]: true }));
    try {
      const success = await burnCertificate(tokenId);
      if (success) {
        refreshCertificates();
      }
    } finally {
      setActionLoading(prev => ({ ...prev, [tokenId]: false }));
    }
  };

  // Handle file upload
  const handleFileUpload = (file: File) => {
    setCertificateFile(file);
  };

  return (
    
    <div className="p-6 max-w-4xl mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4">University Certificates</h2>
      
      {/* Certificate Instructions */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-medium mb-2 text-blue-800 dark:text-blue-300">How Certificates Work</h3>
        <p className="text-sm mb-2">
          Your certificates are Soulbound Tokens (SBTs) permanently linked to your wallet address. These tokens cannot be 
          transferred to other addresses, ensuring the authenticity of your credentials.
        </p>
        <p className="text-sm mb-0">
          <strong>Approving Certificates:</strong> When you click "Approve" on a certificate, you're acknowledging its receipt 
          and validity. This is a required step before a certificate can be updated or removed by the issuer. To view the full 
          certificate details and document, click on the certificate card or the "View Full" button.
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Mint Certificate Form (Admin Only) */}
      {isOwner && (
        <div className="mb-8 p-4 border border-gray-200 rounded-lg dark:border-gray-700">
          <h3 className="text-xl font-semibold mb-4">Mint New Certificate</h3>
          <form onSubmit={handleMint} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="studentAddress" className="block mb-2">
                Student Address
              </label>
              <input
                id="studentAddress"
                type="text"
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
                placeholder="0x..."
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                required
              />
            </div>
            
            {/* Certificate Upload Section */}
            <div>
              <label className="block mb-2">
                Certificate Document (Optional)
              </label>
              <CertificateUpload 
                onFileUpload={handleFileUpload} 
                isUploading={uploadingFile}
              />
            </div>
            
            {/* Certificate Preview */}
            {certificateFile && (
              <CertificatePreview file={certificateFile} />
            )}
            
            <button
              type="submit"
              disabled={mintLoading || !studentAddress}
              className="inline-flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {mintLoading ? 'Processing...' : 'Mint Certificate'}
            </button>
          </form>
        </div>
      )}

      {/* Certificate List */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Certificates</h3>
        
        {loading ? (
          <p>Loading certificates...</p>
        ) : certificates.length === 0 ? (
          <p>No certificates found.</p>
        ) : (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {certificates.map((tokenId) => (
              <div 
                key={tokenId} 
                className="p-4 border border-gray-200 rounded-lg dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-lg font-medium">Certificate #{tokenId}</h4>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full">
                    Soulbound
                  </span>
                </div>
                
                {/* Certificate Image Placeholder */}
                <div 
                  onClick={() => setSelectedCertificate(tokenId)}
                  className="aspect-[4/3] mb-4 bg-gray-100 dark:bg-gray-800 flex items-center justify-center rounded overflow-hidden cursor-pointer"
                >
                  <svg 
                    className="h-16 w-16 text-gray-400" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <rect x="8" y="12" width="8" height="6"/>
                  </svg>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm mb-1">
                    <span className="font-medium">Type:</span> University Certificate
                  </p>
                  <p className="text-sm mb-1">
                    <span className="font-medium">Token ID:</span> {tokenId.toString()}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Symbol:</span> UNI
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleApprove(tokenId)}
                    disabled={actionLoading[tokenId]}
                    className="py-1 px-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    {actionLoading[tokenId] ? 'Processing...' : 'Approve'}
                  </button>
                  
                  {isOwner && (
                    <button
                      onClick={() => handleBurn(tokenId)}
                      disabled={actionLoading[tokenId]}
                      className="py-1 px-3 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading[tokenId] ? 'Processing...' : 'Burn'}
                    </button>
                  )}
                  
                  <a 
                    href={`/certificate/${tokenId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1 px-3 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded hover:bg-blue-200 dark:hover:bg-blue-800 ml-auto"
                  >
                    View Full
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Certificate Detail Modal */}
        {selectedCertificate !== null && (
          <CertificateDetail
            tokenId={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
            onApprove={handleApprove}
            onBurn={isOwner ? handleBurn : undefined}
            isOwner={isOwner}
          />
        )}
      </div>
    </div>
  );
}