import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AppProvider, useApp } from './context/AppContext';
import { AccessibilityOverlay } from './components/AccessibilityOverlay';
import { SearchModal } from './components/SearchModal';
import './disco.css';

function AppShell() {
  const { a11ySettings, themeMode } = useApp();

  const rootStyle: React.CSSProperties = {
    lineHeight: a11ySettings.lineSpacing !== 1.6 ? a11ySettings.lineSpacing : undefined,
  };

  const bodyClasses = [
    'disco-root',
    themeMode === 'light' ? 'theme-light' : '',
    a11ySettings.colorMode !== 'none' ? `cb-${a11ySettings.colorMode}` : '',
    a11ySettings.theme === 'high-contrast' ? 'theme-high-contrast' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={bodyClasses} style={rootStyle}>
      <div className="orb a" />
      <div className="orb b" />
      <RouterProvider router={router} />
      <AccessibilityOverlay />
      <SearchModal />

      {/* SVG filters for color-blind simulation */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
          </filter>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567 0.433 0 0 0  0.558 0.442 0 0 0  0 0.242 0.758 0 0  0 0 0 1 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.433 0.567 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
