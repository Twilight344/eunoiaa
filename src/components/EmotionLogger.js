import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { jwtDecode } from 'jwt-decode';

const MOOD_CATEGORIES = [
  {
    label: 'Joy',
    moods: [
      'Excited', 'Content', 'Proud', 'Peaceful', 'Amused', 'Playful', 'Grateful', 'Optimistic', 'Inspired'
    ]
  },
  {
    label: 'Loved / Connected',
    moods: [
      'Affectionate', 'Loved', 'Adored', 'Romantic', 'Tender', 'Warm', 'Cared for', 'Friendly', 'Kind', 'Appreciated'
    ]
  },
  {
    label: 'Calm / At Ease',
    moods: [
      'Relaxed', 'Comfortable', 'Free', 'Peaceful', 'Serene', 'Safe', 'Secure'
    ]
  },
  {
    label: 'Thoughtful / Reflective',
    moods: [
      'Curious', 'Pensive', 'Nostalgic', 'Sentimental', 'Wondering', 'Aware'
    ]
  },
  {
    label: 'Sad / Down',
    moods: [
      'Sad', 'Lonely', 'Heartbroken', 'Disappointed', 'Depressed', 'Resigned', 'Left out', 'Empty', 'Tired'
    ]
  },
  {
    label: 'Anxious / Worried',
    moods: [
      'Nervous', 'Stressed', 'Anxious', 'Overwhelmed', 'Fearful', 'Insecure', 'Doubtful', 'Vulnerable', 'Cautious'
    ]
  },
  {
    label: 'Angry / Frustrated',
    moods: [
      'Angry', 'Annoyed', 'Bitter', 'Frustrated', 'Resentful', 'Offended', 'Impatient', 'Envious', 'Hateful'
    ]
  },
  {
    label: 'Afraid / Scared',
    moods: [
      'Scared', 'Terrified', 'Horrified', 'Panicked', 'Paranoid', 'Unsafe'
    ]
  },
  {
    label: 'Confused / Lost',
    moods: [
      'Confused', 'Lost', 'Baffled', 'Distracted', 'Skeptical', 'Shocked', 'Reluctant'
    ]
  },
  {
    label: 'Desire / Passionate',
    moods: [
      'Desire', 'Lust', 'Sexy', 'Craving', 'Lovesick'
    ]
  },
  {
    label: 'Motivated / Driven',
    moods: [
      'Determined', 'Hopeful', 'Focused', 'Courageous', 'Eager'
    ]
  },
  {
    label: 'Numb / Detached',
    moods: [
      'Apathetic', 'Withdrawn', 'Cold', 'Denial', 'Numb'
    ]
  }
];

// Default options for the three questions
const DEFAULT_LOCATIONS = ['Home', 'Work', 'Outside'];
const DEFAULT_COMPANIES = ['Friends', 'Family', 'Alone'];
const DEFAULT_ACTIVITIES = ['Working', 'Exercising', 'Socializing', 'Relaxing', 'Eating', 'Traveling'];

