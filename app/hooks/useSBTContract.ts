import { useState, useEffect, useCallback } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { ethers } from 'ethers';
import contractArtifact from '/Users/ojasarora/SouliFicate/artifacts/app/contracts/sbt.sol/SBT.json';

// SBT contract ABI 
const SBT_ABI = contractArtifact.abi;

// Get contract address from environment variable or use a fallback for development
const SBT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS || "YOUR_CONTRACT_ADDRESS_HERE";

export function useSBTContract() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [certificates, setCertificates] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create contract instance
  const getContract = useCallback(() => {
    if (!walletClient) return null;
    
    // Create a new provider using the walletClient's transport
    const provider = new ethers.BrowserProvider(walletClient.transport);
    
    // Create a contract instance
    return new ethers.Contract(SBT_CONTRACT_ADDRESS, SBT_ABI, provider);
  }, [walletClient]);

  // Check if current user is the contract owner
  const checkOwnership = useCallback(async () => {
    try {
      if (!address || !walletClient) return;
      
      const contract = getContract();
      if (!contract) return;
      
      // Get the contract owner
      const owner = await contract.owner();
      setIsOwner(owner.toLowerCase() === address.toLowerCase());
    } catch (err) {
      console.error("Error checking ownership:", err);
      setError("Failed to check contract ownership");
    }
  }, [address, walletClient, getContract]);

  // Fetch student certificates
  const fetchCertificates = useCallback(async () => {
    try {
      if (!address || !walletClient) return [];
      
      setLoading(true);
      const contract = getContract();
      if (!contract) return [];
      
      try {
        // Call the studentCertificates function
        const certs = await contract.studentCertificates(address);
        const certArray = certs.map((c: any) => Number(c));
        setCertificates(certArray);
        setLoading(false);
        return certArray;
      } catch (error: unknown) {
        console.warn("Error getting certificates, might be empty:", error);
        // Assume no certificates if we get a BAD_DATA error
        const err = error as any; // Type assertion
        if (err.code === 'BAD_DATA' && err.value === '0x') {
          setCertificates([]);
          return [];
        } else {
          throw error; // re-throw if it's a different error
        }
      }
    } catch (error: unknown) {
      console.error("Error fetching certificates:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setError(`Failed to fetch certificates: ${errorMessage}`);
      setLoading(false);
      return [];
    }
  }, [address, walletClient, getContract]);

  // Mint a new certificate (owner only)
  const mintCertificate = useCallback(async (studentAddress: string) => {
    try {
      if (!walletClient || !isOwner) return false;
      
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(SBT_CONTRACT_ADDRESS, SBT_ABI, signer);
      
      const tx = await contract.mint(studentAddress);
      await tx.wait();
      return true;
    } catch (err) {
      console.error("Error minting certificate:", err);
      setError("Failed to mint certificate");
      return false;
    }
  }, [walletClient, isOwner]);

  // Approve a certificate
  const approveCertificate = useCallback(async (tokenId: number) => {
    try {
      if (!walletClient || !address) return false;
      
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(SBT_CONTRACT_ADDRESS, SBT_ABI, signer);
      
      const tx = await contract.approveCertificate(tokenId);
      await tx.wait();
      return true;
    } catch (err) {
      console.error("Error approving certificate:", err);
      setError("Failed to approve certificate");
      return false;
    }
  }, [walletClient, address]);

  // Burn a certificate (owner only)
  const burnCertificate = useCallback(async (tokenId: number) => {
    try {
      if (!walletClient || !isOwner) return false;
      
      const provider = new ethers.BrowserProvider(walletClient.transport);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(SBT_CONTRACT_ADDRESS, SBT_ABI, signer);
      
      const tx = await contract.burn(tokenId);
      await tx.wait();
      return true;
    } catch (err) {
      console.error("Error burning certificate:", err);
      setError("Failed to burn certificate");
      return false;
    }
  }, [walletClient, isOwner]);

  // Initialize data
  useEffect(() => {
    if (address && walletClient) {
      checkOwnership();
      fetchCertificates();
    }
  }, [address, walletClient, checkOwnership, fetchCertificates]);

  return {
    isOwner,
    certificates,
    loading,
    error,
    mintCertificate,
    approveCertificate,
    burnCertificate,
    refreshCertificates: fetchCertificates
  };
}