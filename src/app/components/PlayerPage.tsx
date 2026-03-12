import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TopNav } from './TopNav';
import { useApp } from '../context/AppContext';

// ─── Quiz data ───
const quizzes = [
  { time: 5, q: "Which Python loop is best when you know exactly how many times to iterate?", opts: [{ t: "while loop", c: false }, { t: "for loop", c: true }, { t: "do-while loop", c: false }, { t: "repeat loop", c: false }], yFb: "Correct! A for loop iterates over a known sequence.", nFb: "Not quite. A for loop is ideal when you know the iteration count." },
  { time: 13, q: "What happens if a while loop's condition never becomes False?", opts: [{ t: "Exits after 1000 iterations", c: false }, { t: "Python stops it automatically", c: false }, { t: "Creates an infinite loop", c: true }, { t: "Raises a SyntaxError", c: false }], yFb: "Right! An infinite loop runs forever unless stopped.", nFb: "Not quite. If the condition stays True, it loops forever — an infinite loop." },
];

// ─── Read/Write lesson content ───
const lessonContent = {
  title: "Data Analytics Foundations — Module 2: Data Cleaning",
  sections: [
    {
      heading: "What is Data Cleaning?",
      text: "Data cleaning is the process of detecting and correcting (or removing) corrupt, inaccurate, or irrelevant records from a dataset. It is a critical first step in data analytics because the quality of your analysis depends directly on the quality of your data. Without proper cleaning, models will produce unreliable results — the classic 'garbage in, garbage out' problem.",
    },
    {
      heading: "Common Data Quality Issues",
      text: "The most frequent issues include missing values, duplicate entries, inconsistent formatting, and outliers. Missing values can be handled through imputation (filling with mean, median, or mode) or deletion. Duplicates should be identified using unique identifiers. Inconsistent formatting — such as dates in different formats or inconsistent capitalization — requires standardization rules. Outliers may be genuine extreme values or data entry errors, and require domain knowledge to handle appropriately.",
    },
    {
      heading: "The ETL Pipeline",
      text: "ETL stands for Extract, Transform, Load. This is the standard workflow for moving data from source systems into an analytics-ready format. During extraction, raw data is pulled from databases, APIs, or files. The transformation phase includes cleaning, normalizing, and restructuring the data. Finally, the cleaned data is loaded into a data warehouse or analytics platform for querying and visualization.",
    },
    {
      heading: "Tools and Techniques",
      text: "Python's pandas library is the most popular tool for data cleaning. Key functions include dropna() for removing missing values, fillna() for imputation, drop_duplicates() for removing duplicate rows, and apply() for custom transformations. SQL is also commonly used, especially for large datasets stored in relational databases. Regular expressions are invaluable for pattern matching and text standardization.",
    },
  ],
};

// AI summaries for highlighted text
function generateAISummary(text: string): string[] {
  const words = text.split(/\s+/).length;
  if (words < 5) return ["Select a longer passage for a more detailed summary."];

  // Keyword-based summaries
  const lower = text.toLowerCase();
  if (lower.includes('data cleaning')) {
    return [
      "Data cleaning detects and corrects corrupt or inaccurate records",
      "Essential first step before any analysis — 'garbage in, garbage out'",
      "Directly impacts the reliability of analytical models",
    ];
  }
  if (lower.includes('missing values') || lower.includes('duplicate')) {
    return [
      "Common issues: missing values, duplicates, inconsistent formatting, outliers",
      "Imputation fills gaps using mean, median, or mode",
      "Duplicates found via unique identifiers; outliers need domain knowledge",
    ];
  }
  if (lower.includes('etl') || lower.includes('extract')) {
    return [
      "ETL = Extract, Transform, Load — the standard data pipeline",
      "Extraction pulls raw data from databases, APIs, or files",
      "Transformation includes cleaning, normalizing, restructuring",
      "Loading places clean data into warehouses for analysis",
    ];
  }
  if (lower.includes('pandas') || lower.includes('python')) {
    return [
      "pandas is the primary Python library for data cleaning",
      "Key functions: dropna(), fillna(), drop_duplicates(), apply()",
      "SQL handles large relational datasets; regex for text patterns",
    ];
  }
  // Generic summary
  return [
    `Key concept from the selected ${words}-word passage`,
    "This section covers foundational data analytics principles",
    "Consider reviewing this topic for deeper understanding",
  ];
}

