import React, { useState, useEffect } from 'react';
import { createJournalEntry, getJournalEntries, deleteJournalEntry } from '../api/journal';
import { useTheme } from '../context/ThemeContext';
import { Listbox } from '@headlessui/react';
import { Fragment } from 'react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid';

const Journal = ({ onViewEntry, onEditEntry }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: '',
    tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moodFilter, setMoodFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { isDark } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const moods = [
    'Happy', 'Sad', 'Angry', 'Anxious', 'Calm', 'Excited', 'Tired', 'Stressed'
  ];

  useEffect(() => {
    fetchEntries();
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [currentPage, searchQuery, moodFilter]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchQuery,
        mood: moodFilter
      };
      const response = await getJournalEntries(params);
      setEntries(response.entries);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error('Error fetching entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const entryData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };
      
      await createJournalEntry(entryData);
      setFormData({ title: '', content: '', mood: '', tags: '' });
      fetchEntries();
    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (entryId) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await deleteJournalEntry(entryId);
        fetchEntries();
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getMoodColor = (mood) => {
    if (isDark) {
      return 'bg-white/10 text-white border border-white/20';
    }
    return 'bg-pink-100 text-pink-800 border border-pink-200';
  };

  return (
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

      <div className="relative z-10 max-w-6xl mx-auto p-6 pt-16">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Create Entry Form */}
          <div className="xl:col-span-1">
            <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-2xl ${
              isDark 
                ? 'bg-black/50 border-white/10' 
                : 'bg-white/80 border-pink-200/50'
            }`}>
              <h2 className={`text-xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                New Journal Entry
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-white/80' : 'text-gray-700'
                  }`}>
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
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
                  <Listbox value={formData.mood} onChange={value => setFormData(prev => ({ ...prev, mood: value }))}>
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 flex justify-between items-center shadow-sm ${
                          isDark
                            ? 'bg-gray-900/80 text-white border-white/20 focus:ring-white/30 focus:border-white/40'
                            : 'bg-white/60 text-gray-800 border-pink-200/50 focus:ring-pink-200 focus:border-pink-300'
                        }`}>
                          <span>{formData.mood || 'Select mood...'}</span>
                          <ChevronUpDownIcon className={`w-5 h-5 ml-2 ${isDark ? 'text-white/60' : 'text-gray-400'}`} aria-hidden="true" />
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
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="6"
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
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      isDark 
                        ? 'bg-white/5 text-white placeholder-white/40 border-white/10 focus:ring-white/20 focus:border-white/30' 
                        : 'bg-white/60 text-gray-800 placeholder-gray-500 border-pink-200/50 focus:ring-pink-200 focus:border-pink-300'
                    }`}
                    placeholder="gratitude, reflection, goals..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !formData.content.trim()}
                  className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
                    isDark 
                      ? 'bg-white text-black hover:bg-white/90 disabled:bg-white/20 disabled:cursor-not-allowed' 
                      : 'bg-pink-500 text-white hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Save Entry'}
                </button>
              </form>
            </div>
          </div>

          {/* Entries List */}
          <div className="xl:col-span-2">
            <div className={`backdrop-blur-xl rounded-2xl p-6 border shadow-2xl ${
              isDark 
                ? 'bg-black/50 border-white/10' 
                : 'bg-white/80 border-pink-200/50'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-3 sm:space-y-0">
                <h2 className={`text-xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  Journal Entries
                </h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search entries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      isDark 
                        ? 'bg-white/5 text-white placeholder-white/40 border-white/10 focus:ring-white/20 focus:border-white/30' 
                        : 'bg-white/60 text-gray-800 placeholder-gray-500 border-pink-200/50 focus:ring-pink-200 focus:border-pink-300'
                    }`}
                  />
                  <div className="w-full sm:w-48 mt-2 sm:mt-0">
                    <Listbox value={moodFilter} onChange={setMoodFilter}>
                      {({ open }) => (
                        <div className="relative">
                          <Listbox.Button className={`w-full px-4 py-2 border rounded-xl flex justify-between items-center focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm ${
                            isDark
                              ? 'bg-gray-900/80 text-white border-white/20 focus:ring-white/30 focus:border-white/40'
                              : 'bg-white/60 text-gray-800 border-pink-200/50 focus:ring-pink-200 focus:border-pink-300'
                          }`}>
                            <span>{moodFilter || 'All moods'}</span>
                            <ChevronUpDownIcon className={`w-5 h-5 ml-2 ${isDark ? 'text-white/60' : 'text-gray-400'}`} aria-hidden="true" />
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
                                  All moods
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
                </div>
              </div>

              {loading ? (
                <div className="text-center py-12">
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
                  }`}>Loading entries...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    isDark ? 'bg-white/10' : 'bg-pink-100'
                  }`}>
                    <svg className={`w-8 h-8 ${
                      isDark ? 'text-white/40' : 'text-pink-400'
                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className={`text-sm ${
                    isDark ? 'text-white/50' : 'text-gray-600'
                  }`}>No journal entries yet. Start writing your thoughts!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry) => (
                    <div key={entry._id} className={`rounded-xl p-4 border transition-all duration-200 ${
                      isDark 
                        ? 'bg-black/30 border-white/5 hover:border-white/10' 
                        : 'bg-white/60 border-pink-200/30 hover:border-pink-300/50'
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold mb-1 ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}>
                            {entry.title || 'Untitled Entry'}
                          </h3>
                          <p className={`text-sm mb-2 ${
                            isDark ? 'text-white/60' : 'text-gray-600'
                          }`}>
                            {new Date(entry.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onViewEntry(entry)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                              isDark 
                                ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20' 
                                : 'text-gray-600 hover:text-pink-700 bg-white/80 hover:bg-pink-100'
                            }`}
                          >
                            View
                          </button>
                          <button
                            onClick={() => onEditEntry(entry)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                              isDark 
                                ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20' 
                                : 'text-gray-600 hover:text-pink-700 bg-white/80 hover:bg-pink-100'
                            }`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry._id)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all duration-200 ${
                              isDark 
                                ? 'text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-400/20' 
                                : 'text-red-600 hover:text-red-700 bg-red-100 hover:bg-red-200'
                            }`}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p className={`text-sm leading-relaxed line-clamp-3 ${
                          isDark ? 'text-white/70' : 'text-gray-700'
                        }`}>
                          {entry.content}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        {entry.mood && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMoodColor(entry.mood)}`}>
                            {entry.mood}
                          </span>
                        )}
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 text-xs rounded-full ${
                                  isDark 
                                    ? 'bg-white/10 text-white/60' 
                                    : 'bg-pink-100 text-pink-700'
                                }`}
                              >
                                #{tag}
                              </span>
                            ))}
                            {entry.tags.length > 3 && (
                              <span className={`px-2 py-1 text-xs ${
                                isDark ? 'text-white/40' : 'text-gray-500'
                              }`}>
                                +{entry.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                      isDark 
                        ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20' 
                        : 'text-gray-600 hover:text-pink-700 bg-white/80 hover:bg-pink-100'
                    }`}
                  >
                    Previous
                  </button>
                  <span className={`text-sm ${
                    isDark ? 'text-white/60' : 'text-gray-600'
                  }`}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
                      isDark 
                        ? 'text-white/80 hover:text-white bg-white/10 hover:bg-white/20' 
                        : 'text-gray-600 hover:text-pink-700 bg-white/80 hover:bg-pink-100'
                    }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
