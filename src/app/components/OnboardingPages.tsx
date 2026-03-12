import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

const goals = [
  { icon: '💻', label: 'Learn to Code' },
  { icon: '📊', label: 'Data Skills' },
  { icon: '🎨', label: 'Design & UX' },
  { icon: '📈', label: 'Career Growth' },
  { icon: '🧠', label: 'Critical Thinking' },
  { icon: '🌍', label: 'General Knowledge' },
];

const courses = [
  { emoji: '🐍', title: 'Introduction to Python', desc: 'Coding Temple · 8 Modules · Beginner' },
  { emoji: '📊', title: 'Data Analytics Foundations', desc: 'A.CRE Academy · 6 Modules · Intermediate' },
  { emoji: '🎨', title: 'UX Research Methods', desc: 'PM Hive Accelerator · 5 Modules · Beginner' },
];

export function IntroPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="centered-page">
      <div className="card-shell wide">
        <div className="step-dots">
          <span className="step-dot active" /><span className="step-dot" /><span className="step-dot" />
        </div>
        <h2 className="card-title">What do you want to achieve?</h2>
        <p className="card-sub">Select your top learning goals. This helps us personalize your experience.</p>
        <div className="goals-grid">
          {goals.map((g, i) => (
            <div key={i} className={`goal-card ${selected.has(i) ? 'selected' : ''}`} onClick={() => toggle(i)}>
              <div className="goal-icon">{g.icon}</div>
              <div className="goal-label">{g.label}</div>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => navigate('/enroll')}>Continue →</button>
      </div>
    </div>
  );
}