// ─── Auditory transcript data ───
const auditoryTranscript = [
  { start: 0, end: 3, text: "Welcome to UX Research Methods, Module 1." },
  { start: 3, end: 7, text: "User experience research is the systematic study of how people interact with products and services." },
  { start: 7, end: 11, text: "There are two primary categories: qualitative and quantitative research." },
  { start: 11, end: 15, text: "Qualitative methods include user interviews, contextual inquiry, and diary studies." },
  { start: 15, end: 19, text: "These methods help us understand the 'why' behind user behaviors and decisions." },
  { start: 19, end: 23, text: "Quantitative methods include surveys, A/B testing, and analytics review." },
  { start: 23, end: 27, text: "They provide measurable data that can be analyzed statistically." },
  { start: 27, end: 31, text: "The best research combines both approaches for a complete picture." },
  { start: 31, end: 35, text: "Usability testing is perhaps the most versatile method available to researchers." },
  { start: 35, end: 40, text: "It involves observing real users as they attempt to complete tasks with your product." },
];

export function PlayerPage() {
  const { activeCourseType, setActiveCourseType } = useApp();

  // Video player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [curTime, setCurTime] = useState(0);
  const [compPct, setCompPct] = useState(0);
  const [knowPct, setKnowPct] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('visual');
  const [ttsOn, setTtsOn] = useState(false);

  // Quiz overlay state
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuizData, setCurrentQuizData] = useState<typeof quizzes[0] | null>(null);
  const [qAnswered, setQAnswered] = useState(false);
  const [selectedQOpt, setSelectedQOpt] = useState<number | null>(null);
  const [qOptStates, setQOptStates] = useState<string[]>([]);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | ''>('');
  const [showConfidence, setShowConfidence] = useState(false);
  const [confLevel, setConfLevel] = useState<number | null>(null);
  const [showRevNudge, setShowRevNudge] = useState(false);
  const [contEnabled, setContEnabled] = useState(false);

  // Read/Write highlight state
  const [highlightTooltip, setHighlightTooltip] = useState<{ x: number; y: number; summary: string[] } | null>(null);
  const [showMindMap, setShowMindMap] = useState(false);
  const lessonRef = useRef<HTMLDivElement>(null);

  // Auditory state
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const audioIntervalRef = useRef<number | null>(null);

  const totTime = 20;
  const audioTotTime = 40;
  const intervalRef = useRef<number | null>(null);
  const quizIdxRef = useRef(quizIdx);
  quizIdxRef.current = quizIdx;

  const trigQuiz = useCallback((i: number) => {
    setIsPlaying(false);
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    setCurrentQuizData(quizzes[i]);
    setQAnswered(false);
    setSelectedQOpt(null);
    setQOptStates([]);
    setFeedbackText('');
    setFeedbackType('');
    setShowConfidence(false);
    setConfLevel(null);
    setShowRevNudge(false);
    setContEnabled(false);
    setShowQuiz(true);
  }, []);

  // Video timer
  useEffect(() => {
    if (isPlaying && activeCourseType === 'video') {
      intervalRef.current = window.setInterval(() => {
        setCurTime(prev => {
          const next = prev + 1;
          if (next >= totTime) {
            setIsPlaying(false);
            clearInterval(intervalRef.current!);
            intervalRef.current = null;
            return totTime;
          }
          for (let i = 0; i < quizzes.length; i++) {
            if (next === quizzes[i].time && quizIdxRef.current <= i) {
              setQuizIdx(i);
              setTimeout(() => trigQuiz(i), 0);
              break;
            }
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, trigQuiz, activeCourseType]);

  // Audio timer
  useEffect(() => {
    if (audioPlaying && activeCourseType === 'auditory') {
      audioIntervalRef.current = window.setInterval(() => {
        setAudioTime(prev => {
          const next = prev + 1;
          if (next >= audioTotTime) {
            setAudioPlaying(false);
            clearInterval(audioIntervalRef.current!);
            audioIntervalRef.current = null;
            return audioTotTime;
          }
          // Trigger quiz at 10 seconds
          if (next === 10 && quizIdxRef.current <= 0) {
            setQuizIdx(0);
            setTimeout(() => {
              setAudioPlaying(false);
              clearInterval(audioIntervalRef.current!);
              audioIntervalRef.current = null;
              trigQuiz(0);
            }, 0);
          }
          return next;
        });
      }, 1000);
    }
    return () => { if (audioIntervalRef.current) clearInterval(audioIntervalRef.current); };
  }, [audioPlaying, activeCourseType, trigQuiz]);

  useEffect(() => {
    if (activeCourseType === 'video') {
      const p = (curTime / totTime) * 100;
      setCompPct(Math.round(p));
    } else if (activeCourseType === 'auditory') {
      const p = (audioTime / audioTotTime) * 100;
      setCompPct(Math.round(p));
    }
  }, [curTime, audioTime, activeCourseType]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const seekV = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setCurTime(Math.round(((e.clientX - r.left) / r.width) * totTime));
  };

  const seekAudio = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setAudioTime(Math.round(((e.clientX - r.left) / r.width) * audioTotTime));
  };

  const ansQ = (idx: number) => {
    if (qAnswered || !currentQuizData) return;
    setQAnswered(true);
    setSelectedQOpt(idx);
    const correct = currentQuizData.opts[idx].c;
    const states = currentQuizData.opts.map((o, i) => {
      if (i === idx && correct) return 'correct';
      if (i === idx && !correct) return 'wrong';
      if (o.c && !correct) return 'correct';
      return 'disabled';
    });
    setQOptStates(states);
    setFeedbackText(correct ? currentQuizData.yFb : currentQuizData.nFb);
    setFeedbackType(correct ? 'correct' : 'wrong');
    setKnowPct(prev => Math.min(100, prev + (correct ? 25 : 5)));
    setShowConfidence(true);
  };

  const selConf = (lv: number) => {
    setConfLevel(lv);
    setShowRevNudge(lv <= 2);
    setContEnabled(true);
  };

  const closeQuiz = () => {
    if (!contEnabled) return;
    setShowQuiz(false);
    setQuizIdx(prev => prev + 1);
  };

  // Highlight-to-summarize handler
  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !lessonRef.current) {
      return;
    }
    const text = selection.toString().trim();
    if (text.length < 10) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = lessonRef.current.getBoundingClientRect();

    const summary = generateAISummary(text);
    setHighlightTooltip({
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.bottom - containerRect.top + 8,
      summary,
    });
  }, []);

  // Dismiss tooltip on click outside
  useEffect(() => {
    const dismiss = (e: MouseEvent) => {
      if (highlightTooltip) {
        const target = e.target as HTMLElement;
        if (!target.closest('.highlight-tooltip')) {
          setHighlightTooltip(null);
        }
      }
    };
    document.addEventListener('mousedown', dismiss);
    return () => document.removeEventListener('mousedown', dismiss);
  }, [highlightTooltip]);

  const gap = compPct - knowPct;
  const gapText = (!compPct && !knowPct) ? 'Gap: —' : gap <= 10 ? 'On Track ✓' : `Gap: ${gap}%`;
  const gapClass = (!compPct && !knowPct) ? 'gap-badge' : gap <= 10 ? 'gap-badge good' : 'gap-badge';

  const m = Math.floor(curTime / 60);
  const s = String(curTime % 60).padStart(2, '0');
  const am = Math.floor(audioTime / 60);
  const as = String(audioTime % 60).padStart(2, '0');

  const tabs = [
    { id: 'visual', icon: '🧠', label: 'Visual' },
    { id: 'readwrite', icon: '📝', label: 'Read/Write' },
    { id: 'auditory', icon: '🎧', label: 'Auditory' },
  ];

  const letters = ['A', 'B', 'C', 'D'];

  const courseTypes = [
    { id: 'video' as const, icon: '🎬', label: 'Python (Video)' },
    { id: 'readwrite' as const, icon: '📝', label: 'Data Analytics (Read/Write)' },
    { id: 'auditory' as const, icon: '🎧', label: 'UX Research (Auditory)' },
  ];

  // Generate SVG wave bars for auditory mode
  const waveBars = Array.from({ length: 40 }, (_, i) => {
    const baseHeight = 15 + Math.sin(i * 0.5) * 10 + Math.cos(i * 0.3) * 8;
    const animatedHeight = audioPlaying
      ? baseHeight + Math.sin(Date.now() / 200 + i * 0.4) * 15
      : baseHeight * 0.4;
    return { x: i * 10 + 2, height: Math.max(4, animatedHeight), width: 6 };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <TopNav activeLink="lesson" />

      {/* Comprehension Dashboard Strip */}
      <div className="comp-strip">
        <div className="cm">
          <span className="cm-label">Completion</span>
          <div className="cm-track"><div className="cm-fill comp" style={{ width: `${compPct}%` }} /></div>
          <span className="cm-val">{compPct}%</span>
        </div>
        <div className="cm">
          <span className="cm-label">Knowledge</span>
          <div className="cm-track"><div className="cm-fill know" style={{ width: `${knowPct}%` }} /></div>
          <span className="cm-val">{knowPct}%</span>
        </div>
        <div className={gapClass}>{gapText}</div>
        <div style={{ marginLeft: 'auto' }}>
          <div className="course-type-switcher">
            {courseTypes.map(ct => (
              <button
                key={ct.id}
                className={`course-type-btn ${activeCourseType === ct.id ? 'active' : ''}`}
                onClick={() => setActiveCourseType(ct.id)}
              >
                <span>{ct.icon}</span> {ct.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ━━━ VIDEO MODE ━━━ */}
      {activeCourseType === 'video' && (
        <div className="player-layout">
          <div className="player-main">
            <div className="vid-container anim">
              <div className="vid-ph">
                <div className="go" />
                <div className="glow" />
                <button className={`play-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <div className="vid-title">3.2 — Control Flow: Loops & Conditionals</div>
              </div>
            </div>
            <div className="vpw anim d1">
              <div className="vpt" onClick={seekV}>
                <div className="vpf" style={{ width: `${(curTime / totTime) * 100}%` }} />
              </div>
              <span className="vtime">{m}:{s} / 0:20</span>
            </div>
            <div className="sic anim d2">
              <div className="sic-i">🎯</div>
              <div>
                <h3>Learning Objective</h3>
                <p>Understand how <code>for</code> and <code>while</code> loops control repetition, and how <code>if/elif/else</code> enables conditional branching.</p>
              </div>
            </div>
          </div>

          <aside className="p-sidebar">
            <div className="st-tabs">
              {tabs.map(t => (
                <button key={t.id} className={`st-tab ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
                  <span className="ti">{t.icon}</span>{t.label}
                </button>
              ))}
            </div>
            <div className="sb-scroll">
              <div className="ai-badge">AI-Generated Study Aid</div>
              <div className={`panel ${activeTab === 'visual' ? 'active' : ''}`}>
                <div className="panel-t">Concept Map</div>
                <div className="mm-wrap">
                  <svg viewBox="0 0 310 260" xmlns="http://www.w3.org/2000/svg">
                    <rect x="100" y="104" width="110" height="38" rx="11" fill="rgba(167,139,250,.15)" stroke="#A78BFA" strokeWidth="1.2" />
                    <text x="155" y="128" textAnchor="middle" fill="#c4b5fd" fontFamily="Outfit" fontSize="11" fontWeight="600">Control Flow</text>
                    <line x1="120" y1="104" x2="65" y2="54" stroke="rgba(167,139,250,.2)" />
                    <rect x="10" y="30" width="110" height="40" rx="9" fill="#16141F" stroke="rgba(255,255,255,.06)" />
                    <text x="65" y="47" textAnchor="middle" fill="#60A5FA" fontFamily="Outfit" fontSize="10" fontWeight="600">for loop</text>
                    <text x="65" y="61" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">iterate over sequence</text>
                    <line x1="190" y1="104" x2="245" y2="54" stroke="rgba(167,139,250,.2)" />
                    <rect x="190" y="30" width="110" height="40" rx="9" fill="#16141F" stroke="rgba(255,255,255,.06)" />
                    <text x="245" y="47" textAnchor="middle" fill="#34D399" fontFamily="Outfit" fontSize="10" fontWeight="600">while loop</text>
                    <text x="245" y="61" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">repeat until false</text>
                    <line x1="120" y1="142" x2="55" y2="192" stroke="rgba(167,139,250,.2)" />
                    <rect x="0" y="178" width="110" height="40" rx="9" fill="#16141F" stroke="rgba(255,255,255,.06)" />
                    <text x="55" y="195" textAnchor="middle" fill="#FBC02D" fontFamily="Outfit" fontSize="10" fontWeight="600">if / elif / else</text>
                    <text x="55" y="209" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">conditional branching</text>
                    <line x1="190" y1="142" x2="250" y2="192" stroke="rgba(167,139,250,.2)" />
                    <rect x="195" y="178" width="110" height="40" rx="9" fill="#16141F" stroke="rgba(255,255,255,.06)" />
                    <text x="250" y="195" textAnchor="middle" fill="#F472B6" fontFamily="Outfit" fontSize="10" fontWeight="600">break / continue</text>
                    <text x="250" y="209" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">loop control</text>
                  </svg>
                </div>
              </div>
              <div className={`panel ${activeTab === 'readwrite' ? 'active' : ''}`}>
                <div className="panel-t">Structured Notes</div>
                <div className="nc"><h4>📌 For Loops</h4><p>A <span className="kt">for</span> loop iterates over a sequence. Use when you know the iteration count.</p></div>
                <div className="nc"><h4>📌 While Loops</h4><p>A <span className="kt">while</span> loop repeats while condition is <span className="kt">True</span>. Risk: infinite loops.</p></div>
                <div className="nc"><h4>📌 Conditionals</h4><p><span className="kt">if</span> checks boolean. Chain <span className="kt">elif</span>/<span className="kt">else</span>. Indentation matters.</p></div>
                <div className="nc"><h4>📌 Loop Control</h4><p><span className="kt">break</span> exits loop. <span className="kt">continue</span> skips iteration.</p></div>
              </div>
              <div className={`panel ${activeTab === 'auditory' ? 'active' : ''}`}>
                <div className="panel-t">Audio Summary</div>
                <div className="ac">
                  <div className={`a-waveform ${ttsOn ? 'playing' : ''}`}>
                    {Array.from({ length: 10 }).map((_, i) => <div key={i} className="bar" />)}
                  </div>
                  <button className="tts-btn" onClick={() => setTtsOn(!ttsOn)}>{ttsOn ? '⏸ Pause' : '▶ Play Audio'}</button>
                  <div className="a-transcript">
                    <p>"<span className="hl">Control flow</span> gives Python the tools to make decisions and repeat. A <span className="hl">for loop</span> iterates over a sequence, a <span className="hl">while loop</span> runs until false. <span className="hl">Conditionals</span> let code branch."</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mod-sections">
              <h4>Sections</h4>
              <div className="sec-list">
                <div className="sec-item completed"><span className="sec-dot" />3.1 Variables & Types<span className="sec-time">4:12</span></div>
                <div className="sec-item active"><span className="sec-dot" />3.2 Loops & Conditionals<span className="sec-time">6:30</span></div>
                <div className="sec-item"><span className="sec-dot" />3.3 Functions<span className="sec-time">5:45</span></div>
                <div className="sec-item"><span className="sec-dot" />3.4 Error Handling<span className="sec-time">4:58</span></div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ━━━ READ/WRITE MODE (Data Analytics) ━━━ */}
      {activeCourseType === 'readwrite' && (
        <div className="player-layout">
          <div className="player-main" style={{ maxWidth: '100%' }}>
            <div className="sic anim">
              <div className="sic-i">📊</div>
              <div>
                <h3>{lessonContent.title}</h3>
                <p>Highlight any text with your mouse to get an instant AI summary.</p>
              </div>
            </div>

            <div
              ref={lessonRef}
              className="lesson-text anim d1"
              onMouseUp={handleTextSelection}
              style={{ position: 'relative' }}
            >
              {lessonContent.sections.map((section, i) => (
                <div key={i}>
                  <h3>{section.heading}</h3>
                  <p>{section.text}</p>
                </div>
              ))}

              {highlightTooltip && (
                <div
                  className="highlight-tooltip"
                  style={{
                    left: Math.min(Math.max(highlightTooltip.x - 160, 0), 200),
                    top: highlightTooltip.y,
                  }}
                >
                  <h4>✦ AI Summary</h4>
                  <ul>
                    {highlightTooltip.summary.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Mind Map Toggle */}
            <div className="anim d2" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className={showMindMap ? 'btn-primary' : 'btn-secondary'}
                style={{ width: 'auto', padding: '10px 20px' }}
                onClick={() => setShowMindMap(!showMindMap)}
              >
                {showMindMap ? '🧠 Hide AI Mind Map' : '🧠 Show AI Mind Map'}
              </button>
              <span style={{ fontSize: '.75rem', color: 'var(--text-muted)' }}>AI-generated concept visualization</span>
            </div>

            {showMindMap && (
              <div className="mind-map-container anim">
                <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: 'auto' }}>
                  {/* Center node */}
                  <rect x="225" y="170" width="150" height="60" rx="14" fill="rgba(124,58,237,.15)" stroke="#A78BFA" strokeWidth="1.5" />
                  <text x="300" y="195" textAnchor="middle" fill="#c4b5fd" fontFamily="Outfit" fontSize="13" fontWeight="700">Data Cleaning</text>
                  <text x="300" y="212" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="9">Core Process</text>

                  {/* Top-left: Quality Issues */}
                  <line x1="225" y1="185" x2="100" y2="80" stroke="rgba(96,165,250,.25)" strokeWidth="1.2" />
                  <rect x="20" y="50" width="160" height="55" rx="10" fill="rgba(96,165,250,.08)" stroke="rgba(96,165,250,.2)" />
                  <text x="100" y="72" textAnchor="middle" fill="#60A5FA" fontFamily="Outfit" fontSize="11" fontWeight="600">Quality Issues</text>
                  <text x="100" y="87" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">Missing values, duplicates</text>
                  <text x="100" y="98" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">outliers, formatting</text>

                  {/* Top-right: ETL */}
                  <line x1="375" y1="185" x2="490" y2="80" stroke="rgba(52,211,153,.25)" strokeWidth="1.2" />
                  <rect x="415" y="50" width="160" height="55" rx="10" fill="rgba(52,211,153,.08)" stroke="rgba(52,211,153,.2)" />
                  <text x="495" y="72" textAnchor="middle" fill="#34D399" fontFamily="Outfit" fontSize="11" fontWeight="600">ETL Pipeline</text>
                  <text x="495" y="87" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">Extract → Transform → Load</text>
                  <text x="495" y="98" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">Standard workflow</text>

                  {/* Bottom-left: Tools */}
                  <line x1="250" y1="230" x2="110" y2="320" stroke="rgba(251,192,45,.25)" strokeWidth="1.2" />
                  <rect x="20" y="295" width="180" height="55" rx="10" fill="rgba(251,192,45,.08)" stroke="rgba(251,192,45,.2)" />
                  <text x="110" y="317" textAnchor="middle" fill="#FBC02D" fontFamily="Outfit" fontSize="11" fontWeight="600">Python Tools</text>
                  <text x="110" y="332" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">pandas, SQL, regex</text>
                  <text x="110" y="343" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">dropna(), fillna()</text>

                  {/* Bottom-right: Methods */}
                  <line x1="350" y1="230" x2="480" y2="320" stroke="rgba(244,114,182,.25)" strokeWidth="1.2" />
                  <rect x="400" y="295" width="180" height="55" rx="10" fill="rgba(244,114,182,.08)" stroke="rgba(244,114,182,.2)" />
                  <text x="490" y="317" textAnchor="middle" fill="#F472B6" fontFamily="Outfit" fontSize="11" fontWeight="600">Techniques</text>
                  <text x="490" y="332" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">Imputation, dedup</text>
                  <text x="490" y="343" textAnchor="middle" fill="#8E87A0" fontFamily="Outfit" fontSize="8">Standardization rules</text>
                </svg>
              </div>
            )}

            {/* Read/Write progress indicator */}
            <div className="sic anim d3">
              <div className="sic-i">💡</div>
              <div>
                <h3>Interactive Tip</h3>
                <p>Select any passage of text above to trigger an <strong>AI Summary</strong>. The summary will appear as a tooltip near your selection, breaking down key concepts into digestible bullet points.</p>
              </div>
            </div>
          </div>

          <aside className="p-sidebar">
            <div style={{ padding: 16 }}>
              <div className="ai-badge">AI-Generated Study Aid</div>
              <div className="panel-t" style={{ marginBottom: 12 }}>Module Sections</div>
              <div className="sec-list">
                <div className="sec-item completed"><span className="sec-dot" />1. Introduction to Analytics<span className="sec-time">8:00</span></div>
                <div className="sec-item active"><span className="sec-dot" />2. Data Cleaning<span className="sec-time">12:00</span></div>
                <div className="sec-item"><span className="sec-dot" />3. Data Visualization<span className="sec-time">10:00</span></div>
                <div className="sec-item"><span className="sec-dot" />4. Statistical Analysis<span className="sec-time">14:00</span></div>
              </div>
            </div>
            <div style={{ padding: '0 16px 16px' }}>
              <div className="panel-t" style={{ marginBottom: 8 }}>Key Terms</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div className="nc"><h4>📌 Data Cleaning</h4><p>Process of fixing corrupt, inaccurate, or irrelevant records in datasets.</p></div>
                <div className="nc"><h4>📌 ETL Pipeline</h4><p>Extract, Transform, Load — the standard data processing workflow.</p></div>
                <div className="nc"><h4>📌 Imputation</h4><p>Filling in missing values using statistical methods (mean, median, mode).</p></div>
                <div className="nc"><h4>📌 pandas</h4><p>Python's most popular data manipulation library with powerful cleaning functions.</p></div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ━━━ AUDITORY MODE (UX Research) ━━━ */}
      {activeCourseType === 'auditory' && (
        <div className="player-layout">
          <div className="player-main">
            <div className="audio-player-hero anim">
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
                  🎨 UX Research Methods — Module 1
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, marginBottom: 24, color: 'var(--text-bright)' }}>
                  Introduction to User Research
                </h2>

                {/* Animated SVG Sound Wave */}
                <svg className={`sound-wave-svg ${audioPlaying ? 'playing' : ''}`} viewBox="0 0 400 120" xmlns="http://www.w3.org/2000/svg">
                  {waveBars.map((bar, i) => {
                    const cy = 60;
                    const h = audioPlaying
                      ? 10 + Math.abs(Math.sin((audioTime * 2 + i * 0.6))) * 40 + Math.sin(i * 0.3) * 10
                      : 6 + Math.sin(i * 0.5) * 4;
                    return (
                      <rect
                        key={i}
                        className="wave-bar"
                        x={bar.x}
                        y={cy - h / 2}
                        width={bar.width}
                        height={h}
                        rx={3}
                        opacity={audioPlaying ? 0.5 + Math.sin(audioTime + i * 0.3) * 0.5 : 0.2}
                      />
                    );
                  })}
                </svg>

                <div style={{ marginTop: 20 }}>
                  <button
                    className="tts-btn"
                    style={{ fontSize: '.88rem', padding: '12px 32px' }}
                    onClick={() => setAudioPlaying(!audioPlaying)}
                  >
                    {audioPlaying ? '⏸ Pause Audio' : '▶ Play Audio'}
                  </button>
                </div>
              </div>
            </div>

            {/* Audio progress bar */}
            <div className="vpw anim d1">
              <div className="vpt" onClick={seekAudio}>
                <div className="vpf" style={{ width: `${(audioTime / audioTotTime) * 100}%` }} />
              </div>
              <span className="vtime">{am}:{as} / 0:40</span>
            </div>

            {/* Glow-Sync Transcript */}
            <div className="anim d2">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div className="ai-badge">Live Transcript</div>
                <span style={{ fontSize: '.72rem', color: 'var(--text-muted)' }}>Synced with audio playback</span>
              </div>
              <div className="glow-transcript">
                {auditoryTranscript.map((seg, i) => {
                  const isActive = audioTime >= seg.start && audioTime < seg.end;
                  const isPast = audioTime >= seg.end;
                  return (
                    <span
                      key={i}
                      className={`sentence ${isActive ? 'active' : ''} ${isPast ? 'past' : ''}`}
                    >
                      {seg.text}{' '}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="sic anim d3">
              <div className="sic-i">🎯</div>
              <div>
                <h3>Learning Objective</h3>
                <p>Understand the distinction between qualitative and quantitative UX research methods, and when to apply each in a product development lifecycle.</p>
              </div>
            </div>
          </div>

          <aside className="p-sidebar">
            <div style={{ padding: 16 }}>
              <div className="ai-badge">AI-Generated Study Aid</div>
              <div className="panel-t" style={{ marginBottom: 12 }}>Key Concepts</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="nc"><h4>📌 Qualitative Research</h4><p>Explores the <em>why</em> — user interviews, contextual inquiry, diary studies. Rich narrative data.</p></div>
                <div className="nc"><h4>📌 Quantitative Research</h4><p>Measures the <em>what</em> — surveys, A/B tests, analytics. Statistical significance.</p></div>
                <div className="nc"><h4>📌 Usability Testing</h4><p>Observing real users completing tasks. The most versatile UX research method.</p></div>
                <div className="nc"><h4>📌 Mixed Methods</h4><p>Combining qual + quant for a complete picture of user experience.</p></div>
              </div>
            </div>
            <div className="mod-sections">
              <h4>Sections</h4>
              <div className="sec-list">
                <div className="sec-item active"><span className="sec-dot" />1.1 What is UX Research?<span className="sec-time">5:00</span></div>
                <div className="sec-item"><span className="sec-dot" />1.2 Research Methods<span className="sec-time">8:00</span></div>
                <div className="sec-item"><span className="sec-dot" />1.3 Usability Testing<span className="sec-time">7:00</span></div>
                <div className="sec-item"><span className="sec-dot" />1.4 Research Planning<span className="sec-time">6:00</span></div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* ━━━ QUIZ OVERLAY ━━━ */}
      <div className={`quiz-overlay ${showQuiz ? 'visible' : ''}`}>
        <div className="qc">
          <div className="q-tag">⏸ Stop & Think — Knowledge Check</div>
          <p className="q-question">{currentQuizData?.q}</p>
          <div className="q-options">
            {currentQuizData?.opts.map((opt, i) => (
              <div
                key={i}
                className={`q-opt ${qOptStates[i] || ''}`}
                onClick={() => ansQ(i)}
                style={qAnswered ? { pointerEvents: 'none', opacity: qOptStates[i] === 'disabled' ? 0.5 : 1 } : undefined}
              >
                <span className="ol" style={
                  qOptStates[i] === 'correct' ? { background: 'var(--emerald)', color: 'white' } :
                  qOptStates[i] === 'wrong' ? { background: 'var(--rose)', color: 'white' } : undefined
                }>{letters[i]}</span>
                <span>{opt.t}</span>
              </div>
            ))}
          </div>

          {feedbackType && (
            <div className={`q-fb ${feedbackType === 'correct' ? 'correct-fb' : 'wrong-fb'}`}>
              {feedbackText}
            </div>
          )}

          {showConfidence && (
            <div className="conf-section">
              <p className="conf-label">How well do you understand this concept?</p>
              <div className="likert">
                {[
                  { emoji: '😵', num: 1 },
                  { emoji: '😕', num: 2 },
                  { emoji: '😐', num: 3 },
                  { emoji: '🙂', num: 4 },
                  { emoji: '🤩', num: 5 },
                ].map(l => (
                  <button key={l.num} className={`lk-btn ${confLevel === l.num ? 'selected' : ''}`} onClick={() => selConf(l.num)}>
                    <span className="le">{l.emoji}</span><span className="ln">{l.num}</span>
                  </button>
                ))}
              </div>
              <div className="lk-hint"><span>Not at all</span><span>Very well</span></div>
              {showRevNudge && (
                <div className="rev-nudge">
                  <span className="ni" style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>💡</span>
                  <span><strong>Targeted Review:</strong> This concept needs attention. Revisit the structured notes or audio summary before continuing.</span>
                </div>
              )}
            </div>
          )}

          <button className={`cont-btn ${contEnabled ? 'enabled' : ''}`} onClick={closeQuiz}>Continue Learning →</button>
        </div>
      </div>
    </div>
  );
}
