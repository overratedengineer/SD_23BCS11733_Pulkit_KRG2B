import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Home, Upload, History, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menu = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5"/> },
    { name: 'Upload Resume', path: '/upload', icon: <Upload className="w-5 h-5"/> },
    { name: 'History', path: '/history', icon: <History className="w-5 h-5"/> },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col justify-between hidden md:flex z-10 transition-colors duration-200">
        <div>
          <div className="h-16 flex items-center px-6 font-bold text-xl text-blue-600 dark:text-blue-400 select-none">
            ResumeIQ
          </div>
          <nav className="mt-6 px-4 flex flex-col space-y-1">
            {menu.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path 
                  ? 'bg-blue-50 text-blue-700 dark:bg-gray-700 dark:text-blue-400' 
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center justify-between px-2 mb-4">
                <span className="text-sm font-semibold truncate max-w-[150px]">{user?.name}</span>
            </div>
            <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 p-2 rounded-lg transition-colors"
            >
                <LogOut className="w-4 h-4"/>
                <span>Logout</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200 p-8">
        <Outlet />
      </main>
    </div>
  );
}
