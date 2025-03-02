import { useState, useEffect, useCallback } from 'react';
import { useWalletClient, useAccount } from 'wagmi';
import { ethers } from 'ethers';

// SBT contract ABI 
const SBT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "initialOwner", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [{"internalType": "address", "name": "student", "type": "address"}],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "approveCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "student", "type": "address"}],
    "name": "studentCertificates",
    "outputs": [{"internalType": "uint256[]", "name": "", "type": "uint256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "tokenId", "type": "uint256"}],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Get contract address from environment variable or use a fallback for development
const SBT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS || "YOUR_CONTRACT_ADDRESS_HERE";

export function useSBTContract() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [certificates, setCertificates] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const getContract = useCallback(() => {
    if (!walletClient) return null;
    
    const provider = new ethers.BrowserProvider(walletClient.transport);

    return new ethers.Contract(SBT_CONTRACT_ADDRESS, SBT_ABI, provider);
  }, [walletClient]);

  // to check if current user is the contract owner
  const checkOwnership = useCallback(async () => {
    try {
      if (!address || !walletClient) return;
      
      const contract = getContract();
      if (!contract) return;
      
      // returns the contract owner
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
      if (!address || !walletClient) return;
      
      setLoading(true);
      const contract = getContract();
      if (!contract) return;
      
      // Call the studentCertificates function
      const certs = await contract.studentCertificates(address);
      setCertificates(certs.map((c: any) => Number(c)));
      setLoading(false);
    } catch (err) {
      console.error("Error fetching certificates:", err);
      setError("Failed to fetch certificates");
      setLoading(false);
    }
  }, [address, walletClient, getContract]);

  // Mint a new certificate (owner only i.e the university address: contract deployer by defualt)
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

  // Approve a certificate by the university address 
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