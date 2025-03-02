'use client';

import { useState, useEffect } from 'react';

interface CertificatePreviewProps {
  file: File | null;
}

export default function CertificatePreview({ file }: CertificatePreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setFileType(null);
      return;
    }

    // Set file type
    setFileType(file.type);
    
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Clean up on unmount
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!file || !previewUrl) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <div className="bg-gray-100 dark:bg-gray-800 p-2 border-b border-gray-200 dark:border-gray-700">
        <h4 className="font-medium">Certificate Preview</h4>
      </div>
      
      <div className="p-4">
        {fileType?.startsWith('image/') ? (
          <img 
            src={previewUrl} 
            alt="Certificate Preview" 
            className="max-h-96 mx-auto rounded"
          />
        ) : fileType === 'application/pdf' ? (
          <div className="relative h-96 w-full">
            <iframe 
              src={`${previewUrl}#toolbar=0`} 
              className="absolute inset-0 w-full h-full"
              title="PDF Preview"
            />
          </div>
        ) : (
          <div className="text-center p-8 text-gray-500 dark:text-gray-400">
            This file type cannot be previewed
          </div>
        )}
      </div>
    </div>
  );
}