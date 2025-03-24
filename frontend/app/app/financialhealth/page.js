'use client';

import React, { useState, useEffect, useRef } from "react";
import dynamic from 'next/dynamic';
import { FiUpload, FiFileText, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

// Dynamic import with SSR disabled
const Navbar = dynamic(() => import('../components/navbar.js'), {
  ssr: false
});

export default function FinancialHealthPage() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef(null);

  // Mark when component is mounted on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    
    if (!selectedFile) {
      setFile(null);
      setFileName("");
      return;
    }
    
    // Check if file is a PDF
    if (!selectedFile.type.includes('pdf')) {
      setError('Please upload a PDF file');
      setFile(null);
      setFileName("");
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file first');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    setAnalysis(null);
    
    try {
      // Create form data to send file
      const formData = new FormData();
      formData.append('pdf_file', file);
      
      // Send request to backend
      const response = await fetch('http://localhost:9284/analyze_bank_statement', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze statement');
      }
      
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      setError(error.message || 'An error occurred while analyzing the statement');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setFileName("");
    setError(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Return loading placeholder during server rendering
  if (!isClient) {
    return (
      <div className="flex h-screen bg-white text-black items-center justify-center">
        <div className="text-xl">Loading financial health analyzer...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200">
        <Navbar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Page Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-gray-800">Financial Health Analysis</h1>
          <p className="text-gray-600 mt-2">Upload your bank statement to get personalized financial insights and fraud detection</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-4xl mx-auto">
            {!analysis && (
              <div className="mb-8 p-6 border border-gray-200 rounded-lg shadow-sm bg-white">
                <h2 className="text-xl font-semibold mb-4">Upload Bank Statement</h2>
                
                {error && (
                  <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 flex items-center">
                    <FiAlertCircle className="mr-2" />
                    <p>{error}</p>
                  </div>
                )}
                
                <div className="mb-6">
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf"
                    />
                    
                    <div className="flex flex-col items-center">
                      {!fileName ? (
                        <>
                          <FiUpload className="text-4xl text-gray-400 mb-3" />
                          <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                          <p className="text-gray-500 text-sm">PDF files only</p>
                        </>
                      ) : (
                        <>
                          <FiFileText className="text-4xl text-indigo-500 mb-3" />
                          <p className="text-gray-800 font-medium mb-1">{fileName}</p>
                          <p className="text-gray-500 text-sm">Click to change file</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-md font-medium disabled:bg-indigo-300 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center"
                  >
                    {isUploading ? (
                      <>
                        <div className="mr-2 h-4 w-4 border-2 border-white border-t-2 border-t-transparent rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      'Analyze Statement'
                    )}
                  </button>
                  
                  {file && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
            
            {analysis && (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-green-50 border-b border-gray-200 flex items-center">
                  <FiCheckCircle className="text-green-500 mr-2" />
                  <h2 className="font-semibold text-green-800">Analysis Complete</h2>
                  
                  <button
                    className="ml-auto text-sm text-indigo-600 hover:text-indigo-800"
                    onClick={handleReset}
                  >
                    Analyze Another Statement
                  </button>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Financial Health Report</h3>
                  
                  <div className="prose max-w-none">
                    {analysis.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 text-gray-800">{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className="mt-8 p-4 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Next Steps</h4>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>Review your spending categories to identify areas for potential savings</li>
                      <li>Create a monthly budget based on your typical expenses</li>
                      <li>Consider setting up automatic transfers to a savings account</li>
                      <li>If fraud is detected, contact your bank immediately</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 bg-indigo-50 rounded-lg p-4 text-sm text-indigo-800">
              <p className="font-medium">Your privacy is important</p>
              <p className="mt-1">Your bank statement data is only used for analysis and is not stored on our servers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}