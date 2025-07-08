import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME_SLOTS = Array.from({ length: 24 }, (_, h) => `${h.toString().padStart(2, '0')}:00`);

const PRIORITY_COLORS = {
  low: '#10B981', // green
  medium: '#F59E0B', // amber
  high: '#EF4444' // red
};

const COLOR_OPTIONS = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
  '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
];

const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Planner() {
  const [activeTab, setActiveTab] = useState('todo');
  const [todos, setTodos] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Todo form state
  const [todoTitle, setTodoTitle] = useState('');
  const [todoDescription, setTodoDescription] = useState('');
  const [todoPriority, setTodoPriority] = useState('medium');
  const [todoDueDate, setTodoDueDate] = useState('');
  
  // Timetable form state
  const [selectedDay, setSelectedDay] = useState('monday');
  const [startHour, setStartHour] = useState('09');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('10');
  const [endMinute, setEndMinute] = useState('00');
  const [activityName, setActivityName] = useState('');
  const [activityColor, setActivityColor] = useState('#3B82F6');
  const [timetableError, setTimetableError] = useState('');
  
  const { isDark } = useTheme();

  // Theme-dependent classes
  const panelBg = isDark
    ? 'bg-black/60 backdrop-blur-md shadow-lg'
    : 'bg-white/40 backdrop-blur-md shadow-lg bg-gradient-to-b from-white/60 to-green-50/40';
  const panelBorder = isDark ? 'border-[#181818]/80' : 'border-green-200/80';
  const panelText = isDark ? 'text-gray-100' : 'text-gray-900';
  const panelSubText = isDark ? 'text-gray-400' : 'text-green-700/80';
  const panelTitle = isDark ? 'text-green-300' : 'text-green-700';
  const inputBg = isDark ? 'bg-black/40 text-gray-100' : 'bg-white/30 text-gray-900';
  const inputPlaceholder = isDark ? 'placeholder-gray-500' : 'placeholder-green-400';
  const buttonSelected = isDark ? 'border-green-400 bg-black/40 text-green-300' : 'border-green-400 bg-white/40 text-green-700';
  const buttonUnselected = isDark ? 'border-[#222]/80 bg-black/20 text-gray-200 hover:border-green-700 hover:text-green-300' : 'border-green-100/80 bg-white/20 text-gray-700 hover:border-green-400 hover:text-green-700';
  const submitBtn = isDark ? 'bg-green-400 text-black hover:bg-green-300' : 'bg-green-500 text-white hover:bg-green-400';

  useEffect(() => {
    fetchTodos();
    fetchTimetable();
  }, []);

  const fetchTodos = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTodos(Array.isArray(data) ? data : (Array.isArray(data.todos) ? data.todos : []));
    } catch (error) {
      console.error('Error fetching todos:', error);
      setTodos([]);
    }
  };

  const fetchTimetable = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/timetable/week`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTimetable(data);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!todoTitle.trim()) return;
    
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: todoTitle,
          description: todoDescription,
          priority: todoPriority,
          due_date: todoDueDate || null
        }),
      });
      
      if (res.ok) {
        setTodoTitle('');
        setTodoDescription('');
        setTodoPriority('medium');
        setTodoDueDate('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (todoId, completed) => {
    const token = localStorage.getItem('token');
    
    try {
      await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (todoId) => {
    const token = localStorage.getItem('token');
    
    try {
      await fetch(`${API_BASE_URL}/api/todos/${todoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const addTimetableEntry = async (e) => {
    e.preventDefault();
    setTimetableError('');
    if (!activityName.trim()) return;
    const sTime = `${startHour}:${startMinute}`;
    const eTime = `${endHour}:${endMinute}`;
    // Validate end > start
    const toMinutes = t => {
      const [h, m] = t.split(":").map(Number);
      return h * 60 + m;
    };
    if (toMinutes(eTime) <= toMinutes(sTime)) {
      setTimetableError('End time must be after start time.');
      return;
    }
    // Prevent duplicate or overlapping activities
    const dayActivities = timetable[selectedDay] || [];
    const overlap = dayActivities.some(entry => {
      const entryStart = toMinutes(entry.start_time);
      const entryEnd = toMinutes(entry.end_time);
      return (
        (toMinutes(sTime) < entryEnd && toMinutes(eTime) > entryStart)
      );
    });
    if (overlap) {
      setTimetableError('This activity overlaps with an existing one.');
      return;
    }
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/timetable`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          day: selectedDay,
          start_time: sTime,
          end_time: eTime,
          activity: activityName,
          color: activityColor
        }),
      });
      if (res.ok) {
        setActivityName('');
        fetchTimetable();
      }
    } catch (error) {
      console.error('Error adding timetable entry:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTimetableEntry = async (entryId) => {
    const token = localStorage.getItem('token');
    
    try {
      await fetch(`${API_BASE_URL}/api/timetable/${entryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTimetable();
    } catch (error) {
      console.error('Error deleting timetable entry:', error);
    }
  };

  const renderTodoList = () => (
    <div className={`flex-1 p-4 sm:p-6 rounded-2xl shadow-xl border ${panelBorder} ${panelBg}`}>
      <h2 className={`text-xl sm:text-2xl font-bold mb-4 text-center ${panelText}`}>To-Do List</h2>
      
      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mb-6">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="What needs to be done?"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            className={`w-full p-3 rounded-lg ${inputBg} ${inputPlaceholder} focus:outline-none`}
            maxLength={100}
          />
          
          <textarea
            placeholder="Description (optional)"
            value={todoDescription}
            onChange={(e) => setTodoDescription(e.target.value)}
            className={`w-full p-3 rounded-lg resize-none ${inputBg} ${inputPlaceholder} focus:outline-none`}
            rows={2}
            maxLength={200}
          />
          
          <div className="flex gap-3">
            <select
              value={todoPriority}
              onChange={(e) => setTodoPriority(e.target.value)}
              className={`flex-1 p-3 rounded-lg ${inputBg} focus:outline-none`}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <input
              type="date"
              value={todoDueDate}
              onChange={(e) => setTodoDueDate(e.target.value)}
              className={`flex-1 p-3 rounded-lg ${inputBg} focus:outline-none`}
            />
          </div>
          
          <button
            type="submit"
            disabled={!todoTitle.trim() || loading}
            className={`w-full py-3 rounded-lg font-semibold transition ${submitBtn} disabled:opacity-50`}
          >
            {loading ? 'Adding...' : 'Add Todo'}
          </button>
        </div>
      </form>
      
      {/* Todo List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {todos.length === 0 ? (
          <div className={`text-center py-8 ${panelSubText}`}>No todos yet. Add your first task!</div>
        ) : (
          todos.map(todo => (
            <div
              key={todo.id}
              className={`p-4 rounded-lg border ${isDark ? 'bg-gray-900/50' : 'bg-white/50'} ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTodo(todo.id, todo.completed)}
                  className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                    todo.completed 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-400 hover:border-green-400'
                  }`}
                >
                  {todo.completed && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                
                <div className="flex-1">
                  <div className={`font-semibold ${todo.completed ? 'line-through' : ''} ${panelText}`}>
                    {todo.title}
                  </div>
                  {todo.description && (
                    <div className={`text-sm mt-1 ${panelSubText}`}>{todo.description}</div>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium`}
                      style={{ backgroundColor: `${PRIORITY_COLORS[todo.priority]}20`, color: PRIORITY_COLORS[todo.priority] }}
                    >
                      {todo.priority}
                    </span>
                    {todo.due_date && (
                      <span className={`text-xs ${panelSubText}`}>
                        Due: {new Date(todo.due_date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className={`p-1 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderTimetable = () => (
    <div className={`flex-1 p-4 sm:p-6 rounded-2xl shadow-xl border ${panelBorder} ${panelBg}`}>
      <h2 className={`text-xl sm:text-2xl font-bold mb-4 text-center ${panelText}`}>Weekly Timetable</h2>
      
      {/* Add Entry Form */}
      <form onSubmit={addTimetableEntry} className="mb-6">
        <div className="grid grid-cols-3 gap-3 mb-3">
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className={`p-3 rounded-lg ${inputBg} focus:outline-none`}
          >
            {DAYS.map(day => (
              <option key={day} value={day}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </option>
            ))}
          </select>
          
          <div className="flex gap-1">
            <select value={startHour} onChange={e => setStartHour(e.target.value)} className={`p-3 rounded-lg ${inputBg} focus:outline-none`}>
              {[...Array(24).keys()].map(h => (
                <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <span className="self-center">:</span>
            <select value={startMinute} onChange={e => setStartMinute(e.target.value)} className={`p-3 rounded-lg ${inputBg} focus:outline-none`}>
              {[...Array(60).keys()].map(m => (
                <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-1">
            <select value={endHour} onChange={e => setEndHour(e.target.value)} className={`p-3 rounded-lg ${inputBg} focus:outline-none`}>
              {[...Array(24).keys()].map(h => (
                <option key={h} value={h.toString().padStart(2, '0')}>{h.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <span className="self-center">:</span>
            <select value={endMinute} onChange={e => setEndMinute(e.target.value)} className={`p-3 rounded-lg ${inputBg} focus:outline-none`}>
              {[...Array(60).keys()].map(m => (
                <option key={m} value={m.toString().padStart(2, '0')}>{m.toString().padStart(2, '0')}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex gap-3 mb-3">
          <input
            type="text"
            placeholder="Activity name"
            value={activityName}
            onChange={(e) => setActivityName(e.target.value)}
            className={`flex-1 p-3 rounded-lg ${inputBg} ${inputPlaceholder} focus:outline-none`}
            maxLength={50}
          />
          
          <div className="flex flex-nowrap overflow-x-auto w-full max-w-full gap-2 py-1 sm:flex-wrap sm:overflow-x-visible sm:gap-1">
            {COLOR_OPTIONS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setActivityColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition ${
                  activityColor === color ? 'border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        
        {timetableError && (
          <div className="text-red-500 text-sm mb-2">{timetableError}</div>
        )}
        
        <button
          type="submit"
          disabled={!activityName.trim() || loading}
          className={`w-full py-3 rounded-lg font-semibold transition ${submitBtn} disabled:opacity-50`}
        >
          {loading ? 'Adding...' : 'Add Activity'}
        </button>
      </form>
      
      {/* Timetable by Day */}
      <div className="space-y-4 max-h-96 overflow-y-auto px-1">
        {DAYS.map(day => {
          const dayActivities = timetable[day] || [];
          return (
            <div key={day} className={`p-4 rounded-lg w-full max-w-full overflow-x-auto ${isDark ? 'bg-gray-900/30' : 'bg-white/30'}`}>
              <h3 className={`font-semibold mb-3 ${panelText}`}>
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </h3>
              {dayActivities.length === 0 ? (
                <div className={`text-sm ${panelSubText} italic`}>No activities scheduled</div>
              ) : (
                <div className="space-y-2">
                  {dayActivities.map(entry => (
                    <div
                      key={entry.id}
                      className={`p-3 rounded-lg relative group w-full max-w-full break-words`}
                      style={{ backgroundColor: `${entry.color}20`, borderColor: entry.color, borderWidth: '1px' }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full max-w-full">
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium whitespace-pre-line break-words ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                            {entry.activity}
                          </div>
                          <div className={`text-xs ${panelSubText}`}>
                            {entry.start_time} - {entry.end_time}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTimetableEntry(entry.id)}
                          className={`p-1 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity ${
                            isDark ? 'hover:bg-red-500/20' : 'hover:bg-red-500/10'
                          }`}
                        >
                          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen w-full flex flex-col items-center ${isDark ? 'bg-black' : 'bg-gray-100'} pt-16`}>
      <div className="w-full max-w-7xl px-3 sm:px-6">
        <div className="mb-4 sm:mb-8 mt-0 flex items-center justify-between">
          <span className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${panelText} text-left block leading-tight`}>Plan Your Day</span>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('todo')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'todo' ? buttonSelected : buttonUnselected
            }`}
          >
            To-Do List
          </button>
          <button
            onClick={() => setActiveTab('timetable')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'timetable' ? buttonSelected : buttonUnselected
            }`}
          >
            Weekly Timetable
          </button>
        </div>
        
        {/* Content */}
        {activeTab === 'todo' ? renderTodoList() : renderTimetable()}
      </div>
    </div>
  );
} 