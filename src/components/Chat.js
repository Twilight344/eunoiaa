import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Menu, Plus, Send, Volume2, BookOpen, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Lofi music playlist
const LOFI_PLAYLIST = [
  {
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    title: 'Lofi Chill Beats',
    artist: 'SoundHelix',
    cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    title: 'Evening Vibes',
    artist: 'SoundHelix',
    cover: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    title: 'Midnight Study',
    artist: 'SoundHelix',
    cover: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
  },
  {
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    title: 'Gentle Rain',
    artist: 'SoundHelix',
    cover: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
  },
];

// Custom hook for mobile detection
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 1023px)').matches : true
  );
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isMobile;
}

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [botTyping, setBotTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null); // session_id or null for new chat
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);
  const chatEndRef = useRef(null);

  // Real chat history from backend
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sessionId, setSessionId] = useState(null); // current session

  const { isDark } = useTheme();

  const [showResources, setShowResources] = useState(false);

  const isMobile = useIsMobile();

  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, currentTrack]);

  // Fetch chat history from backend
  const fetchChatHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setChatHistory(Array.isArray(data) ? data : []);
    } catch (e) {
      setChatHistory([]);
    }
    setLoadingHistory(false);
  };

  // Fetch chat history on mount
  useEffect(() => {
    fetchChatHistory();
  }, []);

  // Start a new chat session
  const handleNewChat = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await fetch(`${API_BASE_URL}/start_session`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setSessionId(data.session_id);
    setSelectedSessionId(data.session_id);
    setMessages([]);
    setShowSidebar(false);
    await fetchChatHistory();
  };

  // Select a chat session and load its messages
  const handleSelectChat = (session_id) => {
    setSelectedSessionId(session_id);
    setSessionId(session_id);
    if (!session_id) {
      setMessages([]);
      setShowSidebar(false);
      return;
    }
    const session = chatHistory.find(s => s.session_id === session_id);
    if (session) {
      setMessages(session.messages.map(m => ({ sender: m.sender, text: m.text })));
    }
    setShowSidebar(false);
  };

  // Send message logic (session-based, streaming from backend)
  const sendMessage = async () => {
    if (!input.trim() || botTyping) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Authentication error. Please log in again.");
      return;
    }
    let activeSessionId = sessionId;
    // If no session, create one automatically
    if (!activeSessionId) {
      try {
        const res = await fetch(`${API_BASE_URL}/start_session`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        activeSessionId = data.session_id;
        setSessionId(data.session_id);
        setSelectedSessionId(data.session_id);
        await fetchChatHistory();
      } catch (e) {
        alert('Could not start a new chat session. Please try again.');
        return;
      }
    }
    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    const botMessage = { sender: 'bot', text: '' };
    setMessages((prev) => [...prev, botMessage]);
    setBotTyping(true);
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage.text, session_id: activeSessionId }),
      });
      if (!response.body) throw new Error('No response stream');
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let aiText = '';
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const piece = line.replace('data: ', '');
            aiText += piece;
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1].text = aiText;
              return updated;
            });
          }
        }
      }
      await fetchChatHistory();
    } catch (error) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: 'bot', text: 'Sorry, I encountered an error. Please try again.' }
      ]);
    } finally {
      setBotTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const playNext = () => {
    setCurrentTrack((prev) => (prev + 1) % LOFI_PLAYLIST.length);
  };

  const playPrev = () => {
    setCurrentTrack((prev) => (prev - 1 + LOFI_PLAYLIST.length) % LOFI_PLAYLIST.length);
  };

  // Only allow one overlay at a time
  const openSidebar = () => { setShowSidebar(true); setShowResources(false); };
  const openResources = () => { setShowResources(true); setShowSidebar(false); };

  return (
    <div className={`h-screen relative overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900'}`}>
      <div className="relative z-10 flex h-screen w-full">
        {/* Sidebar: always visible on desktop, overlay on mobile */}
        <div className={`hidden lg:flex flex-col h-full w-80 border-r ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}>
          {/* Sidebar Header and content (copy from sidebar) */}
          <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}> 
            <div className="flex items-center justify-between">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Chat History</h2>
            </div>
            <button
              onClick={handleNewChat}
              className={`mt-6 w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium border ${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-800 text-white' : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'}`}
            >
              <Plus className="w-5 h-5" />
              <span className="text-lg">New Chat</span>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatHistory.map((session, index) => (
              <button
                key={session.session_id}
                onClick={() => handleSelectChat(session.session_id)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 group border ${selectedSessionId === session.session_id
                  ? isDark ? 'bg-gray-900 border-gray-700' : 'bg-blue-50 border-blue-300'
                  : isDark ? 'bg-black hover:bg-gray-900 border-gray-800' : 'bg-white hover:bg-gray-100 border-gray-200'}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className={`text-base font-medium truncate transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-700'}`}> 
                      {session.first_user_message ? session.first_user_message.slice(0, 50) : 'Chat Session'}
                      {session.first_user_message && session.first_user_message.length > 50 && '...'}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {/* Music Player and helpline (copy from sidebar) */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}> 
            <div className={`rounded-xl p-4 border ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}> 
              <div className="flex items-center gap-3 mb-3">
                <img 
                  src={LOFI_PLAYLIST[currentTrack].cover} 
                  alt="cover" 
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{LOFI_PLAYLIST[currentTrack].title}</p>
                  <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>{LOFI_PLAYLIST[currentTrack].artist}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={playPrev} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'} transition-colors`}>
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button onClick={togglePlay} className={`p-2 rounded-full transition-all duration-200 ${isDark ? 'bg-gray-900 hover:bg-gray-800' : 'bg-blue-50 hover:bg-blue-100'}`}>{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
                  <button onClick={playNext} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'} transition-colors`}>
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-blue-600'}`} />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className={`w-16 h-1 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-blue-200'}`}
                  />
                </div>
              </div>
            </div>
            <audio ref={audioRef} src={LOFI_PLAYLIST[currentTrack].url} loop />
          </div>
          <div className={`mt-auto p-4 text-xs flex items-center gap-2 border-t ${isDark ? 'text-gray-400 border-gray-800' : 'text-blue-700 border-blue-200'}`}> 
            <span role="img" aria-label="globe">🌎</span>
            <span>Global Suicide Prevention: <a href="tel:+18002738255" className={`underline ${isDark ? 'hover:text-white' : 'hover:text-blue-700'}`}>+1-800-273-8255</a> (24/7)</span>
          </div>
        </div>
        {/* Sidebar Overlay for mobile */}
        {showSidebar && !showResources && (
          <div className={`fixed inset-0 z-50 flex flex-col w-full h-full xl:hidden ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
            {/* Absolutely positioned close button */}
            <button
              onClick={() => setShowSidebar(false)}
              className="fixed top-3 right-3 z-[100] p-3 rounded-full bg-black/60 dark:bg-white/10 text-white dark:text-white hover:bg-black/80 dark:hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Close Sidebar"
              style={{fontSize: 28}}
            >
              <X className="w-7 h-7" />
            </button>
            <div className={`flex flex-col h-full w-full max-w-xs sm:max-w-sm ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'} border-r`}>
              {/* Sidebar Header and content (copy from sidebar) */}
              <div className={`p-4 sm:p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}> 
                <div className="flex items-center justify-between">
                  <h2 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Chat History</h2>
                </div>
                <button
                  onClick={handleNewChat}
                  className={`mt-6 w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 font-medium border ${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-800 text-white' : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700'}`}
                >
                  <Plus className="w-5 h-5" />
                  <span className="text-base sm:text-lg">New Chat</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2">
                {chatHistory.map((session, index) => (
                  <button
                    key={session.session_id}
                    onClick={() => handleSelectChat(session.session_id)}
                    className={`w-full text-left p-3 sm:p-4 rounded-xl transition-all duration-200 group border ${selectedSessionId === session.session_id
                      ? isDark ? 'bg-gray-900 border-gray-700' : 'bg-blue-50 border-blue-300'
                      : isDark ? 'bg-black hover:bg-gray-900 border-gray-800' : 'bg-white hover:bg-gray-100 border-gray-200'}`}
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm sm:text-base font-medium truncate transition-colors ${isDark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800 group-hover:text-blue-700'}`}> 
                          {session.first_user_message ? session.first_user_message.slice(0, 50) : 'Chat Session'}
                          {session.first_user_message && session.first_user_message.length > 50 && '...'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {/* Music Player and helpline (copy from sidebar) - now outside scrollable area */}
              <div className="p-2 sm:p-4 border-t border-b-0 border-l-0 border-r-0 border-solid border-gray-200 dark:border-gray-800">
                <div className={`rounded-xl p-2 sm:p-4 border ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}> 
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <img 
                      src={LOFI_PLAYLIST[currentTrack].cover} 
                      alt="cover" 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm sm:text-base font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{LOFI_PLAYLIST[currentTrack].title}</p>
                      <p className={`text-xs sm:text-sm truncate ${isDark ? 'text-gray-400' : 'text-blue-600'}`}>{LOFI_PLAYLIST[currentTrack].artist}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button onClick={playPrev} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'} transition-colors`}>
                        <SkipBack className="w-4 h-4" />
                      </button>
                      <button onClick={togglePlay} className={`p-2 rounded-full transition-all duration-200 ${isDark ? 'bg-gray-900 hover:bg-gray-800' : 'bg-blue-50 hover:bg-blue-100'}`}>{isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</button>
                      <button onClick={playNext} className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'} transition-colors`}>
                        <SkipForward className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Volume2 className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-blue-600'}`} />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className={`w-14 sm:w-16 h-1 rounded-lg appearance-none cursor-pointer ${isDark ? 'bg-gray-800' : 'bg-blue-200'}`}
                      />
                    </div>
                  </div>
                </div>
                <audio ref={audioRef} src={LOFI_PLAYLIST[currentTrack].url} loop />
              </div>
              {/* Global Suicide Prevention Number - now outside scrollable area */}
              <div className={`p-2 sm:p-4 text-xs flex items-center gap-2 border-t ${isDark ? 'text-gray-400 border-gray-800' : 'text-blue-700 border-blue-200'}`}> 
                <span role="img" aria-label="globe">🌎</span>
                <span>Global Suicide Prevention: <a href="tel:+18002738255" className={`underline ${isDark ? 'hover:text-white' : 'hover:text-blue-700'}`}>+1-800-273-8255</a> (24/7)</span>
              </div>
            </div>
            {/* Always-visible close button at bottom (mobile only) */}
            {isMobile && (
              <div className="fixed bottom-0 left-0 right-0 z-[101]">
                <button
                  onClick={() => setShowSidebar(false)}
                  className={`w-full py-4 mt-4 text-lg font-semibold rounded-b-xl transition-colors ${isDark ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
        {/* Resources Overlay for mobile */}
        {showResources && !showSidebar && (
          <div className={`fixed inset-0 z-50 flex flex-col w-full h-full xl:hidden ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
            {/* Absolutely positioned close button */}
            <button
              onClick={() => setShowResources(false)}
              className="fixed top-3 right-3 z-[100] p-3 rounded-full bg-black/60 dark:bg-white/10 text-white dark:text-white hover:bg-black/80 dark:hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Close Resources"
              style={{fontSize: 28}}
            >
              <X className="w-7 h-7" />
            </button>
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Resources
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24">
              {/* Crisis Support section */}
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Crisis Support</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <a href="tel:988" className={`font-medium underline ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}>988 - Crisis Lifeline</a>
                    <p className={`text-gray-400`}>24/7 crisis support</p>
                  </div>
                  <div>
                    <a href="sms:741741" className={`font-medium underline ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}>Text HOME to 741741</a>
                    <p className={`text-gray-400`}>Crisis Text Line</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>India Support</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <a href="tel:9152987821" className={`font-medium underline ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}>9152987821</a>
                    <p className={`text-gray-400`}>Vandrevala Foundation</p>
                  </div>
                  <div>
                    <a href="tel:04424640050" className={`font-medium underline ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}>044-24640050</a>
                    <p className={`text-gray-400`}>SNEHA Foundation</p>
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Tips</h4>
                <ul className={`space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                  <li>• Take deep breaths</li>
                  <li>• Ground yourself (5-4-3-2-1 technique)</li>
                  <li>• Reach out to someone you trust</li>
                  <li>• Remember: this feeling will pass</li>
                </ul>
              </div>
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>💖 A Note for You</h4>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>You matter. There is always help, So dont hesitate to reach out.</p>
              </div>
            </div>
            {/* Always-visible close button at bottom (mobile only) */}
            {isMobile && (
              <div className="fixed bottom-0 left-0 right-0 z-[101]">
                <button
                  onClick={() => setShowResources(false)}
                  className={`w-full py-4 mt-4 text-lg font-semibold rounded-b-xl transition-colors ${isDark ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        )}
        {/* Main Chat Area (always visible, never hidden) */}
        <div className="flex-1 flex flex-col w-full lg:ml-0 h-full">
          {/* Header */}
          <div className={`flex items-center justify-between p-3 sm:p-4 border-b ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}> 
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={openSidebar}
                className={`hidden lg:hidden p-2 rounded-lg ${isDark ? 'hover:bg-gray-900' : 'hover:bg-gray-100'} transition-colors`}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className={`text-lg sm:text-xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>Mental Health Support</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-green-700'}`}>Online</span>
              {/* Resources button for mobile */}
              <button
                onClick={openResources}
                className="hidden xl:hidden p-2 rounded-lg ml-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                aria-label="Open Resources"
              >
                <BookOpen className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-2 sm:p-6 space-y-3 sm:space-y-4" style={{minHeight: 0}}>
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 sm:mb-4 ${isDark ? 'bg-gray-900' : 'bg-blue-100'}`}> 
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Welcome to your safe space</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} max-w-md text-sm sm:text-base`}>
                  This is a judgment-free zone where you can share anything on your mind. 
                  Whether you need support, want to reflect, or just need someone to listen, I'm here for you.
                </p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className={`max-w-[90vw] sm:max-w-[70%] flex items-start gap-2 sm:gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border break-all ${msg.sender === 'user'
                    ? isDark
                      ? 'bg-gray-900 border-gray-700 text-white'
                      : 'bg-blue-100 border-blue-200 text-blue-900'
                    : isDark
                      ? 'bg-black border-gray-800 text-gray-200'
                      : 'bg-white border-gray-200 text-gray-800'}`}>{msg.text}</div>
                </div>
              </div>
            ))}
            {botTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-full sm:max-w-[70%] flex items-start gap-2 sm:gap-3">
                  <div className={`px-3 py-2 sm:px-4 sm:py-3 rounded-2xl border ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}> 
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="flex gap-0.5 sm:gap-1">
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-blue-400'}`}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-blue-400'}`} style={{animationDelay: '0.1s'}}></div>
                        <div className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-gray-400' : 'bg-blue-400'}`} style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-blue-700'}`}>Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          {/* Input Area */}
          <div className={`p-2 sm:p-4 border-t ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}> 
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share your thoughts..."
                  className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-sm sm:text-base ${isDark ? 'bg-black border-gray-800 text-white placeholder-gray-400 focus:ring-gray-700' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:ring-blue-200'}`}
                  disabled={botTyping}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={botTyping || !input.trim()}
                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border ${isDark ? 'bg-gray-900 hover:bg-gray-800 border-gray-800 text-white' : 'bg-blue-500 hover:bg-blue-600 border-blue-500 text-white'}`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
          {/* Mobile Nav Buttons (bottom bar) */}
          <div className={`flex lg:hidden w-full border-t z-20 ${isDark ? 'border-gray-800 bg-black' : 'border-blue-200 bg-blue-50'}`}> 
            <button
              onClick={openSidebar}
              className={`flex-1 flex flex-col items-center justify-center p-3 text-xs font-medium transition-colors ${isDark ? 'hover:bg-gray-900 text-white' : 'hover:bg-blue-100 text-blue-700'}`}
            >
              <Menu className="w-5 h-5 mb-1" />
              Chat History
            </button>
            <button
              onClick={openResources}
              className={`flex-1 flex flex-col items-center justify-center p-3 text-xs font-medium transition-colors ${isDark ? 'hover:bg-gray-900 text-white' : 'hover:bg-blue-700 text-blue-700'}`}
            >
              <BookOpen className="w-5 h-5 mb-1" />
              Resources
            </button>
          </div>
        </div>
        {/* Resources Panel for desktop */}
        <div className={`hidden xl:block w-80 border-l p-6 ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}> 
          <div className={`sticky top-0 pb-4 mb-4 border-b ${isDark ? 'bg-black border-gray-800' : 'bg-white border-gray-200'}`}> 
            <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}> 
              <svg className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-pink-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Resources
            </h3>
          </div>
          <div className="space-y-4">
            {/* Crisis Support section */}
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Crisis Support</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <a href="tel:988" className={`font-medium underline ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}>988 - Crisis Lifeline</a>
                  <p className={`text-gray-400`}>24/7 crisis support</p>
                </div>
                <div>
                  <a href="sms:741741" className={`font-medium underline ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}>Text HOME to 741741</a>
                  <p className={`text-gray-400`}>Crisis Text Line</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}> 
              <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>India Support</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <a href="tel:9152987821" className={`font-medium underline ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}>9152987821</a>
                  <p className={`text-gray-400`}>Vandrevala Foundation</p>
                </div>
                <div>
                  <a href="tel:04424640050" className={`font-medium underline ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'}`}>044-24640050</a>
                  <p className={`text-gray-400`}>SNEHA Foundation</p>
                </div>
              </div>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>Quick Tips</h4>
              <ul className={`space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                <li>• Take deep breaths</li>
                <li>• Ground yourself (5-4-3-2-1 technique)</li>
                <li>• Reach out to someone you trust</li>
                <li>• Remember: this feeling will pass</li>
              </ul>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h4 className={`font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>💖 A Note for You</h4>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>You matter. There is always help, So dont hesitate to reach out.</p>
            </div>
          </div>
        </div>
      </div>
      {/* Add theme-aware custom scrollbars */}
      <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: ${isDark ? '#18181b' : '#e0e7ef'};
        }
        ::-webkit-scrollbar-thumb {
          background: ${isDark ? '#374151' : '#60a5fa'};
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? '#6b7280' : '#ec4899'};
        }
        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? '#374151 #18181b' : '#60a5fa #e0e7ef'};
        }
        @media (min-width: 1024px) {
          .mobile-close-btn { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default Chat;
