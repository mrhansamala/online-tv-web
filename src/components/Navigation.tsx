import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Globe, Settings, User, Moon, Sun, Heart, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navigation = () => {
  const { isDarkMode, setDarkMode, isAuthenticated, user } = useStore();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2 lg:space-x-3 cursor-pointer"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => navigate('/')}
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <Globe className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
          </div>
          <h1 className="text-lg lg:text-2xl font-bold text-white">Global IPTV</h1>
        </motion.div>

        {/* Controls */}
        <motion.div
          className="flex items-center space-x-2 lg:space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!isDarkMode)}
            className="p-1.5 lg:p-2 bg-white bg-opacity-10 backdrop-blur-md rounded-full hover:bg-opacity-20 transition-all duration-200"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            ) : (
              <Moon className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            )}
          </button>

          {/* Favorites */}
          <button className="p-1.5 lg:p-2 bg-white bg-opacity-10 backdrop-blur-md rounded-full hover:bg-opacity-20 transition-all duration-200">
            <Heart className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </button>

          {/* Settings */}
          <button className="p-1.5 lg:p-2 bg-white bg-opacity-10 backdrop-blur-md rounded-full hover:bg-opacity-20 transition-all duration-200">
            <Settings className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="p-1.5 lg:p-2 bg-white bg-opacity-10 backdrop-blur-md rounded-full hover:bg-opacity-20 transition-all duration-200"
            >
              {isAuthenticated ? (
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs lg:text-sm font-bold">
                    {user?.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
              ) : (
                <User className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
              )}
            </button>

            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 top-full mt-2 w-44 lg:w-48 bg-slate-900 bg-opacity-90 backdrop-blur-xl border border-slate-700 rounded-xl shadow-xl"
              >
                {isAuthenticated ? (
                  <>
                    <div className="p-2 lg:p-3 border-b border-slate-700">
                      <p className="text-sm lg:text-base text-white font-medium truncate">{user?.email}</p>
                      <p className="text-gray-400 text-xs lg:text-sm capitalize">{user?.role}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center space-x-2 px-2 lg:px-3 py-1.5 lg:py-2 text-sm lg:text-base text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>My Favorites</span>
                      </button>
                      {user?.role === 'admin' && (
                        <button className="w-full flex items-center space-x-2 px-2 lg:px-3 py-1.5 lg:py-2 text-sm lg:text-base text-white hover:bg-slate-700 rounded-lg transition-colors">
                          onClick={() => navigate('/admin')}
                          <Shield className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </button>
                      )}
                      <button className="w-full flex items-center space-x-2 px-2 lg:px-3 py-1.5 lg:py-2 text-sm lg:text-base text-white hover:bg-slate-700 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="p-2">
                    <button className="w-full px-2 lg:px-3 py-1.5 lg:py-2 text-sm lg:text-base bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-colors">
                      Sign In
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </nav>
  );
};