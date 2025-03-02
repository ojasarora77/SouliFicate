// app/certificate/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAccount } from 'wagmi';
import CertificateTemplate from '/Users/ojasarora/SouliFicate/app/components/certificate-template';

export default function CertificateView() {
  const params = useParams();
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [certificateData, setCertificateData] = useState<any>(null);
  const [studentName, setStudentName] = useState('Certificate Holder');
  
  const certificateId = params?.id as string;
  
  useEffect(() => {
    const fetchCertificateData = async () => {
      setLoading(true);
      
      try {
        // In a real app, you would fetch the certificate data from your backend or blockchain
        // This is just a simple simulation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setCertificateData({
          id: certificateId,
          studentAddress: address,
          issueDate: new Date().toLocaleDateString(),
          course: 'Blockchain Development Fundamentals',
          issuer: 'University Blockchain Program'
        });
        
        // Get ENS name or use shortened address
        if (address) {
          // In a real app, you would check ENS name
          // Here we're just shortening the address
          const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
          setStudentName(shortenedAddress);
        }
        
      } catch (err) {
        console.error('Error fetching certificate:', err);
        setError('Could not load certificate data');
      } finally {
        setLoading(false);
      }
    };
    
    if (certificateId) {
      fetchCertificateData();
    }
  }, [certificateId, address]);
  
  // Handle PDF download
  const handleDownload = () => {
    // In a real app, you would generate a PDF and download it
    // This is a placeholder alert
    alert('PDF download feature would be implemented here');
  };
  
  // Handle sharing
  const handleShare = () => {
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Blockchain Certificate',
        text: 'Check out my blockchain verified certificate!',
        url: url,
      });
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(url);
      alert('Certificate URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md rounded-lg bg-red-50 dark:bg-red-900/20">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold mb-2">Certificate Viewer</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Blockchain verified credential #{certificateId}
            </p>
          </div>
          
          <div className="flex space-x-4 mt-4 md:mt-0">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download PDF
            </button>
            
            <button
              onClick={handleShare}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-[16/9] overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
            <CertificateTemplate 
              studentName={studentName} 
              issueDate={certificateData?.issueDate} 
              tokenId={certificateId}
            />
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-lg mb-2">Certificate Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Token ID</p>
                <p className="font-medium">{certificateId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Issue Date</p>
                <p className="font-medium">{certificateData?.issueDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Course</p>
                <p className="font-medium">{certificateData?.course}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Issuer</p>
                <p className="font-medium">{certificateData?.issuer}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h3 className="font-semibold text-lg mb-2">Blockchain Verification</h3>
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-grow">
                <p className="text-sm mb-4">
                  This certificate is stored as a Soulbound Token (SBT) on the Base blockchain network.
                  SBTs are non-transferable NFTs that represent achievements, credentials, or affiliations.
                </p>
                <div className="flex items-center mb-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-green-600 dark:text-green-400 font-medium">Verified on-chain</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Contract Address: {process.env.NEXT_PUBLIC_SBT_CONTRACT_ADDRESS}
                </p>
              </div>
              
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <div className="mb-2 text-center text-sm font-medium">Scan to Verify</div>
                {/* We'll replace this with a real QR code component */}
                <div className="w-32 h-32 bg-gray-100 border flex items-center justify-center">
                  <p className="text-xs text-gray-500">QR Code</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}