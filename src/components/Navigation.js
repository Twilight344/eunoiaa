import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const location = useLocation();
  const { theme, setTheme, isDark, isLight } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Features for mobile menu
  const features = [
    {
      title: 'Mindful Conversations',
      description: 'Connect with an AI companion designed to support your mental wellness journey.',
      link: '/chat',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      )
    },
    {
      title: 'Emotional Insights',
      description: 'Track and understand your emotional patterns with thoughtful analytics.',
      link: '/emotion',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      )
    },
    {
      title: 'Personal Journal',
      description: 'A private space for your thoughts, reflections, and personal growth.',
      link: '/journal',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      )
    },
    {
      title: 'Plan Your Day',
      description: 'Organize your tasks and schedule with to-do lists and weekly timetables.',
      link: '/planner',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
        </svg>
      )
    },
    {
      title: 'Dashboard',
      description: 'Your wellness journey overview and insights.',
      link: '/dashboard',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      )
    }
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 ${
      isDark 
        ? 'bg-black/95 backdrop-blur-sm border-b border-white/10' 
        : 'bg-white/95 backdrop-blur-sm border-b border-pink-200/30'
    } shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isDark 
                    ? 'bg-white/10 border-white/20' 
                    : 'bg-pink-100 border-pink-200'
                }`}>
                  <svg viewBox="0 0 64 64" fill="none" className="w-7 h-7 mx-auto" xmlns="http://www.w3.org/2000/svg">
                    <path d="M32 4C32 4 24 20 32 36C40 20 32 4 32 4Z" fill="#A78BFA"/>
                    <path d="M32 36C32 36 18 28 4 36C18 44 32 36 32 36Z" fill="#F472B6"/>
                    <path d="M32 36C32 36 46 28 60 36C46 44 32 36 32 36Z" fill="#60A5FA"/>
                    <circle cx="32" cy="36" r="6" fill="#FDE68A"/>
                  </svg>
                </div>
                <h1 className={`text-xl sm:text-2xl font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Eunoia
                </h1>
              </div>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:ml-12 md:flex md:space-x-2">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard')
                    ? isDark 
                      ? 'bg-white text-black border border-white shadow-lg'
                      : 'bg-pink-500 text-white border border-pink-500 shadow-lg'
                    : isDark
                      ? 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                      : 'text-gray-700 hover:text-pink-700 hover:bg-pink-50 border border-transparent hover:border-pink-200'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/chat"
                className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/chat')
                    ? isDark 
                      ? 'bg-white text-black border border-white shadow-lg'
                      : 'bg-pink-500 text-white border border-pink-500 shadow-lg'
                    : isDark
                      ? 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                      : 'text-gray-700 hover:text-pink-700 hover:bg-pink-50 border border-transparent hover:border-pink-200'
                }`}
              >
                Mindful Conversations
              </Link>
              <Link
                to="/emotion"
                className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/emotion')
                    ? isDark 
                      ? 'bg-white text-black border border-white shadow-lg'
                      : 'bg-pink-500 text-white border border-pink-500 shadow-lg'
                    : isDark
                      ? 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                      : 'text-gray-700 hover:text-pink-700 hover:bg-pink-50 border border-transparent hover:border-pink-200'
                }`}
              >
                Emotional Insights
              </Link>
              <Link
                to="/journal"
                className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/journal')
                    ? isDark 
                      ? 'bg-white text-black border border-white shadow-lg'
                      : 'bg-pink-500 text-white border border-pink-500 shadow-lg'
                    : isDark
                      ? 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                      : 'text-gray-700 hover:text-pink-700 hover:bg-pink-50 border border-transparent hover:border-pink-200'
                }`}
              >
                Personal Journal
              </Link>
              <Link
                to="/planner"
                className={`inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive('/planner')
                    ? isDark 
                      ? 'bg-white text-black border border-white shadow-lg'
                      : 'bg-pink-500 text-white border border-pink-500 shadow-lg'
                    : isDark
                      ? 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
                      : 'text-gray-700 hover:text-pink-700 hover:bg-pink-50 border border-transparent hover:border-pink-200'
                }`}
              >
                Plan Your Day
              </Link>
            </div>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex md:items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                isDark
                  ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30'
                  : 'text-gray-700 hover:text-sage-700 bg-sage-50 hover:bg-sage-100 border border-sage-200 hover:border-sage-300'
              }`}
            >
              {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
            </button>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={`px-6 py-3 text-sm font-medium rounded-xl transition-all duration-200 shadow-lg ${
                isDark
                  ? 'text-white/80 hover:text-white bg-black hover:bg-white/10 border border-white/20 hover:border-white/30'
                  : 'text-gray-700 hover:text-white bg-pink-500 hover:bg-pink-600 border border-pink-500 hover:border-pink-600'
              }`}
            >
              Sign Out
            </button>
          </div>
          
          {/* Hamburger Menu Button for Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => {
                console.log('Hamburger clicked, current state:', isMobileMenuOpen);
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              className={`p-3 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-white/10 text-white hover:bg-white/20' 
                  : 'bg-white/80 text-gray-800 hover:bg-white shadow-lg'
              }`}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 mb-1 transition-all ${
                  isDark ? 'bg-white' : 'bg-gray-800'
                } ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-5 h-0.5 mb-1 transition-all ${
                  isDark ? 'bg-white' : 'bg-gray-800'
                } ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 transition-all ${
                  isDark ? 'bg-white' : 'bg-gray-800'
                } ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          {/* Menu Panel */}
          <div className={`fixed top-0 right-0 w-80 h-full ${
            isDark ? 'bg-black border-l border-white/10' : 'bg-white/95 backdrop-blur-sm border-l border-pink-200/50'
          } shadow-2xl overflow-y-auto`} style={{zIndex: 51}}>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  EUNOIA
                </h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-white/10' : 'hover:bg-pink-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {/* Navigation Links */}
              <nav className="space-y-4">
                {features.map((feature, index) => (
                  <Link
                    key={index}
                    to={feature.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block p-4 rounded-xl transition-all duration-200 ${
                      isDark 
                        ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                        : 'bg-white/60 hover:bg-white/80 border border-pink-200/30 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isDark ? 'bg-white/10' : 'bg-pink-100'
                      }`}>
                        <div className={isDark ? 'text-white' : 'text-pink-600'}>
                          {feature.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className={`font-semibold ${
                          isDark ? 'text-white' : 'text-gray-800'
                        }`}>
                          {feature.title}
                        </h3>
                        <p className={`text-sm mt-1 ${
                          isDark ? 'text-white/60' : 'text-gray-600'
                        }`}>
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </nav>
              <div className="my-8">
                <div className={`p-4 rounded-xl transition-all duration-200 ${
                  isDark 
                    ? 'bg-white/5 hover:bg-white/10 border border-white/10' 
                    : 'bg-white/60 hover:bg-white/80 border border-pink-200/30 shadow-sm'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-white/10' : 'bg-pink-100'
                    }`}>
                      <span className="text-2xl">🎨</span>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        Theme
                      </h3>
                      <p className={`text-sm mt-1 ${
                        isDark ? 'text-white/60' : 'text-gray-600'
                      }`}>
                        Choose your preferred theme
                      </p>
                    </div>
                    <div className="relative">
                      <select
                        value={theme}
                        onChange={(e) => { setTheme(e.target.value); setIsMobileMenuOpen(false); }}
                        className={`appearance-none px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          theme === 'dark' 
                            ? 'bg-white/20 text-white border border-white/30' 
                            : 'bg-pink-100 text-pink-700 border border-pink-200'
                        }`}
                      >
                        <option value="dark" className="bg-black text-white">🌙 Dark</option>
                        <option value="light" className="bg-white text-pink-700">🌞 Light</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              {/* Sign Out Button */}
              <div className="mt-6">
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full p-4 rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30' 
                      : 'bg-red-100 hover:bg-red-200 border border-red-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-red-500/20' : 'bg-red-100'
                    }`}>
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        isDark ? 'text-red-400' : 'text-red-700'
                      }`}>
                        Sign Out
                      </h3>
                      <p className={`text-sm mt-1 ${
                        isDark ? 'text-red-400/60' : 'text-red-600'
                      }`}>
                        Log out of your account
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>, document.body
      )}
    </nav>
  );
};

export default Navigation; 