import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1 
  });

  const handleAnalyze = async () => {
    if (!file) return toast.error("Please upload a resume.");
    setLoading(true);

    try {
      // 1. Upload Resume
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const resumeId = uploadRes.data.id;

      // 2. Trigger Analysis
      const analysisRes = await api.post('/analyze', {
        resumeId,
        jobDescription
      });

      toast.success("Analysis Complete!");
      navigate(`/analysis/${analysisRes.data.id}`);

    } catch (err) {
      toast.error(err.response?.data?.message || "Error analyzing resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analyze Your Resume</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Upload your resume and a job description to see how well you match.</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        
        {/* Dropzone */}
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
          }`}
        >
          <input {...getInputProps()} />
          {!file ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center">
                <UploadCloud className="w-8 h-8"/>
              </div>
              <div>
                <p className="text-lg font-medium text-gray-700 dark:text-gray-200">Click or drag file to this area to upload</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Support for a single or bulk upload. Strictly PDF or DOCX.</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3 text-green-600 dark:text-green-400">
              <File className="w-8 h-8" />
              <span className="text-lg font-medium">{file.name}</span>
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Target Job Description (Optional but recommended)
          </label>
          <textarea 
            rows={6}
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none transition-all resize-none"
          />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400">
            <AlertCircle className="w-4 h-4"/>
            <span>File stays strictly private.</span>
          </div>
          <button 
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm transition-colors disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlSpace="preserve" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle><path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path></svg>
                Analyzing...
              </span>
            ) : 'Analyze Resume'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