// Mood descriptions and motivational messages
const MOOD_INSIGHTS = {
  Excited: {
    description: 'You are feeling a surge of energy and enthusiasm.',
    can: 'Channel this energy into creative or productive activities. Share your excitement with others.',
    cannot: 'It may be hard to sit still or focus on slow or repetitive tasks.',
    motivation: 'Ride the wave! Use your excitement to inspire yourself and those around you.'
  },
  Content: {
    description: 'You feel satisfied and at ease with your current situation.',
    can: 'Enjoy the present moment and appreciate what you have.',
    cannot: 'You may not feel the urge to seek out new challenges right now.',
    motivation: 'Contentment is a gift. Savor it and let it recharge you.'
  },
  Proud: {
    description: 'You are feeling accomplished and confident in yourself.',
    can: 'Acknowledge your achievements and celebrate your progress.',
    cannot: 'You may not want to dwell on past mistakes.',
    motivation: 'Let your pride fuel your next steps. You earned this!' 
  },
  Peaceful: {
    description: 'You are calm and at peace with yourself and your surroundings.',
    can: 'Relax, meditate, or simply enjoy the stillness.',
    cannot: 'You may not want to engage in stressful or chaotic activities.',
    motivation: 'Peace is powerful. Let it ground you.'
  },
  Amused: {
    description: 'You find things funny or entertaining.',
    can: 'Share a laugh, watch something funny, or enjoy playful moments.',
    cannot: 'You may not take things too seriously right now.',
    motivation: 'Laughter is medicine. Spread your joy!'
  },
  Playful: {
    description: 'You are in a lighthearted and fun mood.',
    can: 'Engage in games, jokes, or creative play.',
    cannot: 'You may not want to focus on serious matters.',
    motivation: 'Let your inner child out. Play is important!'
  },
  Grateful: {
    description: 'You are appreciating the good things in your life.',
    can: 'Express thanks to others and savor positive moments.',
    cannot: 'It may be hard to dwell on negatives right now.',
    motivation: 'Gratitude is powerful—let it fuel your day!'
  },
  Optimistic: {
    description: 'You are hopeful and positive about the future.',
    can: 'Set goals and look forward to new opportunities.',
    cannot: 'You may not be weighed down by doubts or fears.',
    motivation: 'Keep your optimism alive. It lights the way forward.'
  },
  Inspired: {
    description: 'You feel motivated by new ideas or possibilities.',
    can: 'Start a new project or pursue a creative idea.',
    cannot: 'You may not want to stick to routine tasks.',
    motivation: 'Let inspiration move you to action!'
  },
  Affectionate: {
    description: 'You feel warmth and fondness for others.',
    can: 'Express your feelings to loved ones.',
    cannot: 'You may not want to be distant or reserved.',
    motivation: 'Share your affection. It strengthens bonds.'
  },
  Loved: {
    description: 'You feel cared for and valued by others.',
    can: 'Enjoy the support and connection you have.',
    cannot: 'You may not feel alone or isolated.',
    motivation: 'Let love lift you up and remind you of your worth.'
  },
  Adored: {
    description: 'You feel cherished and deeply appreciated.',
    can: 'Bask in the attention and care you receive.',
    cannot: 'You may not want to hide your happiness.',
    motivation: 'You are special. Let yourself feel adored.'
  },
  Romantic: {
    description: 'You are feeling love and attraction.',
    can: 'Express your feelings to someone special.',
    cannot: 'You may not want to be alone.',
    motivation: 'Let romance add color to your life.'
  },
  Tender: {
    description: 'You feel gentle and caring.',
    can: 'Show kindness and compassion to others.',
    cannot: 'You may not want to be harsh or critical.',
    motivation: 'Tenderness is strength. Share it freely.'
  },
  Warm: {
    description: 'You feel cozy and emotionally open.',
    can: 'Connect with others and share your warmth.',
    cannot: 'You may not want to be cold or distant.',
    motivation: 'Let your warmth comfort those around you.'
  },
  'Cared for': {
    description: 'You feel supported and looked after.',
    can: 'Accept help and enjoy the feeling of being cared for.',
    cannot: 'You may not want to be independent right now.',
    motivation: 'You deserve care and kindness.'
  },
  Friendly: {
    description: 'You are open to socializing and making connections.',
    can: 'Reach out to friends or make new ones.',
    cannot: 'You may not want to be alone.',
    motivation: 'Friendliness opens doors. Keep reaching out!'
  },
  Kind: {
    description: 'You are feeling generous and considerate.',
    can: 'Help others and show understanding.',
    cannot: 'You may not want to be selfish or rude.',
    motivation: 'Kindness is contagious. Spread it.'
  },
  Appreciated: {
    description: 'You feel recognized and valued.',
    can: 'Accept compliments and enjoy your achievements.',
    cannot: 'You may not want to downplay your contributions.',
    motivation: 'You matter. Let yourself feel appreciated.'
  },
  Relaxed: {
    description: 'You are free from tension and stress.',
    can: 'Take it easy and enjoy restful activities.',
    cannot: 'You may not want to rush or worry.',
    motivation: 'Relaxation is essential. Enjoy it.'
  },
  Comfortable: {
    description: 'You feel at ease and secure.',
    can: 'Enjoy your current situation and surroundings.',
    cannot: 'You may not want to make big changes right now.',
    motivation: 'Comfort is valuable. Savor it.'
  },
  Free: {
    description: 'You feel unconstrained and liberated.',
    can: 'Express yourself openly and take risks.',
    cannot: 'You may not want to be restricted or controlled.',
    motivation: 'Freedom is precious. Use it wisely.'
  },
  Serene: {
    description: 'You are in a state of deep calm.',
    can: 'Meditate, reflect, or simply be present.',
    cannot: 'You may not want to engage in chaos or drama.',
    motivation: 'Serenity is a gift. Protect it.'
  },
  Safe: {
    description: 'You feel protected and secure.',
    can: 'Trust your environment and those around you.',
    cannot: 'You may not want to take unnecessary risks.',
    motivation: 'Safety allows growth. You are protected.'
  },
  Secure: {
    description: 'You feel stable and confident.',
    can: 'Make plans and trust in your abilities.',
    cannot: 'You may not want to doubt yourself.',
    motivation: 'Security breeds confidence. You are capable.'
  },
  Curious: {
    description: 'You are interested in learning and exploring.',
    can: 'Ask questions and seek new experiences.',
    cannot: 'You may not want to stick to the familiar.',
    motivation: 'Curiosity leads to growth. Keep exploring!'
  },
  Pensive: {
    description: 'You are deep in thought and reflection.',
    can: 'Contemplate and process your thoughts.',
    cannot: 'You may not want to rush decisions.',
    motivation: 'Reflection brings wisdom. Take your time.'
  },
  Nostalgic: {
    description: 'You are remembering fondly the past.',
    can: 'Appreciate your memories and experiences.',
    cannot: 'You may not want to focus only on the present.',
    motivation: 'Nostalgia connects you to your journey.'
  },
  Sentimental: {
    description: 'You are feeling emotional about meaningful things.',
    can: 'Express your feelings and cherish moments.',
    cannot: 'You may not want to be detached or cold.',
    motivation: 'Sentimentality shows you care deeply.'
  },
  Wondering: {
    description: 'You are questioning and seeking answers.',
    can: 'Explore possibilities and consider alternatives.',
    cannot: 'You may not want to accept things at face value.',
    motivation: 'Wonder leads to discovery. Keep questioning.'
  },
  Aware: {
    description: 'You are conscious and present.',
    can: 'Notice details and be mindful of your surroundings.',
    cannot: 'You may not want to be distracted or unaware.',
    motivation: 'Awareness is a superpower. Stay present.'
  },
  Sad: {
    description: 'You are feeling down and sorrowful.',
    can: 'Allow yourself to feel and process your emotions.',
    cannot: 'You may not want to force happiness or positivity.',
    motivation: 'Sadness is valid. You will feel better again.'
  },
  Lonely: {
    description: 'You feel isolated and disconnected.',
    can: 'Reach out to others or seek connection.',
    cannot: 'You may not want to be alone right now.',
    motivation: 'Loneliness is temporary. Connection is possible.'
  },
  Heartbroken: {
    description: 'You are deeply hurt and grieving.',
    can: 'Allow yourself to heal and process your pain.',
    cannot: 'You may not want to rush your healing.',
    motivation: 'Healing takes time. Be gentle with yourself.'
  },
  Disappointed: {
    description: 'You feel let down by expectations.',
    can: 'Process your feelings and adjust your expectations.',
    cannot: 'You may not want to ignore your feelings.',
    motivation: 'Disappointment teaches resilience. You will bounce back.'
  },
  Depressed: {
    description: 'You are feeling low and hopeless.',
    can: 'Seek support and professional help if needed.',
    cannot: 'You may not want to isolate yourself.',
    motivation: 'Depression is treatable. You are not alone.'
  },
  Resigned: {
    description: 'You have accepted a difficult situation.',
    can: 'Focus on what you can control and find peace.',
    cannot: 'You may not want to fight against reality.',
    motivation: 'Acceptance can bring peace. You are strong.'
  },
  'Left out': {
    description: 'You feel excluded and overlooked.',
    can: 'Seek inclusion or find your own community.',
    cannot: 'You may not want to isolate yourself further.',
    motivation: 'You belong somewhere. Keep seeking your tribe.'
  },
  Empty: {
    description: 'You feel hollow and lacking purpose.',
    can: 'Explore what gives you meaning and fulfillment.',
    cannot: 'You may not want to ignore your deeper needs.',
    motivation: 'Emptiness can be filled. Your purpose awaits.'
  },
  Tired: {
    description: 'You are exhausted and need rest.',
    can: 'Take care of yourself and get adequate rest.',
    cannot: 'You may not want to push yourself too hard.',
    motivation: 'Rest is essential. You deserve to recharge.'
  },
  Nervous: {
    description: 'You are feeling anxious and on edge.',
    can: 'Practice calming techniques and self-care.',
    cannot: 'You may not want to ignore your anxiety.',
    motivation: 'Nervousness is temporary. You can find calm.'
  },
  Stressed: {
    description: 'You are under pressure and overwhelmed.',
    can: 'Prioritize tasks and practice stress management.',
    cannot: 'You may not want to take on more responsibilities.',
    motivation: 'Stress is manageable. You can handle this.'
  },
  Anxious: {
    description: 'You are worried and uneasy.',
    can: 'Practice breathing exercises and grounding techniques.',
    cannot: 'You may not want to ignore your anxiety.',
    motivation: 'Anxiety is treatable. You can find peace.'
  },
  Overwhelmed: {
    description: 'You feel like you have too much to handle.',
    can: 'Break tasks into smaller steps and ask for help.',
    cannot: 'You may not want to take on more right now.',
    motivation: 'You can handle this one step at a time.'
  },
  Fearful: {
    description: 'You are afraid and scared.',
    can: 'Seek support and practice self-soothing techniques.',
    cannot: 'You may not want to face your fears alone.',
    motivation: 'Fear is natural. You can find courage.'
  },
  Insecure: {
    description: 'You are doubting yourself and your abilities.',
    can: 'Practice self-compassion and focus on your strengths.',
    cannot: 'You may not want to compare yourself to others.',
    motivation: 'You are capable and worthy. Believe in yourself.'
  },
  Doubtful: {
    description: 'You are uncertain and questioning.',
    can: 'Gather information and trust your judgment.',
    cannot: 'You may not want to rush into decisions.',
    motivation: 'Doubt can lead to clarity. Trust the process.'
  },
  Vulnerable: {
    description: 'You are feeling exposed and sensitive.',
    can: 'Protect yourself and seek support when needed.',
    cannot: 'You may not want to ignore your feelings.',
    motivation: 'Vulnerability is strength. You are brave.'
  },
  Cautious: {
    description: 'You are being careful and watchful.',
    can: 'Trust your instincts and take calculated risks.',
    cannot: 'You may not want to be reckless.',
    motivation: 'Caution protects you. Trust your judgment.'
  },
  Angry: {
    description: 'You are feeling mad and frustrated.',
    can: 'Express your anger healthily and set boundaries.',
    cannot: 'You may not want to suppress your feelings.',
    motivation: 'Anger can be channeled into positive action.'
  },
  Annoyed: {
    description: 'You are irritated and bothered.',
    can: 'Address the source of irritation or let it go.',
    cannot: 'You may not want to dwell on minor issues.',
    motivation: 'Annoyance is temporary. Focus on what matters.'
  },
  Bitter: {
    description: 'You are feeling resentful and cynical.',
    can: 'Process your feelings and work toward forgiveness.',
    cannot: 'You may not want to hold onto resentment.',
    motivation: 'Bitterness can be released. Choose peace.'
  },
  Frustrated: {
    description: 'You are feeling blocked and hindered.',
    can: 'Find alternative approaches and ask for help.',
    cannot: 'You may not want to give up easily.',
    motivation: 'Frustration can fuel determination. Keep going.'
  },
  Resentful: {
    description: 'You are feeling wronged and bitter.',
    can: 'Process your feelings and work toward resolution.',
    cannot: 'You may not want to hold onto resentment.',
    motivation: 'Resentment can be released. Choose freedom.'
  },
  Offended: {
    description: 'You feel insulted and disrespected.',
    can: 'Address the issue directly or let it go.',
    cannot: 'You may not want to ignore your feelings.',
    motivation: 'Your feelings are valid. Stand up for yourself.'
  },
  Impatient: {
    description: 'You are eager for things to happen quickly.',
    can: 'Practice patience and focus on what you can control.',
    cannot: 'You may not want to rush important things.',
    motivation: 'Patience brings better results. Trust the timing.'
  },
  Envious: {
    description: 'You are feeling jealous of others.',
    can: 'Focus on your own journey and celebrate others.',
    cannot: 'You may not want to compare yourself to others.',
    motivation: 'Your journey is unique. Focus on your path.'
  },
  Hateful: {
    description: 'You are feeling intense dislike and anger.',
    can: 'Process your feelings and seek understanding.',
    cannot: 'You may not want to act on hateful impulses.',
    motivation: 'Hate can be transformed. Choose love.'
  },
  Scared: {
    description: 'You are feeling frightened and afraid.',
    can: 'Seek safety and support from trusted people.',
    cannot: 'You may not want to face your fears alone.',
    motivation: 'Fear is natural. You can find safety.'
  },
  Terrified: {
    description: 'You are extremely frightened and panicked.',
    can: 'Seek immediate help and support.',
    cannot: 'You may not want to handle this alone.',
    motivation: 'You are not alone. Help is available.'
  },
  Horrified: {
    description: 'You are deeply shocked and disturbed.',
    can: 'Seek support and allow yourself to process.',
    cannot: 'You may not want to ignore your feelings.',
    motivation: 'Shock is temporary. You will process this.'
  },
  Panicked: {
    description: 'You are in a state of extreme anxiety.',
    can: 'Practice breathing exercises and seek help.',
    cannot: 'You may not want to handle this alone.',
    motivation: 'Panic is temporary. You can find calm.'
  },
  Paranoid: {
    description: 'You are feeling suspicious and mistrustful.',
    can: 'Seek professional help and support.',
    cannot: 'You may not want to isolate yourself.',
    motivation: 'Paranoia is treatable. You can find help.'
  },
  Unsafe: {
    description: 'You feel threatened and in danger.',
    can: 'Seek safety and support immediately.',
    cannot: 'You may not want to stay in dangerous situations.',
    motivation: 'Your safety matters. Get help if needed.'
  },
  Confused: {
    description: 'You are feeling uncertain and unclear.',
    can: 'Ask questions and seek clarification.',
    cannot: 'You may not want to make decisions hastily.',
    motivation: 'Confusion is temporary. Clarity will come.'
  },
  Lost: {
    description: 'You are feeling directionless and uncertain.',
    can: 'Seek guidance and trust your instincts.',
    cannot: 'You may not want to make major decisions now.',
    motivation: 'Being lost can lead to new discoveries.'
  },
  Baffled: {
    description: 'You are completely puzzled and bewildered.',
    can: 'Ask for help and break things down.',
    cannot: 'You may not want to figure everything out alone.',
    motivation: 'Confusion is a step toward understanding.'
  },
  Distracted: {
    description: 'You are having trouble focusing.',
    can: 'Minimize distractions and create a focused environment.',
    cannot: 'You may not want to multitask right now.',
    motivation: 'Focus can be regained. Take it step by step.'
  },
  Skeptical: {
    description: 'You are questioning and doubtful.',
    can: 'Gather evidence and trust your judgment.',
    cannot: 'You may not want to accept things without question.',
    motivation: 'Skepticism can protect you. Trust your instincts.'
  },
  Shocked: {
    description: 'You are surprised and stunned.',
    can: 'Take time to process and seek support.',
    cannot: 'You may not want to make decisions immediately.',
    motivation: 'Shock is temporary. You will process this.'
  },
  Reluctant: {
    description: 'You are hesitant and unwilling.',
    can: 'Consider your options and trust your instincts.',
    cannot: 'You may not want to be pressured into decisions.',
    motivation: 'Your hesitation may be protecting you.'
  },
  Desire: {
    description: 'You are feeling strong wants and needs.',
    can: 'Acknowledge your desires and set healthy boundaries.',
    cannot: 'You may not want to ignore your needs.',
    motivation: 'Desire can motivate positive change.'
  },
  Lust: {
    description: 'You are feeling strong physical attraction.',
    can: 'Acknowledge your feelings and express them appropriately.',
    cannot: 'You may not want to suppress your natural feelings.',
    motivation: 'Lust is natural. Express it healthily.'
  },
  Sexy: {
    description: 'You are feeling attractive and confident.',
    can: 'Embrace your attractiveness and express yourself.',
    cannot: 'You may not want to hide your confidence.',
    motivation: 'You are attractive. Own your confidence.'
  },
  Craving: {
    description: 'You are feeling strong wants and needs.',
    can: 'Acknowledge your cravings and find healthy outlets.',
    cannot: 'You may not want to ignore your needs.',
    motivation: 'Cravings can guide you toward fulfillment.'
  },
  Lovesick: {
    description: 'You are deeply affected by love or longing.',
    can: 'Express your feelings and seek connection.',
    cannot: 'You may not want to suppress your emotions.',
    motivation: 'Love is powerful. Let it move you.'
  },
  Determined: {
    description: 'You are focused and committed to your goals.',
    can: 'Channel your determination into productive action.',
    cannot: 'You may not want to give up easily.',
    motivation: 'Determination leads to achievement. Keep going!'
  },
  Hopeful: {
    description: 'You are optimistic about the future.',
    can: 'Set goals and work toward positive outcomes.',
    cannot: 'You may not want to dwell on negative possibilities.',
    motivation: 'Hope is powerful. Let it guide you forward.'
  },
  Focused: {
    description: 'You are concentrated and attentive.',
    can: 'Channel your focus into productive work.',
    cannot: 'You may not want to be distracted.',
    motivation: 'Focus is a superpower. Use it wisely.'
  },
  Courageous: {
    description: 'You are brave and willing to take risks.',
    can: 'Face challenges and step out of your comfort zone.',
    cannot: 'You may not want to let fear hold you back.',
    motivation: 'Courage is contagious. Inspire others!'
  },
  Eager: {
    description: 'You are excited and ready for action.',
    can: 'Channel your enthusiasm into productive activities.',
    cannot: 'You may not want to wait or delay.',
    motivation: 'Eagerness can drive success. Use your energy!'
  },
  Apathetic: {
    description: 'You are feeling indifferent and unmotivated.',
    can: 'Allow yourself to rest and find what interests you.',
    cannot: 'You may not want to force enthusiasm.',
    motivation: 'Apathy is temporary. Interest will return.'
  },
  Withdrawn: {
    description: 'You are pulling back and isolating yourself.',
    can: 'Reach out to others and seek connection.',
    cannot: 'You may not want to be alone right now.',
    motivation: 'Connection is healing. You are not alone.'
  },
  Cold: {
    description: 'You are feeling distant and unemotional.',
    can: 'Allow yourself to feel and process emotions.',
    cannot: 'You may not want to suppress your feelings.',
    motivation: 'Warmth will return. Be patient with yourself.'
  },
  Denial: {
    description: 'You are refusing to accept something.',
    can: 'Give yourself time to process.',
    cannot: 'You may not want to face reality yet.',
    motivation: 'Acceptance comes in stages.'
  },
  Numb: {
    description: 'You feel little or no emotion.',
    can: 'Rest and allow yourself to feel again.',
    cannot: 'You may not want to force emotions.',
    motivation: 'Numbness is temporary. You will feel again.'
  }
};

