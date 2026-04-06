import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function FileUploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setStatus('idle');
      setErrorMsg('');
    } else {
      setFile(null);
      setStatus('error');
      setErrorMsg('Please select a valid PDF file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus('uploading');
    try {
      const result = await api.uploadPDF(file);
      setStatus('success');
      onUploadSuccess(result.message);
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.detail || 'An error occurred during upload.');
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md w-full mx-auto">
      <div 
        className={`w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors cursor-pointer
          ${status === 'error' ? 'border-red-300 bg-red-50' : 
            status === 'success' ? 'border-green-300 bg-green-50' : 
            file ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="application/pdf" 
          className="hidden" 
        />
        
        {status === 'success' ? (
          <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
        ) : status === 'error' ? (
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
        ) : file ? (
          <FileText className="w-12 h-12 text-blue-500 mb-3" />
        ) : (
          <Upload className="w-12 h-12 text-gray-400 mb-3" />
        )}
        
        <p className="text-sm font-medium text-gray-700 text-center">
          {file ? file.name : "Click to select a PDF document"}
        </p>
        {!file && <p className="text-xs text-gray-500 mt-1">PDF up to 10MB</p>}
      </div>

      {status === 'error' && (
        <p className="mt-3 text-sm text-red-600 font-medium">{errorMsg}</p>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || status === 'uploading' || status === 'success'}
        className={`mt-4 w-full py-2 px-4 rounded-lg font-medium text-white transition-opacity flex justify-center items-center gap-2
          ${!file || status === 'success' ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
        `}
      >
        {status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin" />}
        {status === 'uploading' ? 'Processing PDF...' : 
         status === 'success' ? 'Document Ready' : 'Upload & Process'}
      </button>
    </div>
  );
}
