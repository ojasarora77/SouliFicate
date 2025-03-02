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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
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