'use client';

import { useState, useRef } from 'react';

interface CertificateUploadProps {
  onFileUpload: (file: File) => void;
  isUploading?: boolean;
}

export default function CertificateUpload({ onFileUpload, isUploading = false }: CertificateUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  // Process the selected file
  const handleFile = (file: File) => {
    // Check if file is PDF, PNG, or JPG
    const fileType = file.type;
    if (
      fileType !== 'application/pdf' && 
      fileType !== 'image/png' && 
      fileType !== 'image/jpeg'
    ) {
      alert('Please upload a PDF, PNG, or JPG file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    onFileUpload(file);
  };

  // Trigger file input click
  const onButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full mb-4">
      <div 
        className={`p-4 border-2 border-dashed rounded-lg text-center cursor-pointer ${
          dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-700'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg"
          onChange={handleChange}
          disabled={isUploading}
        />
        
        {selectedFile ? (
          <div className="py-2">
            <p className="text-green-600 dark:text-green-400 font-medium">
              {selectedFile.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
              />
            </svg>
            <p className="mt-2 text-sm font-medium">
              Drag and drop your certificate file or click to browse
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              PDF, PNG, or JPG (max 5MB)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}