export function EnrollPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="centered-page">
      <div className="card-shell wide">
        <div className="step-dots">
          <span className="step-dot done" /><span className="step-dot active" /><span className="step-dot" />
        </div>
        <h2 className="card-title">Enroll in a course</h2>
        <p className="card-sub">Pick a course to get started, or skip for now.</p>
        <div className="enroll-list">
          {courses.map((c, i) => (
            <div key={i} className={`enroll-card ${selected.has(i) ? 'selected' : ''}`} onClick={() => toggle(i)}>
              <div className="enroll-emoji">{c.emoji}</div>
              <div className="enroll-info"><h4>{c.title}</h4><p>{c.desc}</p></div>
              <div className="enroll-check">✓</div>
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={() => navigate('/style-survey')}>Continue →</button>
        <div style={{ marginTop: 10 }}><button className="btn-ghost" onClick={() => navigate('/home')}>Skip for now →</button></div>
      </div>
    </div>
  );
}

const surveyQuestions = [
  {
    q: "When learning something new, what do you naturally reach for first?",
    icon: "🧭",
    opts: [
      { text: "Diagrams, charts, or videos", styles: { visual: 3 } },
      { text: "Podcasts, lectures, or discussions", styles: { auditory: 3 } },
      { text: "Textbooks, articles, or written guides", styles: { reading: 3 } },
      { text: "Hands-on practice or trial and error", styles: { kinesthetic: 3 } },
    ],
  },
  {
    q: "You need to remember a complex process. Which strategy works best for you?",
    icon: "💭",
    opts: [
      { text: "Drawing a flowchart or mind map", styles: { visual: 3 } },
      { text: "Explaining it out loud to someone", styles: { auditory: 3 } },
      { text: "Writing detailed step-by-step notes", styles: { reading: 3 } },
      { text: "Walking through it physically or building a model", styles: { kinesthetic: 3 } },
    ],
  },
  {
    q: "You're stuck on a difficult concept. What helps you break through?",
    icon: "🔓",
    opts: [
      { text: "Watching a YouTube tutorial or animation", styles: { visual: 2, auditory: 1 } },
      { text: "Talking it through with a peer or tutor", styles: { auditory: 3 } },
      { text: "Re-reading the material or looking up documentation", styles: { reading: 3 } },
      { text: "Experimenting with code, simulations, or real examples", styles: { kinesthetic: 3 } },
    ],
  },
  {
    q: "Which classroom setting would help you learn best?",
    icon: "🏫",
    opts: [
      { text: "Slides with rich visuals, infographics, and color coding", styles: { visual: 3 } },
      { text: "An engaging lecturer who tells stories and explains verbally", styles: { auditory: 3 } },
      { text: "Well-structured handouts and reading material to review", styles: { reading: 3 } },
      { text: "Lab sessions, workshops, or group activities", styles: { kinesthetic: 3 } },
    ],
  },
  {
    q: "When preparing for an exam, you'd most likely:",
    icon: "📝",
    opts: [
      { text: "Review diagrams, re-watch recorded lectures, or use color-coded highlights", styles: { visual: 2, reading: 1 } },
      { text: "Record yourself explaining topics and listen back", styles: { auditory: 3 } },
      { text: "Re-write notes, make summaries, or create flashcards", styles: { reading: 2, visual: 1 } },
      { text: "Solve practice problems and do mock exercises", styles: { kinesthetic: 3 } },
    ],
  },
];

export function StyleSurveyPage() {
  const navigate = useNavigate();
  const { setStyleScores } = useApp();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(surveyQuestions.length).fill(null));
  const [scores, setScores] = useState<Record<string, number>>({ visual: 0, auditory: 0, reading: 0, kinesthetic: 0 });

  const q = surveyQuestions[currentQ];
  const letters = ['A', 'B', 'C', 'D'];

  const selectOpt = (idx: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const next = () => {
    const chosenIdx = answers[currentQ];
    if (chosenIdx === null) return;
    const chosen = q.opts[chosenIdx];
    const newScores = { ...scores };
    Object.entries(chosen.styles).forEach(([style, pts]) => {
      newScores[style] = (newScores[style] || 0) + pts;
    });
    setScores(newScores);

    if (currentQ >= surveyQuestions.length - 1) {
      setStyleScores(newScores);
      navigate('/style-result');
    } else {
      setCurrentQ(currentQ + 1);
    }
  };

  return (
    <div className="centered-page">
      <div className="card-shell wide">
        <div className="step-dots">
          <span className="step-dot done" /><span className="step-dot done" /><span className="step-dot active" />
        </div>

        <div style={{ fontSize: 42, marginBottom: 10, animation: 'float 2.5s ease-in-out infinite' }}>{q.icon}</div>
        <h2 className="card-title" style={{ fontSize: '1.2rem', marginBottom: 20 }}>{q.q}</h2>
        <div className="qp-opts">
          {q.opts.map((o, i) => (
            <div key={i} className={`qp-opt ${answers[currentQ] === i ? 'selected' : ''}`} onClick={() => selectOpt(i)}>
              <span className="qp-letter">{letters[i]}</span>{o.text}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
          <span style={{ fontSize: '.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Question {currentQ + 1} of {surveyQuestions.length}</span>
          <div style={{ flex: 1, maxWidth: 180, marginLeft: 16, height: 4, borderRadius: 99, background: 'rgba(255,255,255,.05)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((currentQ + 1) / surveyQuestions.length) * 100}%`, borderRadius: 99, background: 'var(--violet)', transition: 'width .4s var(--ease-out)' }} />
          </div>
        </div>
        <button className="btn-primary" disabled={answers[currentQ] === null} onClick={next} style={{ marginTop: 16 }}>
          {currentQ === surveyQuestions.length - 1 ? 'See My Results →' : 'Next →'}
        </button>
        <div style={{ marginTop: 8 }}><button className="btn-ghost" onClick={() => navigate('/home')}>Skip for now →</button></div>
      </div>
    </div>
  );
}

const styleConfigs = [
  { key: 'visual', label: '👁️ Visual', name: 'Visual', gradient: 'linear-gradient(90deg,var(--violet-deep),var(--violet))', color: 'var(--violet)' },
  { key: 'auditory', label: '🎧 Auditory', name: 'Auditory', gradient: 'linear-gradient(90deg,var(--sky),#93c5fd)', color: 'var(--sky)' },
  { key: 'reading', label: '📖 Read/Write', name: 'Read/Write', gradient: 'linear-gradient(90deg,var(--emerald),#6ee7b7)', color: 'var(--emerald)' },
  { key: 'kinesthetic', label: '🤲 Kinesthetic', name: 'Kinesthetic', gradient: 'linear-gradient(90deg,var(--coral),#fdba74)', color: 'var(--coral)' },
];

const styleDescriptions: Record<string, string> = {
  visual: "You process information best through diagrams, mind maps, and spatial layouts. We'll prioritize visual study aids and concept maps in your courses.",
  auditory: "You absorb information most effectively through listening and spoken explanations. We'll prioritize audio summaries and text-to-speech in your courses.",
  reading: "You retain information best through reading and writing. We'll prioritize structured notes and detailed text content in your courses.",
  kinesthetic: "You learn best through hands-on interaction and practice. We'll prioritize interactive exercises and simulations in your courses.",
};

const styleIcons: Record<string, string> = { visual: '👁️', auditory: '🎧', reading: '📖', kinesthetic: '🤲' };

export function StyleResultPage() {
  const navigate = useNavigate();
  const { styleScores, setStyleScores } = useApp();
  const maxScore = 15;

  const sorted = [...styleConfigs].sort((a, b) => (styleScores[b.key] || 0) - (styleScores[a.key] || 0));
  const primary = sorted[0];

  const overrideStyle = (styleName: string) => {
    const newScores: Record<string, number> = { visual: 2, auditory: 2, reading: 2, kinesthetic: 2 };
    newScores[styleName] = 15;
    setStyleScores(newScores);
  };

  return (
    <div className="centered-page">
      <div className="card-shell wide">
        <div className="result-style-icon">{styleIcons[primary.key]}</div>
        <h2 className="card-title">Your Learning Style</h2>
        <p className="card-sub">Based on your answers, here's how you learn best. We'll adapt your content accordingly.</p>
        <div className="result-bars">
          {styleConfigs.map((c, i) => {
            const pct = Math.round(((styleScores[c.key] || 0) / maxScore) * 100);
            const isPrimary = c.key === primary.key;
            return (
              <div key={c.key} className="result-bar-row" style={isPrimary ? { background: 'rgba(255,255,255,.02)', borderRadius: 8, padding: '6px 8px', margin: '0 -8px' } : undefined}>
                <span className="result-bar-label">{c.label}{isPrimary ? ' ★' : ''}</span>
                <div className="result-bar-track">
                  <div className="result-bar-fill" style={{ width: `${pct}%`, background: c.gradient, animationDelay: `${i * 0.12 + 0.1}s` }} />
                </div>
                <span className="result-bar-val" style={{ color: c.color }}>{pct}%</span>
              </div>
            );
          })}
        </div>

        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-dim)', borderRadius: 'var(--r-md)', padding: '14px 18px', marginBottom: 18, textAlign: 'left' }}>
          <p style={{ fontSize: '.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <strong style={{ color: primary.color }}>{`Primary: ${primary.name} learner.`}</strong> {styleDescriptions[primary.key]}
          </p>
        </div>

        <div style={{ borderTop: '1px solid var(--border-dim)', paddingTop: 18, marginBottom: 20 }}>
          <p style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 500 }}>Not quite right? Choose your preferred style:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {styleConfigs.map(c => (
              <button key={c.key} className={`pill ${c.key === primary.key ? 'selected' : ''}`} onClick={() => overrideStyle(c.key)}>
                <span className="pill-icon">{styleIcons[c.key]}</span> {c.name}
              </button>
            ))}
          </div>
        </div>

        <button className="btn-primary" onClick={() => navigate('/home')}>Start Learning →</button>
      </div>
    </div>
  );
}
