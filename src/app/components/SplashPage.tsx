import React from 'react';
import { useNavigate } from 'react-router';

export function SplashPage() {
  const navigate = useNavigate();
  return (
    <div className="centered-page">
      <div className="splash-inner">
        <div className="splash-logo">D</div>
        <div className="splash-title" style={{ fontFamily: 'var(--font-display)' }}>disco</div>
        <p className="splash-tagline">AI-powered learning that adapts to you. Completion meets comprehension.</p>
        <div className="splash-btns">
          <button className="btn-primary" onClick={() => navigate('/login')}>Log In</button>
          <button className="btn-secondary" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
}
