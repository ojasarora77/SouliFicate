'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';

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
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  // Get certificate document from storage
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Import is inside useEffect to avoid SSR issues
    import('../services/certificateStorage').then(module => {
      const certificateStorage = module.default;
      const url = certificateStorage.getCertificate(tokenId);
      setCertificateUrl(url);
    });
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Certificate Details</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-lg font-semibold">University Certificate</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Token ID: {tokenId}</p>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 text-xs rounded-full">
              Soulbound
            </span>
          </div>

          {/* Certificate Document Preview */}
          <div className="mb-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
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

          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Type:</span>
                <span>Academic Credential</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Collection:</span>
                <span>University Certificate (UNI)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Transferable:</span>
                <span>No (Soulbound)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Issue Date:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

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
        </div>
      </div>
    </div>
  );
}
