import React from 'react';
import { useNavigate } from 'react-router';
import { TopNav } from './TopNav';
import { useApp } from '../context/AppContext';

const leaderboard = [
  { rank: 'gold', name: 'Aisha M.', initial: 'A', bg: '#e879f9', score: 920 },
  { rank: 'silver', name: 'Liam K.', initial: 'L', bg: '#60a5fa', score: 885 },
  { rank: 'bronze', name: 'Gibran (You)', initial: 'G', bg: 'linear-gradient(135deg,#FB923C,#F472B6)', score: 840, isYou: true },
  { rank: 'normal', name: 'Mei L.', initial: 'M', bg: '#34d399', score: 790 },
  { rank: 'normal', name: 'Carlos R.', initial: 'C', bg: '#fbbf24', score: 755 },
];

const courseCards = [
  { emoji: '🐍', title: 'Introduction to Python', org: 'Coding Temple · 8 Modules', bg: 'g1', badge: 'badge-active', badgeText: 'In Progress', comp: 62, know: 44, style: '🧠 Visual', action: 'Continue →' },
  { emoji: '📊', title: 'Data Analytics Foundations', org: 'A.CRE Academy · 6 Modules', bg: 'g2', badge: 'badge-active', badgeText: 'In Progress', comp: 35, know: 30, style: '📝 Read/Write', action: 'Continue →' },
  { emoji: '🎨', title: 'UX Research Methods', org: 'PM Hive Accelerator · 5 Modules', bg: 'g3', badge: 'badge-new', badgeText: 'New', comp: 10, know: 8, style: '🎧 Auditory', action: 'Start →' },
];

export function HomePage() {
  const navigate = useNavigate();
  const { setActiveCourseType } = useApp();

  const goToCourse = (style: string) => {
    if (style.includes('Read/Write')) setActiveCourseType('readwrite');
    else if (style.includes('Auditory')) setActiveCourseType('auditory');
    else setActiveCourseType('video');
    navigate('/player');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <TopNav activeLink="home" />

      <section className="home-hero anim">
        <div>
          <h1>Welcome back, Gibran <span className="wave">👋</span></h1>
          <p>Your learning style is adapting. Keep building momentum — you're closing the comprehension gap.</p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat anim d1"><div className="hs-val" style={{ color: 'var(--violet)' }}>73%</div><div className="hs-label">Avg Knowledge</div></div>
          <div className="hero-stat anim d2"><div className="hs-val" style={{ color: 'var(--emerald)' }}>12</div><div className="hs-label">Day Streak</div></div>
          <div className="hero-stat anim d3"><div className="hs-val" style={{ color: 'var(--amber)' }}>4</div><div className="hs-label">Courses</div></div>
        </div>
      </section>

      <div className="insight-banner anim d2">
        <div className="ib-icon">🧠</div>
        <div className="ib-text">
          <strong>Comprehension Insight:</strong>
          <p>Your completion is 18% ahead of your knowledge score in <em>Intro to Python</em>. Targeted review checkpoints can close the gap.</p>
        </div>
        <button className="ib-action" onClick={() => navigate('/player')}>Review Now →</button>
      </div>

      <div className="section-heading anim d3"><h2>Continue Learning</h2><button className="see-all">View all →</button></div>
      <div className="course-grid">
        {courseCards.map((c, i) => (
          <div key={i} className={`course-card anim d${i + 3}`} onClick={() => goToCourse(c.style)}>
            <div className="cc-banner">
              <div className={`bg ${c.bg}`} />
              <div className="cc-emoji">{c.emoji}</div>
              <div className={`cc-badge ${c.badge}`}>{c.badgeText}</div>
            </div>
            <div className="cc-body">
              <div className="cc-title">{c.title}</div>
              <div className="cc-org">{c.org}</div>
              <div className="cc-metrics">
                <div className="cc-metric-row">
                  <span className="cc-metric-label">Completion</span>
                  <div className="cc-bar-track"><div className="cc-bar-fill comp" style={{ width: `${c.comp}%` }} /></div>
                  <span className="cc-metric-val" style={{ color: 'var(--sky)' }}>{c.comp}%</span>
                </div>
                <div className="cc-metric-row">
                  <span className="cc-metric-label">Knowledge</span>
                  <div className="cc-bar-track"><div className="cc-bar-fill know" style={{ width: `${c.know}%` }} /></div>
                  <span className="cc-metric-val" style={{ color: 'var(--emerald)' }}>{c.know}%</span>
                </div>
              </div>
              <div className="cc-footer">
                <span className="cc-style">{c.style}</span>
                <button className="cc-continue" onClick={(e) => { e.stopPropagation(); goToCourse(c.style); }}>{c.action}</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="home-bottom">
        <div className="home-panel anim d5">
          <h3>Community Leaderboard</h3>
          {leaderboard.map((l, i) => (
            <div key={i} className="lb-row">
              <div className={`lb-rank ${l.rank}`}>{i + 1}</div>
              <div className="lb-av" style={{ background: l.bg }}>{l.initial}</div>
              <div className={`lb-name ${l.isYou ? 'lb-you' : ''}`}>{l.name}</div>
              <div className="lb-score">{l.score}</div>
            </div>
          ))}
        </div>
        <div className="home-panel anim d6">
          <h3>Your Stats</h3>
          <div className="streak-grid">
            <div className="streak-card"><div className="sc-icon">🔥</div><div className="sc-val" style={{ color: 'var(--amber)' }}>12</div><div className="sc-label">Day Streak</div></div>
            <div className="streak-card"><div className="sc-icon">🧠</div><div className="sc-val" style={{ color: 'var(--violet)' }}>73%</div><div className="sc-label">Avg Knowledge</div></div>
            <div className="streak-card"><div className="sc-icon">📚</div><div className="sc-val" style={{ color: 'var(--sky)' }}>24</div><div className="sc-label">Checks Passed</div></div>
            <div className="streak-card"><div className="sc-icon">⏱️</div><div className="sc-val" style={{ color: 'var(--emerald)' }}>6.2h</div><div className="sc-label">This Week</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}