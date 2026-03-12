import React from 'react';
import { useApp } from '../context/AppContext';

export function AccessibilityOverlay() {
  const { showAccessibility, setShowAccessibility, a11ySettings, setA11ySettings, themeMode, setThemeMode } = useApp();

  if (!showAccessibility) return null;

  const update = (key: string, value: any) => {
    setA11ySettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setA11ySettings({ fontSize: 1, fontWeight: 'normal', lineSpacing: 1.6, colorMode: 'none', theme: 'dark' });
    setThemeMode('light');
  };

  return (
    <div className="a11y-overlay visible" onClick={(e) => { if (e.target === e.currentTarget) setShowAccessibility(false); }}>
      <div className="a11y-panel">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700 }}>⚙️ Accessibility Settings</h3>
          <button onClick={() => setShowAccessibility(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer' }}>✕</button>
        </div>

        <div className="a11y-group">
          <label className="a11y-label">Theme Mode</label>
          <div className="a11y-options">
            {[{ label: '☀️ Light', val: 'light' as const }, { label: '🌙 Dark', val: 'dark' as const }].map(o => (
              <button key={o.label} className={`a11y-opt ${themeMode === o.val ? 'active' : ''}`} onClick={() => setThemeMode(o.val)}>{o.label}</button>
            ))}
          </div>
        </div>

        <div className="a11y-group">
          <label className="a11y-label">Font Size</label>
          <div style={{ padding: '0 4px' }}>
            <input
              type="range"
              min="0.85"
              max="1.4"
              step="0.05"
              value={a11ySettings.fontSize}
              onChange={(e) => update('fontSize', parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--violet)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.66rem', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>Small</span>
              <span style={{ color: 'var(--violet)', fontWeight: 600 }}>{Math.round(a11ySettings.fontSize * 100)}%</span>
              <span>Large</span>
            </div>
          </div>
        </div>

        <div className="a11y-group">
          <label className="a11y-label">Font Weight</label>
          <div className="a11y-options">
            {[{ label: 'Normal', val: 'normal' }, { label: 'Bold', val: 'bold' }].map(o => (
              <button key={o.label} className={`a11y-opt ${a11ySettings.fontWeight === o.val ? 'active' : ''}`} onClick={() => update('fontWeight', o.val)}>{o.label}</button>
            ))}
          </div>
        </div>

        <div className="a11y-group">
          <label className="a11y-label">Line Spacing</label>
          <div style={{ padding: '0 4px' }}>
            <input
              type="range"
              min="1.4"
              max="2.6"
              step="0.1"
              value={a11ySettings.lineSpacing}
              onChange={(e) => update('lineSpacing', parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--violet)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.66rem', color: 'var(--text-muted)', marginTop: 4 }}>
              <span>Compact</span>
              <span style={{ color: 'var(--violet)', fontWeight: 600 }}>{a11ySettings.lineSpacing.toFixed(1)}</span>
              <span>Wide</span>
            </div>
          </div>
        </div>

        <div className="a11y-group">
          <label className="a11y-label">Color Vision</label>
          <div className="a11y-options">
            {[{ label: 'Default', val: 'none' }, { label: 'Deuteranopia', val: 'deuteranopia' }, { label: 'Protanopia', val: 'protanopia' }, { label: 'Tritanopia', val: 'tritanopia' }].map(o => (
              <button key={o.label} className={`a11y-opt ${a11ySettings.colorMode === o.val ? 'active' : ''}`} onClick={() => update('colorMode', o.val)}>{o.label}</button>
            ))}
          </div>
        </div>

        <div className="a11y-group">
          <label className="a11y-label">Contrast</label>
          <div className="a11y-options">
            {[{ label: 'Default', val: 'dark' }, { label: 'High Contrast', val: 'high-contrast' }].map(o => (
              <button key={o.label} className={`a11y-opt ${a11ySettings.theme === o.val ? 'active' : ''}`} onClick={() => update('theme', o.val)}>{o.label}</button>
            ))}
          </div>
        </div>

        <button className="btn-secondary" onClick={reset} style={{ marginTop: 14, fontSize: '.78rem' }}>Reset to Defaults</button>
      </div>
    </div>
  );
}
