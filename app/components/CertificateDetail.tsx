// app/components/CertificateDetail.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import CertificateMetadata, { CertificateMetadataType } from './CertificateMetadata';

interface CertificateDetailProps {
  tokenId: number;
  onClose: () => void;
  onApprove: (tokenId: number) => Promise<void>;
  onBurn?: (tokenId: number) => Promise<void>;
  isOwner: boolean;
}

export default function CertificateDetail({
  tokenId,
  onClose,
  onApprove,
  onBurn,
  isOwner
}: CertificateDetailProps) {
  const { address } = useAccount();
  const [loading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);
  const [metadata, setMetadata] = useState<CertificateMetadataType | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata'>('preview');

  // Get certificate document from storage
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Import is inside useEffect to avoid SSR issues
    import('../services/certificateStorage').then(module => {
      const certificateStorage = module.default;
      const url = certificateStorage.getCertificate(tokenId);
      setCertificateUrl(url);
    });
    
    // Load metadata from localStorage if available
    const storedMetadata = localStorage.getItem(`certificate-${tokenId}`);
    if (storedMetadata) {
      try {
        setMetadata(JSON.parse(storedMetadata));
      } catch (e) {
        console.error('Error parsing stored metadata:', e);
      }
    }
  }, [tokenId]);

  // Handle approve action
  const handleApprove = async () => {
    setActionInProgress(true);
    try {
      await onApprove(tokenId);
    } finally {
      setActionInProgress(false);
    }
  };

  // Handle burn action
  const handleBurn = async () => {
    if (!onBurn) return;
    
    setActionInProgress(true);
    try {
      await onBurn(tokenId);
      onClose(); // Close the modal after burning
    } finally {
      setActionInProgress(false);
    }
  };
  
  // Handle metadata save
  const handleMetadataSave = async (newMetadata: CertificateMetadataType) => {
    try {
      // In a real app, you would save this to a database or blockchain
      setMetadata(newMetadata);
      return true;
    } catch (e) {
      console.error('Failed to save metadata:', e);
      return false;
    }
  };
  
  // Handle sharing
  const handleShare = () => {
    const url = `${window.location.origin}/certificate/${tokenId}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'University Certificate',
        text: 'Check out my blockchain verified certificate!',
        url: url,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(url);
      alert('Certificate URL copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full p-6 my-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Certificate #{tokenId}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`py-2 px-4 ${
              activeTab === 'preview'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            Certificate Preview
          </button>
          <button
            className={`py-2 px-4 ${
              activeTab === 'metadata'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 dark:text-gray-400'
            }`}
            onClick={() => setActiveTab('metadata')}
          >
            Certificate Details
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === 'preview' ? (
            <>
              {/* Certificate Preview Tab */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs rounded-full">
                    Soulbound Token
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center text-sm"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share
                </button>
              </div>

              {/* Certificate Document Preview */}
              <div className="mb-6 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
                {certificateUrl ? (
                  <div className="aspect-[16/9] relative">
                    {certificateUrl.startsWith('data:image/') ? (
                      <img 
                        src={certificateUrl} 
                        alt="Certificate Document" 
                        className="w-full h-full object-contain"
                      />
                    ) : certificateUrl.startsWith('data:application/pdf') ? (
                      <iframe 
                        src={certificateUrl} 
                        className="w-full h-full" 
                        title="Certificate PDF"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p>Preview not available</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-[16/9] flex items-center justify-center">
                    <div className="text-center p-6">
                      <svg 
                        className="mx-auto h-12 w-12 text-gray-400" 
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
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        No certificate document uploaded
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Certificate Basic Info */}
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                    <p className="font-medium">Academic Credential</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Collection</p>
                    <p className="font-medium">University Certificate (UNI)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Token ID</p>
                    <p className="font-medium">{tokenId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Transferable</p>
                    <p className="font-medium">No (Soulbound)</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Issue Date</p>
                    <p className="font-medium">{metadata?.issueDate ? new Date(metadata.issueDate).toLocaleDateString() : new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Owner</p>
                    <p className="font-medium font-mono text-xs">{address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '...'}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Metadata Tab
            <CertificateMetadata 
              tokenId={tokenId} 
              metadata={metadata} 
              isEditable={isOwner}
              onSave={handleMetadataSave}
            />
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-4">
            <button
              onClick={handleApprove}
              disabled={actionInProgress || loading}
              className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md disabled:opacity-50"
            >
              {actionInProgress ? 'Processing...' : 'Approve Certificate'}
            </button>

            {isOwner && onBurn && (
              <button
                onClick={handleBurn}
                disabled={actionInProgress || loading}
                className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md disabled:opacity-50"
              >
                {actionInProgress ? 'Processing...' : 'Burn Certificate'}
              </button>
            )}
          </div>

          <div className="text-center mt-4">
            <a
              href={`/certificate/${tokenId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
            >
              View Full Certificate Page
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}