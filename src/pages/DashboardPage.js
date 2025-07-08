import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJournalStats } from '../api/journal';
import { getPlannerStats } from '../api/planner';
import { useTheme } from '../context/ThemeContext';
import ThemePicker from '../components/ThemePicker';
import SplineRobot from '../components/SplineRobot';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    moodStats: [],
    dailyStats: []
  });
  const [plannerStats, setPlannerStats] = useState({
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
    completionRate: 0,
    activitiesByDay: {},
    totalActivities: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isDark, isCalm, isLight, theme } = useTheme();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch both journal and planner stats
      const [journalData, plannerData] = await Promise.all([
        getJournalStats(),
        getPlannerStats()
      ]);
      
      // Get all possible moods (matching the database format)
      const allMoods = ['Happy', 'Sad', 'Excited', 'Anxious', 'Calm', 'Angry', 'Grateful', 'Neutral'];
      
      // Create complete mood stats with real data from database
      const completeMoodStats = allMoods.map(mood => {
        const existingMood = journalData.mood_stats.find(item => item._id === mood);
        return {
          _id: mood,
          count: existingMood ? existingMood.count : 0
        };
      });
      
      // Generate daily stats for the last 7 days using real data
      const dailyStats = [];
      const currentDate = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const dayDate = new Date(currentDate);
        dayDate.setDate(currentDate.getDate() - i);
        
        // Find entries for this day from the database
        const year = dayDate.getFullYear();
        const month = dayDate.getMonth() + 1; // getMonth() returns 0-11
        const day = dayDate.getDate();
        
        const existingDay = journalData.daily_stats.find(item => 
          item._id.year === year && 
          item._id.month === month && 
          item._id.day === day
        );
        
        dailyStats.push({
          day: dayDate.toLocaleDateString('en-US', { weekday: 'short' }),
          entries: existingDay ? existingDay.count : 0,
          date: dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        });
      }
      
      setStats({
        totalEntries: journalData.total_entries,
        moodStats: completeMoodStats,
        dailyStats: dailyStats
      });
      
      setPlannerStats(plannerData);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      title: 'Mindful Conversations',
      description: 'Connect with an AI companion designed to support you.',
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
    }
  ];

  const getMoodColor = (mood) => {
    if (isDark) {
      return 'bg-white text-black';
    }
    if (isCalm) {
      return 'bg-sage-100 text-sage-800 border border-sage-200';
    }
    return 'bg-pink-100 text-pink-800 border border-pink-200';
  };

  const getMoodBarColor = (mood) => {
    if (isDark) {
      return 'bg-pink-400';
    }
    if (isCalm) {
      return 'bg-sage-500';
    }
    return 'bg-pink-500';
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      Happy: '😊',
      Sad: '😢',
      Excited: '🎉',
      Anxious: '😰',
      Calm: '😌',
      Angry: '😠',
      Grateful: '🙏',
      Neutral: '😐'
    };
    return emojis[mood] || '😐';
  };

  const getMoodRecommendation = (mood) => {
    const recommendations = {
      Happy: {
        title: "Keep the Joy Flowing! ✨",
        message: "You're in a great mood! Consider sharing your positive energy with others or documenting what's making you happy.",
        action: "Write about what's bringing you joy today"
      },
      Sad: {
        title: "It's Okay to Feel This Way 💙",
        message: "Sadness is a natural emotion. Be gentle with yourself and remember that this feeling will pass.",
        action: "Try a gentle self-care activity or talk to someone you trust"
      },
      Excited: {
        title: "Channel That Energy! 🚀",
        message: "Your excitement is contagious! Use this energy to tackle something you've been wanting to do.",
        action: "Start that project you've been thinking about"
      },
      Anxious: {
        title: "Take a Deep Breath 🌸",
        message: "Anxiety can be overwhelming. Remember to breathe and focus on what you can control right now.",
        action: "Try a 5-minute breathing exercise or grounding technique"
      },
      Calm: {
        title: "Embrace the Peace 🌿",
        message: "You're in a balanced state. This is perfect for reflection and mindful decision-making.",
        action: "Use this calm energy for meditation or planning"
      },
      Angry: {
        title: "Your Feelings Are Valid 🔥",
        message: "Anger is a natural response. It's important to acknowledge it and find healthy ways to express it.",
        action: "Try physical exercise or write about what's bothering you"
      },
      Grateful: {
        title: "Gratitude is Beautiful 🙏",
        message: "Your grateful heart is a gift. Share this appreciation with others or deepen your gratitude practice.",
        action: "Express thanks to someone or write about what you're grateful for"
      },
      Neutral: {
        title: "Finding Your Balance ⚖️",
        message: "Neutral feelings are perfectly normal. This might be a good time for self-reflection.",
        action: "Check in with yourself about what you need right now"
      }
    };
    return recommendations[mood] || recommendations.Neutral;
  };

  const renderBarChart = (data, maxValue) => {
    if (!data || data.length === 0) {
      return (
        <div className={`text-center py-8 ${
          isDark ? 'text-white/50' : 'text-gray-500'
        }`}>
          <p className="text-sm">No data available</p>
        </div>
      );
    }

    return data.map((item, index) => {
      // Ensure minimum height for zero values (2% of chart height)
      const minHeight = 2;
      const calculatedHeight = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
      const height = Math.max(calculatedHeight, minHeight);
      
      return (
        <div key={index} className="flex flex-col items-center space-y-1 lg:space-y-2">
          <div className={`text-xs font-medium text-center ${
            isDark ? 'text-white/70' : 'text-gray-600'
          }`}>
            {item.count}
          </div>
          <div className="relative w-4 lg:w-6 h-16 lg:h-20">
            <div className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 ${getMoodBarColor(item._id)}`}
                 style={{ height: `${height}%` }}>
            </div>
          </div>
          <div className="text-xs text-center">
            {getMoodEmoji(item._id)}
          </div>
        </div>
      );
    });
  };

  const renderDailyBarChart = (data) => {
    if (!data || data.length === 0) {
      return (
        <div className={`text-center py-8 ${
          isDark ? 'text-white/50' : 'text-gray-500'
        }`}>
          <p className="text-sm">No daily data available</p>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => item.entries));
    
    return data.map((item, index) => {
      // Ensure minimum height for zero values (2% of chart height)
      const minHeight = 2;
      const calculatedHeight = maxValue > 0 ? (item.entries / maxValue) * 100 : 0;
      const height = Math.max(calculatedHeight, minHeight);
      
      return (
        <div key={index} className="flex flex-col items-center space-y-1 lg:space-y-2">
          <div className={`text-xs font-medium text-center ${
            isDark ? 'text-white/70' : 'text-gray-600'
          }`}>
            {item.entries}
          </div>
          <div className="relative w-4 lg:w-6 h-16 lg:h-20">
            <div className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-1000 ${
              isDark ? 'bg-pink-400' : 'bg-pink-500'
            }`}
                 style={{ height: `${height}%` }}>
            </div>
          </div>
          <div className={`text-xs text-center ${
            isDark ? 'text-white/60' : 'text-gray-500'
          }`}>
            {item.day}
          </div>
        </div>
      );
    });
  };



  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className={`min-h-screen relative overflow-hidden pt-16 ${
      isDark ? 'bg-black' : 'bg-gradient-to-br from-pink-50 via-white to-pink-100'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        {isDark ? (
          <>
            <div className="absolute inset-0 bg-black"></div>
            
            {/* Simple vertical light rays */}
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-400/25 to-transparent"></div>
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent"></div>
            <div className="absolute top-0 left-1/6 w-px h-full bg-gradient-to-b from-transparent via-green-400/18 to-transparent"></div>
            <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-400/18 to-transparent"></div>
            <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400/22 to-transparent"></div>
            <div className="absolute top-0 right-1/6 w-px h-full bg-gradient-to-b from-transparent via-pink-400/20 to-transparent"></div>
            <div className="absolute top-0 right-1/2 w-px h-full bg-gradient-to-b from-transparent via-blue-400/25 to-transparent"></div>
            <div className="absolute top-0 right-1/4 w-0.5 h-full bg-gradient-to-b from-transparent via-purple-400/30 to-transparent"></div>
            <div className="absolute top-0 right-3/4 w-px h-full bg-gradient-to-b from-transparent via-orange-400/20 to-transparent"></div>
            

            

            

          </>
        ) : isCalm ? (
          <>
            {/* Calm theme gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-sage-50 via-lavender-50 to-mint-50"></div>
            
            {/* Calm organic paths */}
            <div className="absolute top-20 left-10 w-80 h-4 bg-gradient-to-r from-sage-200/40 via-lavender-300/50 to-mint-200/30 rounded-full blur-sm transform rotate-12"></div>
            <div className="absolute top-40 right-20 w-60 h-3 bg-gradient-to-l from-lavender-300/45 via-sage-200/55 to-mint-300/40 rounded-full blur-sm transform -rotate-6"></div>
            <div className="absolute top-1/2 left-1/4 w-72 h-5 bg-gradient-to-r from-mint-200/50 via-sage-300/60 to-lavender-200/40 rounded-full blur-sm transform rotate-45"></div>
            <div className="absolute bottom-40 left-1/4 w-64 h-4 bg-gradient-to-l from-sage-300/40 via-lavender-200/50 to-mint-300/35 rounded-full blur-sm transform -rotate-12"></div>
            <div className="absolute top-1/3 right-1/4 w-56 h-3 bg-gradient-to-r from-lavender-200/55 via-mint-300/65 to-sage-200/45 rounded-full blur-sm transform rotate-30"></div>
            <div className="absolute bottom-1/3 right-1/6 w-48 h-5 bg-gradient-to-l from-mint-300/50 via-sage-200/60 to-lavender-300/45 rounded-full blur-sm transform -rotate-45"></div>
            <div className="absolute top-2/3 left-1/6 w-80 h-4 bg-gradient-to-r from-sage-200/45 via-lavender-300/55 to-mint-200/35 rounded-full blur-sm transform rotate-15"></div>
            <div className="absolute bottom-1/4 left-2/3 w-40 h-3 bg-gradient-to-l from-lavender-300/55 via-mint-200/65 to-sage-300/50 rounded-full blur-sm transform -rotate-30"></div>
            <div className="absolute top-1/4 right-1/6 w-64 h-4 bg-gradient-to-r from-mint-200/50 via-sage-300/60 to-lavender-200/40 rounded-full blur-sm transform rotate-60"></div>
            <div className="absolute bottom-1/3 left-1/2 w-72 h-3 bg-gradient-to-l from-sage-300/45 via-lavender-200/55 to-mint-300/40 rounded-full blur-sm transform -rotate-15"></div>
            
            {/* Additional smaller calm paths */}
            <div className="absolute top-48 left-1/2 w-32 h-2 bg-gradient-to-r from-lavender-200/50 via-mint-300/60 to-sage-200/40 rounded-full blur-sm transform rotate-20"></div>
            <div className="absolute top-3/4 right-1/3 w-40 h-3 bg-gradient-to-l from-mint-300/55 via-sage-200/65 to-lavender-300/50 rounded-full blur-sm transform -rotate-25"></div>
            <div className="absolute bottom-1/2 left-1/6 w-48 h-2 bg-gradient-to-r from-sage-200/60 via-lavender-300/70 to-mint-200/50 rounded-full blur-sm transform rotate-40"></div>
            <div className="absolute top-1/6 right-1/2 w-36 h-4 bg-gradient-to-l from-lavender-300/50 via-mint-200/60 to-sage-300/45 rounded-full blur-sm transform -rotate-35"></div>
            
            {/* Curved calm paths */}
            <div className="absolute top-32 left-1/3 w-96 h-3" style={{
              background: 'linear-gradient(90deg, rgba(123, 155, 123, 0.4) 0%, rgba(156, 124, 255, 0.6) 50%, rgba(34, 197, 94, 0.4) 100%)',
              borderRadius: '50px',
              filter: 'blur(2px)',
              transform: 'rotate(15deg)'
            }}></div>
            <div className="absolute bottom-32 right-1/4 w-80 h-4" style={{
              background: 'linear-gradient(90deg, rgba(156, 124, 255, 0.5) 0%, rgba(34, 197, 94, 0.7) 50%, rgba(123, 155, 123, 0.5) 100%)',
              borderRadius: '50px',
              filter: 'blur(2px)',
              transform: 'rotate(-25deg)'
            }}></div>
          </>
        ) : (
          <>
            {/* Light mode gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-pink-100"></div>
            
            {/* Organic pink paths/strokes */}
            <div className="absolute top-20 left-10 w-80 h-4 bg-gradient-to-r from-pink-200/40 via-pink-300/50 to-pink-200/30 rounded-full blur-sm transform rotate-12"></div>
            <div className="absolute top-40 right-20 w-60 h-3 bg-gradient-to-l from-pink-300/45 via-pink-200/55 to-pink-300/40 rounded-full blur-sm transform -rotate-6"></div>
            <div className="absolute top-1/2 left-1/4 w-72 h-5 bg-gradient-to-r from-pink-200/50 via-pink-300/60 to-pink-200/40 rounded-full blur-sm transform rotate-45"></div>
            <div className="absolute bottom-40 left-1/4 w-64 h-4 bg-gradient-to-l from-pink-300/40 via-pink-200/50 to-pink-300/35 rounded-full blur-sm transform -rotate-12"></div>
            <div className="absolute top-1/3 right-1/4 w-56 h-3 bg-gradient-to-r from-pink-200/55 via-pink-300/65 to-pink-200/45 rounded-full blur-sm transform rotate-30"></div>
            <div className="absolute bottom-1/3 right-1/6 w-48 h-5 bg-gradient-to-l from-pink-300/50 via-pink-200/60 to-pink-300/45 rounded-full blur-sm transform -rotate-45"></div>
            <div className="absolute top-2/3 left-1/6 w-80 h-4 bg-gradient-to-r from-pink-200/45 via-pink-300/55 to-pink-200/35 rounded-full blur-sm transform rotate-15"></div>
            <div className="absolute bottom-1/4 left-2/3 w-40 h-3 bg-gradient-to-l from-pink-300/55 via-pink-200/65 to-pink-300/50 rounded-full blur-sm transform -rotate-30"></div>
            <div className="absolute top-1/4 right-1/6 w-64 h-4 bg-gradient-to-r from-pink-200/50 via-pink-300/60 to-pink-200/40 rounded-full blur-sm transform rotate-60"></div>
            <div className="absolute bottom-1/3 left-1/2 w-72 h-3 bg-gradient-to-l from-pink-300/45 via-pink-200/55 to-pink-300/40 rounded-full blur-sm transform -rotate-15"></div>
            
            {/* Additional smaller paths */}
            <div className="absolute top-48 left-1/2 w-32 h-2 bg-gradient-to-r from-pink-200/50 via-pink-300/60 to-pink-200/40 rounded-full blur-sm transform rotate-20"></div>
            <div className="absolute top-3/4 right-1/3 w-40 h-3 bg-gradient-to-l from-pink-300/55 via-pink-200/65 to-pink-300/50 rounded-full blur-sm transform -rotate-25"></div>
            <div className="absolute bottom-1/2 left-1/6 w-48 h-2 bg-gradient-to-r from-pink-200/60 via-pink-300/70 to-pink-200/50 rounded-full blur-sm transform rotate-40"></div>
            <div className="absolute top-1/6 right-1/2 w-36 h-4 bg-gradient-to-l from-pink-300/50 via-pink-200/60 to-pink-300/45 rounded-full blur-sm transform -rotate-35"></div>
            
            {/* Curved paths */}
            <div className="absolute top-32 left-1/3 w-96 h-3" style={{
              background: 'linear-gradient(90deg, rgba(236, 72, 153, 0.4) 0%, rgba(219, 39, 119, 0.6) 50%, rgba(236, 72, 153, 0.4) 100%)',
              borderRadius: '50px',
              filter: 'blur(2px)',
              transform: 'rotate(15deg)'
            }}></div>
            <div className="absolute bottom-32 right-1/4 w-80 h-4" style={{
              background: 'linear-gradient(90deg, rgba(219, 39, 119, 0.5) 0%, rgba(236, 72, 153, 0.7) 50%, rgba(219, 39, 119, 0.5) 100%)',
              borderRadius: '50px',
              filter: 'blur(2px)',
              transform: 'rotate(-25deg)'
            }}></div>
            

            

          </>
        )}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto py-8 px-6">
        {/* Minimal Header */}
        <div className="text-center mb-8 lg:mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 bg-white/10 rounded-2xl border border-white/20 mx-auto">
            <svg viewBox="0 0 64 64" fill="none" className="w-12 h-12 mx-auto" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 4C32 4 24 20 32 36C40 20 32 4 32 4Z" fill="#A78BFA"/>
              <path d="M32 36C32 36 18 28 4 36C18 44 32 36 32 36Z" fill="#F472B6"/>
              <path d="M32 36C32 36 46 28 60 36C46 44 32 36 32 36Z" fill="#60A5FA"/>
              <circle cx="32" cy="36" r="6" fill="#FDE68A"/>
            </svg>
          </div>
          <h1 className={`eunoia-main-title font-black mb-4 lg:mb-8 tracking-tighter leading-none ${
            isDark ? 'text-white' : 'text-gray-800'
          } text-5xl lg:text-6xl`}>
            EUNOIA
          </h1>
          
          <div className="max-w-2xl mx-auto">
            <div className={`flex justify-center space-x-4 lg:space-x-8 text-xs lg:text-sm font-medium ${
              isDark ? 'text-white/40' : 'text-gray-500'
            }`}>
              <span>Mindful Living</span>
              <span>•</span>
              <span>Emotional Balance</span>
              <span>•</span>
              <span>Personal Growth</span>
            </div>
          </div>
        </div>

        {/* Modern Features Grid - Hidden on mobile, shown on desktop */}
        <div className="hidden xl:block">
          <div className="grid grid-cols-4 gap-8 mb-24">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group block"
              >
                <div className={`relative rounded-2xl border transition-all duration-500 overflow-hidden h-64 ${
                  isDark 
                    ? 'bg-black border-white/10 hover:border-white/20' 
                    : isCalm
                    ? 'bg-white/80 backdrop-blur-sm border-sage-200/50 hover:border-sage-300/70 shadow-lg hover:shadow-xl'
                    : 'bg-white/80 backdrop-blur-sm border-pink-200/50 hover:border-pink-300/70 shadow-lg hover:shadow-xl'
                }`}>
                  <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center mb-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors duration-300 ${
                        isDark 
                          ? 'bg-white/10 group-hover:bg-white/20' 
                          : isCalm
                          ? 'bg-sage-100 group-hover:bg-sage-200'
                          : 'bg-pink-100 group-hover:bg-pink-200'
                      }`}>
                        <div className={isDark ? 'text-white' : isCalm ? 'text-sage-600' : 'text-pink-600'}>
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className={`text-lg font-semibold transition-colors ${
                        isDark 
                          ? 'text-white group-hover:text-white/90' 
                          : isCalm
                          ? 'text-gray-800 group-hover:text-sage-700'
                          : 'text-gray-800 group-hover:text-pink-700'
                      }`}>
                        {feature.title}
                      </h3>
                    </div>
                    <p className={`leading-relaxed text-sm mb-6 flex-grow ${
                      isDark ? 'text-white/60' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className={`flex items-center font-medium transition-colors ${
                        isDark 
                          ? 'text-white/50 group-hover:text-white/70' 
                          : 'text-gray-500 group-hover:text-pink-600'
                      }`}>
                        <span className="text-sm">Explore</span>
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className={`w-5 h-5 border rounded-full transition-colors duration-300 ${
                        isDark 
                          ? 'border-white/20 group-hover:border-white/40' 
                          : 'border-pink-200 group-hover:border-pink-400'
                      }`}></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Features Grid - Shown on mobile, hidden on desktop */}
        <div className="xl:hidden mb-12">
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group block"
              >
                <div className={`relative rounded-xl border transition-all duration-500 overflow-hidden ${
                  isDark 
                    ? 'bg-black border-white/10 hover:border-white/20' 
                    : isCalm
                    ? 'bg-white/80 backdrop-blur-sm border-sage-200/50 hover:border-sage-300/70 shadow-lg hover:shadow-xl'
                    : 'bg-white/80 backdrop-blur-sm border-pink-200/50 hover:border-pink-300/70 shadow-lg hover:shadow-xl'
                }`}>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 transition-colors duration-300 ${
                        isDark 
                          ? 'bg-white/10 group-hover:bg-white/20' 
                          : isCalm
                          ? 'bg-sage-100 group-hover:bg-sage-200'
                          : 'bg-pink-100 group-hover:bg-pink-200'
                      }`}>
                        <div className={isDark ? 'text-white' : isCalm ? 'text-sage-600' : 'text-pink-600'}>
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className={`text-base font-semibold transition-colors ${
                        isDark 
                          ? 'text-white group-hover:text-white/90' 
                          : 'text-gray-800 group-hover:text-pink-700'
                      }`}>
                        {feature.title}
                      </h3>
                    </div>
                    <p className={`leading-relaxed text-sm mb-4 ${
                      isDark ? 'text-white/60' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center font-medium transition-colors ${
                        isDark 
                          ? 'text-white/50 group-hover:text-white/70' 
                          : 'text-gray-500 group-hover:text-pink-600'
                      }`}>
                        <span className="text-sm">Explore</span>
                        <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <div className={`w-4 h-4 border rounded-full transition-colors duration-300 ${
                        isDark 
                          ? 'border-white/20 group-hover:border-white/40' 
                          : 'border-pink-200 group-hover:border-pink-400'
                      }`}></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>



        {/* Modern Stats Section */}
        <div className={`rounded-2xl border p-10 relative overflow-hidden ${
          isDark 
            ? 'bg-black/60 backdrop-blur-sm border-white/10' 
            : 'bg-white/80 backdrop-blur-sm border-pink-200/50 shadow-lg'
        }`}>
          {/* Very subtle yellowish glow for AMOLED */}
          {isDark && (
            <>
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/3 via-transparent to-yellow-300/2 rounded-2xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-yellow-400/4 to-transparent rounded-full blur-2xl"></div>
              <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-gradient-to-bl from-yellow-300/3 to-transparent rounded-full blur-xl"></div>
            </>
          )}
          
          {/* Content wrapper */}
          <div className="relative z-10">
          <div className="flex items-center mb-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-6 ${
              isDark ? 'bg-white/10' : 'bg-pink-100'
            }`}>
              <svg className={`w-5 h-5 ${
                isDark ? 'text-white' : 'text-pink-600'
              }`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Your Wellness Journey
              </h2>
              <p className={`text-sm ${
                isDark ? 'text-white/50' : 'text-gray-600'
              }`}>Insights from your mindful practice</p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-16">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                isDark ? 'bg-white/10' : 'bg-pink-100'
              }`}>
                <div className={`animate-spin rounded-full h-6 w-6 border-2 ${
                  isDark 
                    ? 'border-white/20 border-t-white' 
                    : 'border-pink-200 border-t-pink-500'
                }`}></div>
              </div>
              <p className={`mt-4 text-sm ${
                isDark ? 'text-white/50' : 'text-gray-600'
              }`}>Loading your insights...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${
                isDark ? 'bg-red-500/20' : 'bg-red-100'
              }`}>
                <svg className={`w-6 h-6 ${
                  isDark ? 'text-red-400' : 'text-red-500'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className={`mt-4 text-sm ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}>{error}</p>
              <button
                onClick={fetchStats}
                className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isDark 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Journal Stats */}
              <div className="space-y-4 lg:space-y-6">
                <h3 className={`text-lg font-semibold mb-4 lg:mb-6 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Journal Insights
                </h3>
                <div className="space-y-4 lg:space-y-6">
                  {/* Total Entries */}
                  <div className={`rounded-xl p-4 lg:p-6 border ${
                    isDark 
                      ? 'bg-black border-white/5' 
                      : 'bg-white/60 border-pink-200/30'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-white/70' : 'text-gray-600'
                      }`}>Total Entries</span>
                      <span className={`text-2xl lg:text-3xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        {stats.totalEntries}
                      </span>
                    </div>
                  </div>
                  
                  {/* Mood Distribution Bar Chart */}
                  <div className={`rounded-xl p-4 lg:p-6 border ${
                    isDark 
                      ? 'bg-black border-white/5' 
                      : 'bg-white/60 border-pink-200/30'
                  }`}>
                    <h4 className={`font-medium text-sm mb-4 lg:mb-6 ${
                      isDark ? 'text-white/70' : 'text-gray-600'
                    }`}>
                      Mood Distribution
                    </h4>
                    <div className="flex items-end justify-center space-x-0.5 lg:space-x-1 h-36 lg:h-44">
                      {renderBarChart(stats.moodStats, Math.max(...(stats.moodStats.map(m => m.count) || [0])))}
                    </div>
                    
                    {/* Spacer to match daily activity section height */}
                    <div className="h-8 lg:h-12"></div>
                  </div>
                </div>
              </div>

              {/* Daily Activity Bar Chart */}
              <div className="space-y-4 lg:space-y-6">
                <h3 className={`text-lg font-semibold mb-4 lg:mb-6 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Daily Activity
                </h3>
                <div className={`rounded-xl p-4 lg:p-6 border ${
                  isDark 
                    ? 'bg-black border-white/5' 
                    : 'bg-white/60 border-pink-200/30'
                }`}>
                  <h4 className={`font-medium text-sm mb-4 lg:mb-6 ${
                    isDark ? 'text-white/70' : 'text-gray-600'
                  }`}>
                    Journal Entries (Last 7 Days)
                  </h4>
                  <div className="flex items-end justify-center space-x-1 lg:space-x-2 h-24 lg:h-32 overflow-x-auto">
                    {renderDailyBarChart(stats.dailyStats)}
                  </div>
                </div>
                
                {/* Personalized Recommendation Section */}
                {!loading && !error && stats.moodStats.length > 0 && (
                  <div className="mt-4 lg:mt-6">
                    {(() => {
                      // Find the mood with the highest count
                      const maxMood = stats.moodStats.reduce((prev, current) => 
                        (prev.count > current.count) ? prev : current
                      );
                      
                      // Only show recommendation if there are actual mood entries
                      if (maxMood.count > 0) {
                        const recommendation = getMoodRecommendation(maxMood._id);
                        return (
                          <div className={`rounded-xl border p-4 lg:p-6 ${
                            isDark 
                              ? 'bg-black border-white/10' 
                              : 'bg-white/60 backdrop-blur-sm border-pink-200/30 shadow-lg'
                          }`}>
                            <div className="flex items-start space-x-3 lg:space-x-4">
                              <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${
                                isDark ? 'bg-white/10' : 'bg-pink-100'
                              }`}>
                                <span className="text-lg lg:text-xl">{getMoodEmoji(maxMood._id)}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className={`text-sm lg:text-base font-semibold mb-2 ${
                                  isDark ? 'text-white' : 'text-gray-800'
                                }`}>
                                  {recommendation.title}
                                </h4>
                                <p className={`text-xs lg:text-sm leading-relaxed mb-3 ${
                                  isDark ? 'text-white/70' : 'text-gray-600'
                                }`}>
                                  {recommendation.message}
                                </p>
                                <div className={`inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg text-xs font-medium ${
                                  isDark 
                                    ? 'bg-white/10 text-white hover:bg-white/20' 
                                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                                } transition-colors`}>
                                  <span>💡 {recommendation.action}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}
              </div>

              {/* Planner Stats */}
              <div className="space-y-4 lg:space-y-6">
                <h3 className={`text-lg font-semibold mb-4 lg:mb-6 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Planning Progress
                </h3>
                <div className="space-y-4 lg:space-y-6">
                  {/* Todo Completion */}
                  <div className={`rounded-xl p-4 lg:p-6 border ${
                    isDark 
                      ? 'bg-black border-white/5' 
                      : 'bg-white/60 border-pink-200/30'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-white/70' : 'text-gray-600'
                      }`}>Task Completion</span>
                      <span className={`text-2xl lg:text-3xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        {plannerStats.completionRate}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className={isDark ? 'text-white/50' : 'text-gray-500'}>
                        {plannerStats.completedTodos} completed
                      </span>
                      <span className={isDark ? 'text-white/50' : 'text-gray-500'}>
                        {plannerStats.pendingTodos} pending
                      </span>
                    </div>
                  </div>
                  
                  {/* Scheduled Activities */}
                  <div className={`rounded-xl p-4 lg:p-6 border ${
                    isDark 
                      ? 'bg-black border-white/5' 
                      : 'bg-white/60 border-pink-200/30'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-sm font-medium ${
                        isDark ? 'text-white/70' : 'text-gray-600'
                      }`}>Scheduled Activities</span>
                      <span className={`text-2xl lg:text-3xl font-bold ${
                        isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        {plannerStats.totalActivities}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className={isDark ? 'text-white/50' : 'text-gray-500'}>
                        Across your weekly schedule
                      </span>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className={`rounded-xl border p-4 lg:p-6 ${
                    isDark 
                      ? 'bg-black border-white/10' 
                      : 'bg-white/60 backdrop-blur-sm border-pink-200/30 shadow-lg'
                  }`}>
                    <h4 className={`text-sm lg:text-base font-semibold mb-3 ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>
                      Quick Actions
                    </h4>
                    <div className="space-y-2">
                      <Link
                        to="/planner"
                        className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${
                          isDark 
                            ? 'bg-white/10 text-white hover:bg-white/20' 
                            : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                        }`}
                      >
                        <span>📝 Add New Todo</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <Link
                        to="/planner"
                        className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${
                          isDark 
                            ? 'bg-white/10 text-white hover:bg-white/20' 
                            : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                        }`}
                      >
                        <span>📅 Schedule Activity</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default DashboardPage;
