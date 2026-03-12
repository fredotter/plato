import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface AppState {
  // Style scores
  styleScores: Record<string, number>;
  setStyleScores: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  
  // Player state
  isPlaying: boolean;
  curTime: number;
  compPct: number;
  knowPct: number;
  quizIdx: number;
  ttsOn: boolean;
  activeTab: string;
  
  setIsPlaying: (v: boolean) => void;
  setCurTime: React.Dispatch<React.SetStateAction<number>>;
  setCompPct: React.Dispatch<React.SetStateAction<number>>;
  setKnowPct: React.Dispatch<React.SetStateAction<number>>;
  setQuizIdx: React.Dispatch<React.SetStateAction<number>>;
  setTtsOn: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  
  // Quiz overlay
  showQuiz: boolean;
  setShowQuiz: React.Dispatch<React.SetStateAction<boolean>>;
  currentQuiz: any;
  setCurrentQuiz: React.Dispatch<React.SetStateAction<any>>;
  
  // Accessibility
  showAccessibility: boolean;
  setShowAccessibility: React.Dispatch<React.SetStateAction<boolean>>;
  a11ySettings: {
    fontSize: number;
    fontWeight: string;
    lineSpacing: number;
    colorMode: string;
    theme: string;
  };
  setA11ySettings: React.Dispatch<React.SetStateAction<any>>;
  
  // Theme
  themeMode: 'light' | 'dark';
  setThemeMode: React.Dispatch<React.SetStateAction<'light' | 'dark'>>;
  toggleTheme: () => void;
  
  // Search
  showSearch: boolean;
  setShowSearch: React.Dispatch<React.SetStateAction<boolean>>;
  
  // Active course type for player
  activeCourseType: 'video' | 'readwrite' | 'auditory';
  setActiveCourseType: React.Dispatch<React.SetStateAction<'video' | 'readwrite' | 'auditory'>>;
  
  // Battle
  playerTotalScore: number;
  setPlayerTotalScore: React.Dispatch<React.SetStateAction<number>>;
  feedItems: any[];
  setFeedItems: React.Dispatch<React.SetStateAction<any[]>>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [styleScores, setStyleScores] = useState<Record<string, number>>({ visual: 0, auditory: 0, reading: 0, kinesthetic: 0 });
  
  const [isPlaying, setIsPlayingState] = useState(false);
  const [curTime, setCurTime] = useState(0);
  const [compPct, setCompPct] = useState(0);
  const [knowPct, setKnowPct] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [ttsOn, setTtsOn] = useState(false);
  const [activeTab, setActiveTab] = useState('visual');
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<any>(null);
  
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [a11ySettings, setA11ySettings] = useState({
    fontSize: 1,
    fontWeight: 'normal',
    lineSpacing: 1.6,
    colorMode: 'none',
    theme: 'dark',
  });
  
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [showSearch, setShowSearch] = useState(false);
  const [activeCourseType, setActiveCourseType] = useState<'video' | 'readwrite' | 'auditory'>('video');
  
  const toggleTheme = useCallback(() => {
    setThemeMode(prev => prev === 'light' ? 'dark' : 'light');
  }, []);
  
  // Update CSS variables when a11y settings change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--global-font-size', `${a11ySettings.fontSize * 16}px`);
    root.style.setProperty('--global-font-weight', a11ySettings.fontWeight === 'bold' ? '500' : '400');
  }, [a11ySettings.fontSize, a11ySettings.fontWeight]);
  
  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(prev => !prev);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  
  const [playerTotalScore, setPlayerTotalScore] = useState(840);
  const [feedItems, setFeedItems] = useState([
    { avatar: 'A', bg: '#e879f9', content: '<strong>Aisha M.</strong> completed Module 5 in Python with a <span style="color:var(--emerald)">92% knowledge score</span>.', time: '2 min ago' },
    { avatar: 'L', bg: '#60a5fa', content: '<strong>Liam K.</strong> won a Quiz Battle against <strong>Carlos R.</strong> (3\u20131).', time: '8 min ago' },
    { avatar: 'M', bg: '#34d399', content: '<strong>Mei L.</strong> earned the <span style="color:var(--amber)">\ud83d\udd25 7-Day Streak</span> badge!', time: '15 min ago' },
    { avatar: 'C', bg: '#fbbf24', content: '<strong>Carlos R.</strong> started <em>Data Analytics Foundations</em>.', time: '22 min ago' },
    { avatar: 'G', bg: 'linear-gradient(135deg,#FB923C,#F472B6)', content: '<strong>You</strong> passed a Knowledge Check in Module 3 with <span style="color:var(--violet)">confidence 4/5</span>.', time: '1 hr ago' },
  ]);

  const setIsPlaying = useCallback((v: boolean) => {
    setIsPlayingState(v);
  }, []);

  return (
    <AppContext.Provider value={{
      styleScores, setStyleScores,
      isPlaying, curTime, compPct, knowPct, quizIdx, ttsOn, activeTab,
      setIsPlaying, setCurTime, setCompPct, setKnowPct, setQuizIdx, setTtsOn, setActiveTab,
      showQuiz, setShowQuiz, currentQuiz, setCurrentQuiz,
      showAccessibility, setShowAccessibility, a11ySettings, setA11ySettings,
      themeMode, setThemeMode, toggleTheme,
      showSearch, setShowSearch,
      activeCourseType, setActiveCourseType,
      playerTotalScore, setPlayerTotalScore, feedItems, setFeedItems,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