const DEFAULT_USER_OPTIONS = { locations: [], companies: [], activities: [] };
const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function EmotionLogger() {
  const [selected, setSelected] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // New state for the three questions
  const [location, setLocation] = useState('');
  const [company, setCompany] = useState('');
  const [activity, setActivity] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [customActivity, setCustomActivity] = useState('');
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [showCustomCompany, setShowCustomCompany] = useState(false);
  const [showCustomActivity, setShowCustomActivity] = useState(false);
  const [userOptions, setUserOptions] = useState({
    locations: [],
    companies: [],
    activities: []
  });
  
  const { theme, isDark } = useTheme();

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
  const insightBg = panelBg;
  const insightTitle = isDark ? 'text-green-300' : 'text-green-700';
  const insightDesc = isDark ? 'text-gray-200' : 'text-gray-800';
  const insightMotivation = isDark ? 'text-green-400' : 'text-green-700';

  // Fetch user options on component mount
  const fetchUserOptions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-options`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUserOptions({
        ...DEFAULT_USER_OPTIONS,
        ...data,
        locations: Array.isArray(data.locations) ? data.locations : [],
        companies: Array.isArray(data.companies) ? data.companies : [],
        activities: Array.isArray(data.activities) ? data.activities : [],
      });
    } catch (error) {
      console.error('Error fetching user options:', error);
    }
  };

  useEffect(() => {
    fetchUserOptions();
  }, []);

  useEffect(() => {
    const fetchLogs = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(`${API_BASE_URL}/api/emotion`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLogs(Array.isArray(data) ? data : []);
    };
    fetchLogs();
  }, [success]);

  // Add custom option
  const addCustomOption = async (type, value) => {
    const token = localStorage.getItem('token');
    if (!token || !value.trim()) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/user-options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type, value: value.trim() }),
      });
      if (res.ok) {
        await fetchUserOptions();
        // Set the new option as selected
        if (type === 'location') {
          setLocation(value.trim());
          setShowCustomLocation(false);
          setCustomLocation('');
        } else if (type === 'company') {
          setCompany(value.trim());
          setShowCustomCompany(false);
          setCustomCompany('');
        } else if (type === 'activity') {
          setActivity(value.trim());
          setShowCustomActivity(false);
          setCustomActivity('');
        }
      }
    } catch (error) {
      console.error('Error adding custom option:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setSuccess(false);
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/api/emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ 
        mood: selected, 
        note, 
        intensity,
        location,
        company,
        activity
      }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setSelected(null);
      setNote('');
      setIntensity(5);
      setLocation('');
      setCompany('');
      setActivity('');
      setTimeout(() => setSuccess(false), 2000);
    }
  };

  // Render option buttons with custom option functionality
  const renderOptionButtons = (options, selectedValue, setSelectedValue, showCustom, setShowCustom, customValue, setCustomValue, type) => (
    <div className="mb-3">
      <div className="flex flex-wrap gap-2 mb-2">
        {options.map(option => (
          <button
            key={option}
            type="button"
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-all focus:outline-none ${
              selectedValue === option ? buttonSelected : buttonUnselected
            }`}
            onClick={() => setSelectedValue(option)}
          >
            {option}
          </button>
        ))}
        <button
          type="button"
          className={`px-3 py-1 rounded-full border text-xs font-medium transition-all focus:outline-none ${
            isDark ? 'border-green-500 bg-green-500/20 text-green-300' : 'border-green-500 bg-green-500/20 text-green-700'
          }`}
          onClick={() => setShowCustom(!showCustom)}
        >
          +
        </button>
      </div>
      {showCustom && (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder={`Add custom ${type}...`}
            className={`flex-1 px-3 py-1 rounded-lg text-xs ${inputBg} ${inputPlaceholder} focus:outline-none`}
            maxLength={20}
          />
          <button
            type="button"
            onClick={() => addCustomOption(type, customValue)}
            className={`px-3 py-1 rounded-lg text-xs font-medium ${submitBtn}`}
            disabled={!customValue.trim()}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );

  // Logger panel
  const renderLogger = () => (
    <div className={`flex-1 flex flex-col justify-center p-4 sm:p-6 rounded-2xl shadow-xl border ${panelBorder} ${panelBg} min-w-0 max-w-full lg:max-w-[400px]`}>
      <h2 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center ${panelText}`}>Log Mood</h2>
      <form onSubmit={handleSubmit}>
        <div className="max-h-48 sm:max-h-56 overflow-y-auto mb-3 sm:mb-4 pr-2">
          {MOOD_CATEGORIES.map(category => (
            <div key={category.label} className="mb-2">
              <div className={`text-xs font-semibold mb-1 pl-1 uppercase tracking-wider ${panelSubText}`}>{category.label}</div>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {category.moods.map(mood => (
                  <button
                    type="button"
                    key={mood}
                    className={`px-2 sm:px-3 py-1 rounded-full border text-xs font-medium transition-all focus:outline-none ${selected === mood ? buttonSelected : buttonUnselected}`}
                    onClick={() => setSelected(mood)}
                    aria-label={mood}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mb-3">
          <label className={`block mb-1 font-semibold text-sm ${panelSubText}`}>Intensity: <span className={`font-normal ${panelText}`}>({intensity})</span></label>
          <input
            type="range"
            min={1}
            max={10}
            value={intensity}
            onChange={e => setIntensity(Number(e.target.value))}
            className="w-full accent-green-400 h-2"
          />
          <div className={`flex justify-between text-xs mt-1 ${panelSubText}`}>
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Where were you? */}
        <div className="mb-3">
          <label className={`block mb-2 font-semibold text-sm ${panelSubText}`}>Where were you?</label>
          {renderOptionButtons(
            [...DEFAULT_LOCATIONS, ...userOptions.locations],
            location,
            setLocation,
            showCustomLocation,
            setShowCustomLocation,
            customLocation,
            setCustomLocation,
            'location'
          )}
        </div>

        {/* Who were you with? */}
        <div className="mb-3">
          <label className={`block mb-2 font-semibold text-sm ${panelSubText}`}>Who were you with?</label>
          {renderOptionButtons(
            [...DEFAULT_COMPANIES, ...userOptions.companies],
            company,
            setCompany,
            showCustomCompany,
            setShowCustomCompany,
            customCompany,
            setCustomCompany,
            'company'
          )}
        </div>

        {/* What were you doing? */}
        <div className="mb-3">
          <label className={`block mb-2 font-semibold text-sm ${panelSubText}`}>What were you doing?</label>
          {renderOptionButtons(
            [...DEFAULT_ACTIVITIES, ...userOptions.activities],
            activity,
            setActivity,
            showCustomActivity,
            setShowCustomActivity,
            customActivity,
            setCustomActivity,
            'activity'
          )}
        </div>

        <textarea
          className={`w-full p-2 rounded-lg mb-3 resize-none ${inputBg} ${inputPlaceholder} focus:outline-none text-sm`}
          rows={2}
          maxLength={120}
          placeholder="Add a note (optional)"
          value={note}
          onChange={e => setNote(e.target.value)}
          style={{ minHeight: 36, maxHeight: 60 }}
        />
        <button
          type="submit"
          className={`w-full py-2 rounded-lg font-semibold text-sm sm:text-base transition ${submitBtn}`}
          disabled={!selected || loading}
        >
          {loading ? 'Logging...' : 'Log Mood'}
        </button>
        {success && <div className="text-green-500 text-center mt-3 text-sm">Mood logged!</div>}
      </form>
    </div>
  );

  // History panel
  const renderHistory = () => (
    <div className={`flex-1 flex flex-col p-4 sm:p-6 rounded-2xl shadow-xl border ${panelBorder} ${panelBg} min-w-0 max-w-full lg:max-w-[400px] max-h-[500px] sm:max-h-[600px] overflow-y-auto`}>
      <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-center ${panelText}`}>Mood History</h3>
      {logs.length === 0 ? (
        <div className={`${panelSubText} text-center mt-6 sm:mt-8 text-sm`}>No mood logs yet.</div>
      ) : (
        <ul className="space-y-2 sm:space-y-3">
          {logs.map(log => (
            <li key={log.id} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 rounded-xl ${isDark ? 'bg-[#111]' : 'bg-gray-100'}`} style={{ boxShadow: '0 2px 8px #0002' }}>
                              <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`font-semibold text-sm sm:text-base ${panelText}`}>{log.mood}</div>
                    <div className={`text-xs ${panelSubText}`}>Intensity: {log.intensity ?? '-'}</div>
                  </div>
                  
                  {(log.location || log.company || log.activity) && (
                    <div className={`text-xs mb-2 ${panelSubText}`}>
                      <div className="flex flex-wrap gap-2">
                        {log.location && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full ${isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'}`}>
                            <span className="mr-1">📍</span>
                            {log.location}
                          </span>
                        )}
                        {log.company && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full ${isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'}`}>
                            <span className="mr-1">👥</span>
                            {log.company}
                          </span>
                        )}
                        {log.activity && (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full ${isDark ? 'bg-gray-800/50' : 'bg-gray-200/50'}`}>
                            <span className="mr-1">🎯</span>
                            {log.activity}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {log.note && (
                    <div className={`text-xs sm:text-sm ${panelSubText} italic`}>
                      "{log.note}"
                    </div>
                  )}
                </div>
              <div className="text-xs text-gray-500 text-right sm:text-left">{new Date(log.timestamp).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // Insight panel
  const renderInsight = () => {
    if (!selected) {
      return <div className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl shadow-xl border ${panelBorder} ${insightBg} min-w-0 max-w-full lg:max-w-[400px] ${panelSubText} text-center text-sm`}>Select a mood to see insight and motivation.</div>;
    }
    const info = MOOD_INSIGHTS[selected] || {
      description: `You are feeling ${selected.toLowerCase()}.`,
      can: 'Reflect on what this mood means for you. Take care of yourself.',
      cannot: 'You may not feel like doing everything right now, and that is okay.',
      motivation: 'Every emotion is valid. You are doing your best.'
    };
    return (
      <div className={`flex-1 flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl shadow-xl border ${panelBorder} ${insightBg} min-w-0 max-w-full lg:max-w-[400px]`}>
        <h3 className={`text-xl sm:text-2xl font-bold mb-3 sm:mb-4 ${insightTitle}`}>{selected}</h3>
        <div className={`mb-3 sm:mb-4 ${insightDesc} text-center text-base sm:text-lg`}>{info.description}</div>
        <div className={`mb-2 ${panelSubText} text-center text-sm`}><span className={`font-semibold ${panelText}`}>You can:</span> {info.can}</div>
        <div className={`mb-2 ${panelSubText} text-center text-sm`}><span className={`font-semibold ${panelText}`}>You may not:</span> {info.cannot}</div>
        <div className={`mt-4 sm:mt-6 ${insightMotivation} text-center italic text-sm sm:text-base`}>{info.motivation}</div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col pt-16 ${isDark ? 'bg-black' : 'bg-gradient-to-br from-pink-50 via-white to-pink-100'}`}>
      <div className="w-full max-w-7xl px-3 sm:px-6 mx-auto">
        <div className="mb-4 sm:mb-8 mt-0 flex items-center justify-between">
          <span className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold ${panelText} text-left block leading-tight`}>Hello friend!</span>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 justify-center">
          {renderLogger()}
          {renderHistory()}
          {renderInsight()}
        </div>
      </div>
    </div>
  );
}
