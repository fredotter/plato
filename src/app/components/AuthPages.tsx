import React from 'react';
import { useNavigate } from 'react-router';

export function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="centered-page">
      <div className="card-shell">
        <div className="logo-row"><div className="logo-mark">D</div><span className="logo-word">disco</span></div>
        <h2 className="card-title">Welcome back</h2>
        <p className="card-sub">Log in to continue your learning journey.</p>
        <div className="input-group">
          <label className="input-label">Username or Email</label>
          <input className="input-field" type="text" placeholder="gibran@ubc.ca" />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input className="input-field" type="password" placeholder="••••••••" />
        </div>
        <button className="btn-primary" onClick={() => navigate('/home')} style={{ marginTop: 8 }}>Log In</button>
        <div className="link-row">Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span></div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  return (
    <div className="centered-page">
      <div className="card-shell">
        <div className="logo-row"><div className="logo-mark">D</div><span className="logo-word">disco</span></div>
        <h2 className="card-title">Create your account</h2>
        <p className="card-sub">Start learning smarter in under a minute.</p>
        <div className="input-group">
          <label className="input-label">Username</label>
          <input className="input-field" type="text" placeholder="gibran_learns" />
        </div>
        <div className="input-group">
          <label className="input-label">Email</label>
          <input className="input-field" type="email" placeholder="gibran@ubc.ca" />
        </div>
        <div className="input-group">
          <label className="input-label">Password</label>
          <input className="input-field" type="password" placeholder="••••••••" />
        </div>
        <div className="input-group">
          <label className="input-label">Confirm Password</label>
          <input className="input-field" type="password" placeholder="••••••••" />
        </div>
        <button className="btn-primary" onClick={() => navigate('/intro')} style={{ marginTop: 4 }}>Sign Up</button>
        <div className="link-row">Already have an account? <span onClick={() => navigate('/login')}>Log In</span></div>
      </div>
    </div>
  );
}
