import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const allCourses = [
  { emoji: '🐍', title: 'Introduction to Python', org: 'Coding Temple', style: 'Visual', path: '/player', type: 'video' as const },
  { emoji: '📊', title: 'Data Analytics Foundations', org: 'A.CRE Academy', style: 'Read/Write', path: '/player', type: 'readwrite' as const },
  { emoji: '🎨', title: 'UX Research Methods', org: 'PM Hive Accelerator', style: 'Auditory', path: '/player', type: 'auditory' as const },
  { emoji: '🤖', title: 'Machine Learning Basics', org: 'AI Academy', style: 'Visual', path: '/player', type: 'video' as const },
  { emoji: '📱', title: 'Mobile App Development', org: 'App Masters', style: 'Visual', path: '/player', type: 'video' as const },
  { emoji: '🔐', title: 'Cybersecurity Fundamentals', org: 'SecureLearn', style: 'Read/Write', path: '/player', type: 'readwrite' as const },
];

export function SearchModal() {
  const { showSearch, setShowSearch, setActiveCourseType } = useApp();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
    }
  }, [showSearch]);

  if (!showSearch) return null;

  const filtered = query.trim()
    ? allCourses.filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase()) ||
        c.org.toLowerCase().includes(query.toLowerCase()) ||
        c.style.toLowerCase().includes(query.toLowerCase())
      )
    : allCourses;

  const handleSelect = (course: typeof allCourses[0]) => {
    setActiveCourseType(course.type);
    setShowSearch(false);
    window.location.href = course.path;
  };

  return (
    <div className="search-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setShowSearch(false); }}>
      <div className="search-modal">
        <div className="search-input-wrap">
          <span style={{ fontSize: 18, opacity: 0.5 }}>🔍</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, topics, modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => setShowSearch(false)}
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-dim)',
              borderRadius: 6,
              padding: '3px 8px',
              fontSize: '.68rem',
              fontWeight: 600,
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            ESC
          </button>
        </div>
        <div className="search-results">
          {filtered.length === 0 ? (
            <div className="search-empty">No courses found for "{query}"</div>
          ) : (
            filtered.map((course, i) => (
              <div key={i} className="search-result-item" onClick={() => handleSelect(course)}>
                <span className="search-result-emoji">{course.emoji}</span>
                <div className="search-result-info">
                  <h4>{course.title}</h4>
                  <p>{course.org} · {course.style} Path</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}