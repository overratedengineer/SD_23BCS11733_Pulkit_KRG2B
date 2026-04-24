import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FileText, Activity, Layers, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [stats, setStats] = useState({ total: 0, avgScore: 0, latestScore: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/analyze/history');
        if (data && data.length > 0) {
          const total = data.length;
          const avgScore = Math.round(data.reduce((acc, curr) => acc + curr.atsScore, 0) / total);
          const latestScore = data[0].atsScore;
          setStats({ total, avgScore, latestScore });
        }
      } catch (err) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Loading dashboard...</div>;

  const cards = [
    { title: 'Total Resumes Analyzed', value: stats.total, icon: <Layers className="w-8 h-8 text-blue-500"/>, bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Latest ATS Score', value: stats.total > 0 ? `${stats.latestScore}/100` : '-', icon: <Activity className="w-8 h-8 text-green-500"/>, bg: 'bg-green-50 dark:bg-green-900/20' },
    { title: 'Average ATS Score', value: stats.total > 0 ? `${stats.avgScore}/100` : '-', icon: <Award className="w-8 h-8 text-purple-500"/>, bg: 'bg-purple-50 dark:bg-purple-900/20' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            key={card.title} 
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4"
          >
            <div className={`p-4 rounded-xl ${card.bg}`}>{card.icon}</div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{card.title}</p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{card.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
              <a href="/upload" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                  <FileText className="w-5 h-5"/>
                  <span>Analyze New Resume</span>
              </a>
          </div>
      </div>
    </div>
  );
}
