// CertificateTemplate.jsx
import React from 'react';

const CertificateTemplate = ({ studentName = "Student Name", issueDate = new Date().toLocaleDateString(), tokenId = "0" }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl p-8 border-8 border-double border-blue-800 rounded-lg shadow-lg">
        <div className="border-2 border-blue-800 p-8">
          <div className="text-center">
            <h1 className="text-4xl font-serif text-blue-900 mb-2">Certificate of Achievement</h1>
            <div className="text-sm text-gray-600 mb-8">University Blockchain Certification Program</div>
            
            <div className="my-12 text-lg">
              This certifies that
              <div className="text-3xl font-bold my-4 text-blue-800">{studentName}</div>
              has successfully completed all the requirements for
              <div className="text-2xl font-semibold my-4">Blockchain Development Fundamentals</div>
              Awarded on {issueDate}
            </div>
            
            <div className="border-t-2 border-blue-200 pt-4 mt-8 flex justify-between">
              <div className="text-left">
                <div className="font-bold">Certificate ID</div>
                <div>#{tokenId}</div>
              </div>
              <div className="text-right">
                <div className="font-bold">Blockchain Verified</div>
                <div>Soulbound Token (SBT)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
