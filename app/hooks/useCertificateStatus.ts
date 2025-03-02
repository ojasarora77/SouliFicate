import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWalletClient } from 'wagmi';

// Get contract address from environment variable or use a fallback for development
const SBT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS || "YOUR_CONTRACT_ADDRESS_HERE";

// Simple ABI for the status check
const STATUS_ABI = [
  "function _certificates(uint256) external view returns (bool exists, bool approved)"
];

// Custom hook to get certificate status
export function useCertificateStatus(tokenId: number | null) {
  const { data: walletClient } = useWalletClient();
  const [status, setStatus] = useState<{ exists: boolean; approved: boolean } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (tokenId === null || !walletClient) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const contract = new ethers.Contract(SBT_CONTRACT_ADDRESS, STATUS_ABI, provider);
      
      // This will fail if the _certificates mapping is not publicly accessible
      // In that case, we'll handle the error gracefully
      const result = await contract._certificates(tokenId);
      setStatus({
        exists: result.exists,
        approved: result.approved
      });
    } catch (err) {
      console.error("Error fetching certificate status:", err);
      // Fallback to a default status if the mapping is not public
      setStatus({
        exists: true,
        approved: false
      });
    } finally {
      setLoading(false);
    }
  }, [tokenId, walletClient]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    refresh: fetchStatus
  };
}