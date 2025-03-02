// app/demo-certificate/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DemoCertificateView() {
  const [showVerification, setShowVerification] = useState(false);
  
  const certificateData = {
    id: "2815",
    title: "Blockchain Development Fundamentals",
    recipient: "John Anderson",
    issueDate: "September 15, 2023",
    institution: "University of Southampton",
    instructors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez"],
    skills: ["Smart Contracts", "Solidity", "Web3", "DApps", "Blockchain Security"],
    description: "This certificate is awarded for successfully completing the Blockchain Development Fundamentals course, demonstrating proficiency in blockchain technology concepts and smart contract development.",
    grade: "A",
    tokenId: "5",
    txHash: "0x7e5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4"
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
          <div className="flex gap-3">
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
              </svg>
              Print
            </button>
            <button 
              onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Certificate URL copied to clipboard!'); }}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
              Share
            </button>
          </div>
        </div>

        {/* Certificate Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
          
          <div className="p-8 md:p-12 border-b border-gray-200 dark:border-gray-700">
            <div className="text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-3xl font-bold">S</span>
              </div>
              <h1 className="text-3xl font-bold mb-1">Certificate of Achievement</h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">SouliFicate Blockchain Verified Credential</p>
            </div>
            
            <div className="text-center my-12">
              <p className="text-xl mb-2">This certifies that</p>
              <h2 className="text-3xl font-bold mb-6">{certificateData.recipient}</h2>
              <p className="text-xl mb-2">has successfully completed</p>
              <h3 className="text-2xl font-bold mb-6">{certificateData.title}</h3>
              <p className="text-lg">
                Issued on <span className="font-semibold">{certificateData.issueDate}</span> by <span className="font-semibold">{certificateData.institution}</span>
              </p>
            </div>
            
            <div className="flex justify-between items-center mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Certificate ID</p>
                <p className="font-medium">{certificateData.id}</p>
              </div>
              <div>
                <div className="flex items-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                  <p className="font-medium text-green-600 dark:text-green-400">Blockchain Verified</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">Certificate Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recipient</p>
                  <p className="font-medium">{certificateData.recipient}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Issue Date</p>
                  <p className="font-medium">{certificateData.issueDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Institution</p>
                  <p className="font-medium">{certificateData.institution}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Grade</p>
                  <p className="font-medium">{certificateData.grade}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">Description</h4>
              <p className="text-gray-700 dark:text-gray-300">
                {certificateData.description}
              </p>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-medium mb-4">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {certificateData.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Verification Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
          <button 
            className="w-full p-4 text-left flex justify-between items-center font-medium border-b border-gray-200 dark:border-gray-700"
            onClick={() => setShowVerification(!showVerification)}
          >
            <span>Blockchain Verification</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${showVerification ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {showVerification && (
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                  <h4 className="text-lg font-medium mb-4">Certificate Authentication</h4>
                  <p className="mb-4 text-gray-700 dark:text-gray-300">
                    This certificate is secured as a Soulbound Token (SBT) on the Base blockchain.
                    SBTs are non-transferable tokens that represent achievements, credentials, or affiliations.
                  </p>
                  
                  <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
                    <div className="grid grid-cols-1 gap-y-2">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Contract Address</span>
                        <span className="font-mono text-xs break-all">0x7e5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Token ID</span>
                        <span className="font-mono">{certificateData.tokenId}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Hash</span>
                        <span className="font-mono text-xs break-all">{certificateData.txHash}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                    <p className="font-medium text-green-600 dark:text-green-400">Verified on-chain</p>
                  </div>
                </div>
                
                <div className="md:w-1/3 flex flex-col items-center">
                  <h4 className="text-lg font-medium mb-4 text-center">Scan to Verify</h4>
                  <div className="p-3 bg-white border w-40 h-40 flex items-center justify-center">
                    {/* Placeholder for QR code */}
                    <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cGF0aCBkPSJNMCAwaDgwdjgwSDB6bTIwIDIwaDQwdjQwSDIwem0xMDAgLTIwaDgwdjgwaC04MHptMjAgMjBoNDB2NDBoLTQwek0wIDEwMGg4MHY4MEgwem0yMCAyMGg0MHY0MEgyMHptNjAgLTYwaDIwdjIwaC0yMHptMjAgMjBoMjB2MjBoLTIwek04MCAxMjBoMjB2MjBoLTIwem0yMCAtMjBoMjB2MjBoLTIwem0yMCAwaDIwdjIwaC0yMHptMjAgLTIwaDIwdjIwaC0yMHptMCAtMjBoMjB2MjBoLTIwem0yMCA0MGgyMHYyMGgtMjB6bTIwIC00MGgxMHYxMGgtMTB6bS0yMCAxMDBoMjB2MjBoLTIwem0yMCAtMjBoMjB2MjBoLTIwem0tNDAgMjBoMjB2MjBoLTIweiIgc3R5bGU9ImZpbGw6IzAwMCIvPjwvc3ZnPg==')]">
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                    Scan or click to verify<br />on the blockchain
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}