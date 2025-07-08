import React, { useState, useEffect } from 'react';
import Journal from '../components/Journal';
import { updateJournalEntry, getJournalEntry } from '../api/journal';
import { useTheme } from '../context/ThemeContext';
import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

const JournalPage = () => {
  const [viewMode, setViewMode] = useState('list'); // 'list', 'view', 'edit'
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const { isDark } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleViewEntry = async (entry) => {
    try {
      const fullEntry = await getJournalEntry(entry._id);
      setSelectedEntry(fullEntry);
      setViewMode('view');
    } catch (error) {
      console.error('Error fetching entry:', error);
    }
  };

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry);
    setEditFormData({
      title: entry.title || '',
      content: entry.content || '',
      mood: entry.mood || '',
      tags: entry.tags ? entry.tags.join(', ') : ''
    });
    setViewMode('edit');
  };

  const handleSaveEdit = async () => {
    try {
      const entryData = {
        ...editFormData,
        tags: editFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await updateJournalEntry(selectedEntry._id, entryData);
      setViewMode('list');
      setSelectedEntry(null);
      setEditFormData({});
    } catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  const handleCancelEdit = () => {
    setViewMode('list');
    setSelectedEntry(null);
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedEntry(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodColor = (mood) => {
    if (isDark) {
      return 'bg-white/10 text-white border border-white/20';
    }
    return 'bg-pink-100 text-pink-800 border border-pink-200';
  };

  const moods = [
    'Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Excited', 'Tired', 'Stressed'
  ];

  if (viewMode === 'view' && selectedEntry) {
    return (
      <>
        <div className={`min-h-screen relative overflow-hidden pt-16 ${
          isDark ? 'bg-black' : 'bg-gradient-to-br from-pink-50 via-white to-pink-100'
        }`}>
        {/* Background Effects */}
        <div className="absolute inset-0">
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-black"></div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-[0.015]">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(90deg, #fff 1px, transparent 1px),
                    linear-gradient(0deg, #fff 1px, transparent 1px)
                  `,
                  backgroundSize: '60px 60px'
                }}></div>
              </div>
              
              {/* Mouse-following effect */}
              <div 
                className="absolute w-80 h-80 bg-white/2 rounded-full blur-2xl pointer-events-none transition-all duration-700"
                style={{
                  left: mousePosition.x - 160,
                  top: mousePosition.y - 160,
                }}
              ></div>
            </>
          ) : (
            <>
              {/* Light mode gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-pink-100"></div>
              
              {/* Super light pink spots and decorative elements */}
              <div className="absolute top-20 left-10 w-32 h-32 border border-pink-200/30 rotate-45 rounded-lg"></div>
              <div className="absolute bottom-20 right-10 w-24 h-24 border border-pink-200/20 rounded-full"></div>
              <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-pink-200/25 transform rotate-12 rounded-md"></div>
              
              {/* Floating pink spots */}
              <div className="absolute top-40 right-1/4 w-8 h-8 bg-pink-200/20 rounded-full blur-sm"></div>
              <div className="absolute top-1/3 left-1/3 w-12 h-12 bg-pink-200/15 rounded-full blur-sm"></div>
              <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-pink-200/25 rounded-full blur-sm"></div>
              <div className="absolute top-2/3 left-1/6 w-10 h-10 bg-pink-200/18 rounded-full blur-sm"></div>
              <div className="absolute bottom-1/4 left-2/3 w-14 h-14 bg-pink-200/12 rounded-full blur-sm"></div>
              <div className="absolute top-1/4 right-1/6 w-9 h-9 bg-pink-200/22 rounded-full blur-sm"></div>
              
              {/* Subtle pink circles */}
              <div className="absolute top-16 right-16 w-20 h-20 border border-pink-200/15 rounded-full"></div>
              <div className="absolute bottom-32 left-20 w-16 h-16 border border-pink-200/20 rounded-full"></div>
              <div className="absolute top-1/2 right-8 w-12 h-12 border border-pink-200/18 rounded-full"></div>
              
              {/* Pink dots pattern */}
              <div className="absolute top-1/4 left-1/2 w-2 h-2 bg-pink-300/30 rounded-full"></div>
              <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-pink-300/25 rounded-full"></div>
              <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-pink-300/35 rounded-full"></div>
              <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-pink-300/20 rounded-full"></div>
              <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-pink-300/30 rounded-full"></div>
              
              {/* Mouse-following effect for light mode */}
              <div 
                className="absolute w-80 h-80 bg-pink-200/20 rounded-full blur-2xl pointer-events-none transition-all duration-700"
                style={{
                  left: mousePosition.x - 160,
                  top: mousePosition.y - 160,
                }}
              ></div>
            </>
          )}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-2xl ${
            isDark 
              ? 'bg-black/50 border-white/10' 
              : 'bg-white/80 border-pink-200/50'
          }`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
              <div className="flex-1">
                <h1 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  {selectedEntry.title || 'Untitled Entry'}
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-white/60' : 'text-gray-600'
                }`}>
                  {formatDate(selectedEntry.created_at)}
                </p>
              </div>
              <button
                onClick={handleBackToList}
                className={`px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isDark 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                Back to List
              </button>
            </div>

            {/* Mood Badge */}
            {selectedEntry.mood && (
              <div className="mb-6">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getMoodColor(selectedEntry.mood)}`}>
                  {selectedEntry.mood}
                </span>
              </div>
            )}

            {/* Content */}
            <div className="mb-6">
              <div className="prose prose-invert max-w-none">
                <p className={`leading-relaxed whitespace-pre-wrap ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>
                  {selectedEntry.content}
                </p>
              </div>
            </div>

            {/* Tags */}
            {selectedEntry.tags && selectedEntry.tags.length > 0 && (
              <div className="mb-6">
                <h3 className={`text-sm font-medium mb-3 ${
                  isDark ? 'text-white/70' : 'text-gray-600'
                }`}>Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEntry.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 text-sm rounded-full ${
                        isDark 
                          ? 'bg-white/10 text-white/60' 
                          : 'bg-pink-100 text-pink-700'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className={`flex space-x-3 pt-6 border-t ${
              isDark ? 'border-white/10' : 'border-pink-200/30'
            }`}>
              <button
                onClick={() => handleEditEntry(selectedEntry)}
                className={`px-4 py-2 rounded-xl transition-all duration-200 text-sm font-bold ${
                  isDark 
                    ? 'bg-white text-black hover:bg-white/90' 
                    : 'bg-pink-500 text-white hover:bg-pink-600'
                }`}
              >
                Edit Entry
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  }

  if (viewMode === 'edit' && selectedEntry) {
    return (
      <>
        <div className={`min-h-screen relative overflow-hidden ${
          isDark ? 'bg-black' : 'bg-gradient-to-br from-pink-50 via-white to-pink-100'
        }`}>
        {/* Background Effects */}
        <div className="absolute inset-0">
          {isDark ? (
            <>
              <div className="absolute inset-0 bg-black"></div>
              
              {/* Subtle grid pattern */}
              <div className="absolute inset-0 opacity-[0.015]">
                <div className="absolute inset-0" style={{
                  backgroundImage: `
                    linear-gradient(90deg, #fff 1px, transparent 1px),
                    linear-gradient(0deg, #fff 1px, transparent 1px)
                  `,
                  backgroundSize: '60px 60px'
                }}></div>
              </div>
            </>
          ) : (
            <>
              {/* Light mode gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-pink-100"></div>
              
              {/* Subtle pink patterns */}
              <div className="absolute top-20 left-10 w-32 h-32 border border-pink-200/30 rotate-45 rounded-lg"></div>
              <div className="absolute bottom-20 right-10 w-24 h-24 border border-pink-200/20 rounded-full"></div>
            </>
          )}
        </div>

        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-2xl ${
            isDark 
              ? 'bg-black/50 border-white/10' 
              : 'bg-white/80 border-pink-200/50'
          }`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
              <h1 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                Edit Journal Entry
              </h1>
              <button
                onClick={handleCancelEdit}
                className={`px-4 py-2 rounded-xl transition-all duration-200 text-sm font-medium ${
                  isDark 
                    ? 'bg-white/10 text-white hover:bg-white/20' 
                    : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                }`}
              >
                Cancel
              </button>
            </div>

            {/* Edit Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>
                  Title
                </label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, title: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark 
                      ? 'bg-white/5 text-white placeholder-white/40 border-white/10 focus:ring-white/20 focus:border-white/30' 
                      : 'bg-white/60 text-gray-800 placeholder-gray-500 border-pink-200/50 focus:ring-pink-200 focus:border-pink-300'
                  }`}
                  placeholder="Entry title..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>
                  Mood
                </label>
                <Listbox value={editFormData.mood} onChange={value => setEditFormData(prev => ({ ...prev, mood: value }))}>
                  {({ open }) => (
                    <div className="relative">
                      <Listbox.Button className="bg-red-500 text-white w-full px-4 py-3 border rounded-xl">
                        {editFormData.mood || 'Select mood...'}
                        <ChevronUpDownIcon className="w-5 h-5 ml-2 text-white" aria-hidden="true" />
                      </Listbox.Button>
                      <Listbox.Options className={`absolute z-10 mt-2 w-full rounded-xl shadow-2xl border max-h-60 ring-1 ring-black/10 overflow-auto focus:outline-none ${
                        isDark ? 'bg-gray-900/95 text-white border-white/20' : 'bg-white text-gray-900 border-pink-200/50'
                      }`}>
                        <Listbox.Option key="" value="" as={Fragment}>
                          {({ active, selected }) => (
                            <li
                              className={`cursor-pointer select-none relative py-2 pl-10 pr-4 rounded-xl transition-colors duration-150 ${
                                active ? (isDark ? 'bg-white/10' : 'bg-pink-100') : ''
                              } ${selected ? 'font-semibold' : 'font-normal'}`}
                            >
                              Select mood...
                              {selected ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                  <CheckIcon className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-pink-500'}`} aria-hidden="true" />
                                </span>
                              ) : null}
                            </li>
                          )}
                        </Listbox.Option>
                        {moods.map(mood => (
                          <Listbox.Option key={mood} value={mood} as={Fragment}>
                            {({ active, selected }) => (
                              <li
                                className={`cursor-pointer select-none relative py-2 pl-10 pr-4 rounded-xl transition-colors duration-150 ${
                                  active ? (isDark ? 'bg-white/10' : 'bg-pink-100') : ''
                                } ${selected ? 'font-semibold' : 'font-normal'}`}
                              >
                                {mood}
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <CheckIcon className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-pink-500'}`} aria-hidden="true" />
                                  </span>
                                ) : null}
                              </li>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </div>
                  )}
                </Listbox>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>
                  Content
                </label>
                <textarea
                  value={editFormData.content}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows="8"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 resize-none ${
                    isDark 
                      ? 'bg-white/5 text-white placeholder-white/40 border-white/10 focus:ring-white/20 focus:border-white/30' 
                      : 'bg-white/60 text-gray-800 placeholder-gray-500 border-pink-200/50 focus:ring-pink-200 focus:border-pink-300'
                  }`}
                  placeholder="Write your thoughts, feelings, or experiences..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-white/80' : 'text-gray-700'
                }`}>
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={editFormData.tags}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                    isDark 
                      ? 'bg-white/5 text-white placeholder-white/40 border-white/10 focus:ring-white/20 focus:border-white/30' 
                      : 'bg-white/60 text-gray-800 placeholder-gray-500 border-pink-200/50 focus:ring-pink-200 focus:border-pink-300'
                  }`}
                  placeholder="gratitude, reflection, goals..."
                />
              </div>

              <div className={`flex space-x-3 pt-6 border-t ${
                isDark ? 'border-white/10' : 'border-pink-200/30'
              }`}>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl transition-all duration-200 font-bold ${
                    isDark 
                      ? 'bg-white text-black hover:bg-white/90' 
                      : 'bg-pink-500 text-white hover:bg-pink-600'
                  }`}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className={`px-6 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isDark 
                      ? 'bg-white/10 text-white hover:bg-white/20' 
                      : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
  }

  return (
    <div className="pt-16">
      <Journal onViewEntry={handleViewEntry} onEditEntry={handleEditEntry} />
    </div>
  );
};

export default JournalPage;
