import React from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

export function TopNav({ activeLink }: { activeLink?: string }) {
  const navigate = useNavigate();
  const { setShowAccessibility, themeMode, toggleTheme, setShowSearch } = useApp();

  return (
    <nav className="topnav">
      <div className="topnav-left">
        <div className="topnav-brand" onClick={() => navigate('/home')}>
          <div className="logo-mark">D</div>
          <span>disco</span>
        </div>
        <div className="topnav-links">
          <button className={`topnav-link ${activeLink === 'home' ? 'active' : ''}`} onClick={() => navigate('/home')}>Home</button>
          <button className={`topnav-link ${activeLink === 'courses' ? 'active' : ''}`} onClick={() => navigate('/courses')}>My Courses</button>
          <button className={`topnav-link ${activeLink === 'community' ? 'active' : ''}`} onClick={() => navigate('/community')}>Community</button>
          {activeLink === 'lesson' && <button className="topnav-link active">Lesson</button>}
        </div>
      </div>
      <div className="topnav-right">
        <div className="topnav-search" onClick={() => setShowSearch(true)}>
          <span>🔍</span> Search courses... <span className="sk">⌘K</span>
        </div>
        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
          {themeMode === 'light' ? '🌙' : '☀️'}
        </button>
        <button className="topnav-link" onClick={() => setShowAccessibility(true)} title="Accessibility" style={{ fontSize: '16px', padding: '6px 10px' }}>⚙️</button>
        <div className="avatar" onClick={() => setShowAccessibility(true)}>G</div>
      </div>
    </nav>
  );
}
