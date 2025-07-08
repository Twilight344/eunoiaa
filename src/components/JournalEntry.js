import React, { useState } from 'react';

const JournalEntry = ({ entry, onEdit, onDelete, onView }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getMoodColor = (mood) => {
    const moodColors = {
      'Happy': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Sad': 'bg-blue-100 text-blue-800 border-blue-200',
      'Angry': 'bg-red-100 text-red-800 border-red-200',
      'Anxious': 'bg-purple-100 text-purple-800 border-purple-200',
      'Calm': 'bg-green-100 text-green-800 border-green-200',
      'Excited': 'bg-orange-100 text-orange-800 border-orange-200',
      'Tired': 'bg-gray-100 text-gray-800 border-gray-200',
      'Stressed': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return moodColors[mood] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200">
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {entry.title || 'Untitled Entry'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(entry.created_at)}
            </p>
          </div>
          
          {/* Mood Badge */}
          {entry.mood && (
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getMoodColor(entry.mood)}`}>
              {entry.mood}
            </span>
          )}
        </div>

        {/* Content Preview */}
        <div className="mb-3">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {isExpanded ? entry.content : truncateText(entry.content)}
          </p>
          {entry.content.length > 150 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline mt-1"
            >
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {/* Tags */}
        {entry.tags && entry.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {entry.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <button
              onClick={() => onView(entry)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
            >
              View
            </button>
            <button
              onClick={() => onEdit(entry)}
              className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
            >
              Edit
            </button>
          </div>
          
          <button
            onClick={() => onDelete(entry._id)}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JournalEntry;
