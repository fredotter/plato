import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { TopNav } from './TopNav';
import { useApp } from '../context/AppContext';

const pythonModules = [
  { num: '✓', status: 'done', title: 'Module 1: Setup & Hello World', desc: 'Installation, IDE, first program', time: '12 min', statusText: 'Done', statusColor: 'var(--emerald)' },
  { num: '✓', status: 'done', title: 'Module 2: Variables & Data Types', desc: 'Strings, integers, lists, dicts', time: '18 min', statusText: 'Done', statusColor: 'var(--emerald)' },
  { num: '3', status: 'active', title: 'Module 3: Control Flow', desc: 'Loops, conditionals, break/continue', time: '21 min', statusText: 'Current', statusColor: 'var(--violet)', isCurrent: true },
  { num: '4', status: '', title: 'Module 4: Functions & Scope', desc: 'Defining functions, parameters, return', time: '15 min', statusText: 'Locked', statusColor: 'var(--text-muted)' },
  { num: '5', status: '', title: 'Module 5: File I/O & Exceptions', desc: 'Reading files, try/except', time: '14 min', statusText: 'Locked', statusColor: 'var(--text-muted)' },
  { num: '6', status: '', title: 'Module 6: OOP Basics', desc: 'Classes, objects, inheritance', time: '22 min', statusText: 'Locked', statusColor: 'var(--text-muted)' },
  { num: '7', status: '', title: 'Module 7: Libraries & APIs', desc: 'pip, requests, JSON', time: '18 min', statusText: 'Locked', statusColor: 'var(--text-muted)' },
  { num: '8', status: '', title: 'Module 8: Final Project', desc: 'Build a CLI application', time: '30 min', statusText: 'Locked', statusColor: 'var(--text-muted)' },
];

function OfflineToggle() {
  const [state, setState] = useState<'idle' | 'downloading' | 'downloaded'>('idle');

  const toggle = () => {
    if (state === 'downloaded') { setState('idle'); return; }
    setState('downloading');
    setTimeout(() => setState('downloaded'), 1500);
  };

  return (
    <span style={{ fontSize: '.72rem', color: 'var(--text-muted)', marginRight: 12 }}>
      📥{' '}
      <button
        className={`offline-toggle ${state === 'downloaded' ? 'downloaded' : ''}`}
        onClick={toggle}
        style={state === 'downloading' ? { pointerEvents: 'none' } : undefined}
      >
        {state === 'idle' ? 'Download for offline' : state === 'downloading' ? 'Downloading...' : '✓ Available offline'}
      </button>
    </span>
  );
}

export function CoursesPage() {
  const navigate = useNavigate();
  const { setActiveCourseType } = useApp();

  const goToPlayer = (type: 'video' | 'readwrite' | 'auditory' = 'video') => {
    setActiveCourseType(type);
    navigate('/player');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <TopNav activeLink="courses" />
      <div style={{ padding: 36 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 24 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700 }}>My Courses</h1>
          <span style={{ fontSize: '.78rem', color: 'var(--text-muted)' }}>3 courses enrolled</span>
        </div>

        {/* Python Course (expanded) */}
        <div className="courses-detail-card anim">
          <div className="cdc-header" style={{ background: 'linear-gradient(135deg,#1e1145,#2d1b69)' }}>
            <div className="cdc-emoji">🐍</div>
            <div className="cdc-header-info">
              <h2>Introduction to Python</h2>
              <p>Coding Temple · 8 Modules · Beginner</p>
            </div>
            <div className="cdc-header-stats">
              <div className="cdc-stat"><span className="cdc-stat-val" style={{ color: 'var(--sky)' }}>62%</span><span className="cdc-stat-label">Completion</span></div>
              <div className="cdc-stat"><span className="cdc-stat-val" style={{ color: 'var(--emerald)' }}>44%</span><span className="cdc-stat-label">Knowledge</span></div>
              <div className="cdc-stat"><span className="cdc-stat-val" style={{ color: 'var(--amber)' }}>18%</span><span className="cdc-stat-label">Gap</span></div>
            </div>
          </div>
          <div className="cdc-modules">
            {pythonModules.map((m, i) => (
              <div key={i} className={`cdc-mod ${m.isCurrent ? 'current' : ''}`} onClick={m.isCurrent ? () => goToPlayer('video') : undefined}>
                <span className={`cdc-mod-num ${m.status}`}>{m.num}</span>
                <div className="cdc-mod-info"><strong>{m.title}</strong><span>{m.desc}</span></div>
                <span className="cdc-mod-meta">{m.time} · <span style={{ color: m.statusColor }}>{m.statusText}</span></span>
              </div>
            ))}
          </div>
          <div className="cdc-footer">
            <span className="cc-style">🧠 Visual</span>
            <div>
              <OfflineToggle />
              <button className="cc-continue" onClick={() => goToPlayer('video')}>Continue →</button>
            </div>
          </div>
        </div>

        {/* Data Analytics (collapsed) */}
        <div className="courses-detail-card anim d2" style={{ marginTop: 16 }}>
          <div className="cdc-header" style={{ background: 'linear-gradient(135deg,#0f2027,#203a43)' }}>
            <div className="cdc-emoji">📊</div>
            <div className="cdc-header-info">
              <h2>Data Analytics Foundations</h2>
              <p>A.CRE Academy · 6 Modules · Intermediate</p>
            </div>
            <div className="cdc-header-stats">
              <div className="cdc-stat"><span className="cdc-stat-val" style={{ color: 'var(--sky)' }}>35%</span><span className="cdc-stat-label">Completion</span></div>
              <div className="cdc-stat"><span className="cdc-stat-val" style={{ color: 'var(--emerald)' }}>30%</span><span className="cdc-stat-label">Knowledge</span></div>
            </div>
          </div>
          <div className="cdc-footer">
            <span className="cc-style">📝 Read/Write</span>
            <div><OfflineToggle /><button className="cc-continue" onClick={() => goToPlayer('readwrite')}>Continue →</button></div>
          </div>
        </div>

        {/* UX (collapsed) */}
        <div className="courses-detail-card anim d3" style={{ marginTop: 16 }}>
          <div className="cdc-header" style={{ background: 'linear-gradient(135deg,#1a0a2e,#3b1c5a)' }}>
            <div className="cdc-emoji">🎨</div>
            <div className="cdc-header-info">
              <h2>UX Research Methods</h2>
              <p>PM Hive Accelerator · 5 Modules · Beginner</p>
            </div>
            <div className="cdc-header-stats">
              <div className="cdc-stat"><span className="cdc-stat-val" style={{ color: 'var(--sky)' }}>10%</span><span className="cdc-stat-label">Completion</span></div>
              <div className="cdc-stat"><span className="cdc-stat-val" style={{ color: 'var(--emerald)' }}>8%</span><span className="cdc-stat-label">Knowledge</span></div>
            </div>
          </div>
          <div className="cdc-footer">
            <span className="cc-style">🎧 Auditory</span>
            <div><OfflineToggle /><button className="cc-continue" onClick={() => goToPlayer('auditory')}>Start →</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}