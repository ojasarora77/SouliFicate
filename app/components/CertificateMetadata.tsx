// app/components/CertificateMetadata.tsx
'use client';

import { useState, useEffect } from 'react';

export interface CertificateMetadataType {
  name: string;
  description: string;
  course?: string;
  issueDate: string;
  expirationDate?: string;
  issuer: string;
  recipient: string;
  grade?: string;
  skills?: string[];
  additionalDetails?: Record<string, string>;
}

interface CertificateMetadataProps {
  tokenId: number;
  metadata?: CertificateMetadataType;
  isEditable?: boolean;
  onSave?: (metadata: CertificateMetadataType) => Promise<boolean>;
}

// Default metadata template
const DEFAULT_METADATA: CertificateMetadataType = {
  name: 'University Certificate',
  description: 'This certificate verifies the successful completion of a course or program',
  course: 'Blockchain Development Fundamentals',
  issueDate: new Date().toISOString().split('T')[0],
  issuer: 'University Blockchain Program',
  recipient: 'Certificate Holder',
  grade: 'A',
  skills: ['Blockchain', 'Smart Contracts', 'Web3'],
  additionalDetails: {
    'Credit Hours': '3',
    'Program': 'Computer Science'
  }
};

export default function CertificateMetadata({
  tokenId,
  metadata: initialMetadata,
  isEditable = false,
  onSave
}: CertificateMetadataProps) {
  const [metadata, setMetadata] = useState<CertificateMetadataType>(initialMetadata || DEFAULT_METADATA);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Store metadata in localStorage for demo purposes
  useEffect(() => {
    // Try to load metadata from localStorage
    const storedMetadata = localStorage.getItem(`certificate-${tokenId}`);
    if (storedMetadata) {
      try {
        setMetadata(JSON.parse(storedMetadata));
      } catch (e) {
        console.error('Error parsing stored metadata:', e);
      }
    }
  }, [tokenId]);
  
  // Handle saving metadata
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Store in localStorage for demo purposes
      localStorage.setItem(`certificate-${tokenId}`, JSON.stringify(metadata));
      
      // Call onSave callback if provided
      if (onSave) {
        await onSave(metadata);
      }
      
      setIsEditing(false);
    } catch (e) {
      console.error('Error saving metadata:', e);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle input change
  const handleChange = (field: keyof CertificateMetadataType, value: any) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle skills change
  const handleSkillsChange = (skillsStr: string) => {
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    setMetadata(prev => ({
      ...prev,
      skills
    }));
  };

  // Handle additional details change
  const handleAdditionalDetailChange = (key: string, value: string) => {
    setMetadata(prev => ({
      ...prev,
      additionalDetails: {
        ...prev.additionalDetails,
        [key]: value
      }
    }));
  };

  // Add a new additional detail field
  const addAdditionalDetail = () => {
    setMetadata(prev => ({
      ...prev,
      additionalDetails: {
        ...prev.additionalDetails,
        ['New Field']: ''
      }
    }));
  };

  // Remove an additional detail field
  const removeAdditionalDetail = (key: string) => {
    if (!metadata.additionalDetails) return;
    
    const newDetails = { ...metadata.additionalDetails };
    delete newDetails[key];
    
    setMetadata(prev => ({
      ...prev,
      additionalDetails: newDetails
    }));
  };
  
  if (isEditing && isEditable) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="font-medium">Edit Certificate Metadata</h3>
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Certificate Name</label>
            <input
              type="text"
              value={metadata.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Description</label>
            <textarea
              value={metadata.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Course</label>
              <input
                type="text"
                value={metadata.course || ''}
                onChange={(e) => handleChange('course', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Recipient</label>
              <input
                type="text"
                value={metadata.recipient}
                onChange={(e) => handleChange('recipient', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Issue Date</label>
              <input
                type="date"
                value={metadata.issueDate}
                onChange={(e) => handleChange('issueDate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Expiration Date (Optional)</label>
              <input
                type="date"
                value={metadata.expirationDate || ''}
                onChange={(e) => handleChange('expirationDate', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Issuer</label>
              <input
                type="text"
                value={metadata.issuer}
                onChange={(e) => handleChange('issuer', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm font-medium">Grade (Optional)</label>
              <input
                type="text"
                value={metadata.grade || ''}
                onChange={(e) => handleChange('grade', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-1 text-sm font-medium">Skills (comma-separated)</label>
            <input
              type="text"
              value={metadata.skills?.join(', ') || ''}
              onChange={(e) => handleSkillsChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
            />
          </div>
          
          {/* Additional Details Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Additional Details</label>
              <button
                type="button"
                onClick={addAdditionalDetail}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
              >
                + Add Field
              </button>
            </div>
            
            {metadata.additionalDetails && Object.keys(metadata.additionalDetails).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(metadata.additionalDetails).map(([key, value]) => (
                  <div key={key} className="flex gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newValue = metadata.additionalDetails?.[key] || '';
                        removeAdditionalDetail(key);
                        handleAdditionalDetailChange(e.target.value, newValue);
                      }}
                      placeholder="Field name"
                      className="w-1/3 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleAdditionalDetailChange(key, e.target.value)}
                      placeholder="Value"
                      className="flex-1 p-2 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => removeAdditionalDetail(key)}
                      className="p-2 text-red-600 hover:text-red-800 dark:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No additional details. Click "Add Field" to add some.
              </p>
            )}
          </div>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Metadata'}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium">Certificate Details</h3>
        {isEditable && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="p-4">
        <h4 className="text-lg font-medium mb-2">{metadata.name}</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{metadata.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-6">
          {metadata.course && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Course</p>
              <p className="font-medium">{metadata.course}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recipient</p>
            <p className="font-medium">{metadata.recipient}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Issue Date</p>
            <p className="font-medium">{new Date(metadata.issueDate).toLocaleDateString()}</p>
          </div>
          
          {metadata.expirationDate && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expiration Date</p>
              <p className="font-medium">{new Date(metadata.expirationDate).toLocaleDateString()}</p>
            </div>
          )}
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Issuer</p>
            <p className="font-medium">{metadata.issuer}</p>
          </div>
          
          {metadata.grade && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Grade</p>
              <p className="font-medium">{metadata.grade}</p>
            </div>
          )}
        </div>
        
        {metadata.skills && metadata.skills.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {metadata.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-xs"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {metadata.additionalDetails && Object.keys(metadata.additionalDetails).length > 0 && (
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Additional Information</p>
            <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded border border-gray-200 dark:border-gray-700">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                {Object.entries(metadata.additionalDetails).map(([key, value]) => (
                  <div key={key} className="flex">
                    <dt className="text-sm text-gray-600 dark:text-gray-400 mr-2">{key}:</dt>
                    <dd className="text-sm font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}