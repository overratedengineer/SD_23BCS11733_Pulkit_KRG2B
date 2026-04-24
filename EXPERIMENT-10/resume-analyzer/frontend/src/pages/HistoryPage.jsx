import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Eye, Trash2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/analyze/history');
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8">Loading history...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analysis History</h1>
      <p className="text-gray-500 dark:text-gray-400">View all your past resume uploads and their corresponding ATS scores.</p>
      
      {history.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500">No history found. Try analyzing a resume first!</p>
              <Link to="/upload" className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Upload Resume
              </Link>
          </div>
      ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                      <tr>
                          <th className="px-6 py-4 font-medium">Date</th>
                          <th className="px-6 py-4 font-medium">ATS Score</th>
                          <th className="px-6 py-4 font-medium">Matching Skills</th>
                          <th className="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {history.map((item, idx) => (
                          <motion.tr 
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              key={item.id} 
                              className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                          >
                              <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                  <div className="flex items-center space-x-2">
                                      <Calendar className="w-4 h-4 text-gray-400"/>
                                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                      item.atsScore >= 70 ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400' :
                                      item.atsScore >= 40 ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400' :
                                      'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400'
                                  }`}>
                                      {item.atsScore}/100
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-gray-500 truncate max-w-xs">
                                  {item.matchingSkills?.join(", ") || "-"}
                              </td>
                              <td className="px-6 py-4 text-right space-x-3">
                                  <Link to={`/analysis/${item.id}`} className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium">
                                      <Eye className="w-4 h-4"/>
                                      <span>View</span>
                                  </Link>
                              </td>
                          </motion.tr>
                      ))}
                  </tbody>
              </table>
          </div>
      )}
    </div>
  );
}
