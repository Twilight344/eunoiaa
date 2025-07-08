import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemePicker = () => {
  const { theme, setTheme, isDark, isLight } = useTheme();

  const themes = [
    {
      id: 'light',
      name: 'Light',
      icon: '🌞',
      description: 'Clean and bright',
      colors: {
        bg: 'bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50',
        border: 'border-pink-200',
        text: 'text-gray-800',
        accent: 'bg-pink-500'
      }
    },
    {
      id: 'dark',
      name: 'Dark',
      icon: '🌙',
      description: 'AMOLED black',
      colors: {
        bg: 'bg-black',
        border: 'border-white/10',
        text: 'text-white',
        accent: 'bg-white'
      }
    }
  ];

  return (
    <div className="flex flex-col space-y-3">
      <h3 className={`text-sm font-semibold mb-2 ${
        isDark ? 'text-white/80' : 'text-gray-700'
      }`}>
        Choose Theme
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {themes.map((themeOption) => (
          <button
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={`p-3 rounded-xl transition-all duration-300 ${
              theme === themeOption.id
                ? isDark
                  ? 'bg-white/20 border-white/30 shadow-lg'
                  : 'bg-pink-100 border-pink-300 shadow-lg'
                : isDark
                ? 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20'
                : 'bg-white/60 hover:bg-white/80 border border-pink-200/50 hover:border-pink-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-1">{themeOption.icon}</div>
              <div className={`text-xs font-medium ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                {themeOption.name}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemePicker; 