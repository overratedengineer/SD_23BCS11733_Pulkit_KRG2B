import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Share2, Download, ChevronLeft, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalysisPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await api.get(`/analyze/${id}`);
        setData(res.data);
      } catch (err) {
        console.error("Failed to load analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalysis();
  }, [id]);

  if (loading) return <div className="p-8">Loading analysis results...</div>;
  if (!data) return <div className="p-8">Analysis not found.</div>;

  const scoreColor = data.atsScore >= 70 ? 'text-green-500' : data.atsScore >= 40 ? 'text-amber-500' : 'text-red-500';
  const progressColor = data.atsScore >= 70 ? 'bg-green-500' : data.atsScore >= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-2">
            <ChevronLeft className="w-4 h-4 mr-1"/> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis Report</h1>
          <p className="text-sm text-gray-500 mt-1">Generated on {new Date(data.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 transition-colors shadow-sm">
            <Share2 className="w-4 h-4"/>
            <span>Share</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
            <Download className="w-4 h-4"/>
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {/* ATS Score Card */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="col-span-1 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
          <h3 className="text-lg font-medium text-gray-500 mb-6">Overall ATS Score</h3>
          <div className="relative w-40 h-40 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-200 dark:text-gray-700" strokeWidth="3" stroke="currentColor" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className={`${scoreColor}`} strokeDasharray={`${data.atsScore}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                 <span className={`text-4xl font-extrabold ${scoreColor}`}>{data.atsScore}</span>
                 <span className="text-sm text-gray-400">/ 100</span>
              </div>
          </div>
          <p className="mt-6 text-sm text-gray-500 font-medium tracking-wide uppercase">
            {data.atsScore >= 70 ? 'Excellent Match' : data.atsScore >= 40 ? 'Fair Match' : 'Poor Match'}
          </p>
        </motion.div>

        {/* Section Breakdown */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="col-span-1 md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
           <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Score Breakdown</h3>
           <div className="space-y-5">
              {[
                  { label: "Skills Identity", score: data.sectionScores?.skillsScore, max: 40 },
                  { label: "Keywords Match", score: data.sectionScores?.keywordsScore, max: 20 },
                  { label: "Experience Impact", score: data.sectionScores?.experienceScore, max: 20 },
                  { label: "Education & Certs", score: data.sectionScores?.educationScore, max: 10 },
                  { label: "Formatting & Parsing", score: data.sectionScores?.formattingScore, max: 10 },
              ].map((item, idx) => (
                  <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                          <span className="text-gray-500">{item.score} / {item.max}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div className={`h-2 rounded-full ${progressColor}`} style={{ width: `${(item.score / item.max) * 100}%` }}></div>
                      </div>
                  </div>
              ))}
           </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Missing Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                  <XCircle className="w-5 h-5 text-red-500"/>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Missing Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                  {data.missingSkills && data.missingSkills.length > 0 ? (
                      data.missingSkills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/30">
                              {skill}
                          </span>
                      ))
                  ) : (
                      <span className="text-gray-500 text-sm">No missing keywords found!</span>
                  )}
              </div>
          </motion.div>

          {/* Matching Skills */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500"/>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">Matching Keywords</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                  {data.matchingSkills && data.matchingSkills.length > 0 ? (
                      data.matchingSkills.map((skill, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 text-sm rounded-lg border border-green-100 dark:border-green-900/30">
                              {skill}
                          </span>
                      ))
                  ) : (
                      <span className="text-gray-500 text-sm">No matching keywords found.</span>
                  )}
              </div>
          </motion.div>
      </div>

      {/* Suggestions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-2xl p-8 border border-blue-100 dark:border-blue-900/30 mt-6">
          <div className="flex items-center space-x-2 mb-6">
              <AlertTriangle className="w-6 h-6 text-blue-600 dark:text-blue-400"/>
              <h3 className="font-bold text-xl text-blue-900 dark:text-blue-300">Improvement Suggestions</h3>
          </div>
          <ul className="space-y-3">
              {data.suggestions && data.suggestions.length > 0 ? (
                  data.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                          <span className="text-blue-500 mt-1">•</span>
                          <span className="text-blue-800 dark:text-blue-200">{suggestion}</span>
                      </li>
                  ))
              ) : (
                  <li className="text-blue-800 dark:text-blue-200">Your resume looks great! No critical suggestions.</li>
              )}
          </ul>
      </motion.div>
    </div>
  );
}
