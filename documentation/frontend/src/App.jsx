import React, { useState, useRef, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { useAuth, INDIAN_STATES } from './context/AuthContext';
import { useToast } from './context/ToastContext';
import AuthModal from './components/Auth/AuthModal';
import {
  FileCheck2,
  User,
  LogOut,
  ShieldCheck,
  MapPin,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Home
} from 'lucide-react';

// Pages
import Dashboard from './pages/Dashboard/Dashboard';
import ExploreDocuments from './pages/ExploreDocuments/ExploreDocuments';
import EligibilityCheck from './pages/EligibilityCheck/EligibilityCheck';
import ApplicationGuide from './pages/ApplicationGuide/ApplicationGuide';
import ApplyStatus from './pages/ApplyStatus/ApplyStatus';
import SavedApplications from './pages/SavedApplications/SavedApplications';
import FAQ from './pages/FAQ/FAQ';
import Profile from './pages/Profile/Profile';
import DocumentDetails from './pages/DocumentDetails/DocumentDetails';

/* ────────────────────────────────────────────────────────────
   App Bar — slim top chrome (no sidebar, no bottom nav)
──────────────────────────────────────────────────────────── */
const AppBar = () => {
  const { navigateTo } = useApp();
  const { user, updateProfile, openAuthModal, logout } = useAuth();
  const { success } = useToast();

  const [profileOpen, setProfileOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);

  const profileRef = useRef(null);
  const stateRef = useRef(null);




  const handleSelectState = (s) => {
    updateProfile({ state: s });
    setStateOpen(false);
    success(`State updated to ${s}`);
  };

  return (
    <>
      {/* ── App Bar ────────────────────────────────── */}
      <header className="app-bar">
        {/* Brand */}
        <div className="app-bar-brand" onClick={() => navigateTo('dashboard')}>
          <div className="app-bar-brand-icon">
            <FileCheck2 size={20} />
          </div>
          <div className="app-bar-brand-text">
              <h1>Documentation</h1>
              <span>CitizenDoc Services</span>
          </div>
        </div>

        <div className="app-bar-spacer" />

        <div className="app-bar-actions">
          {/* State Selector */}
          <div style={{ position: 'relative' }} ref={stateRef}>
            <button
              className="app-bar-icon-btn"
              onClick={() => setStateOpen(!stateOpen)}
              title={user.state || 'Set state'}
              style={{ width: 'auto', padding: '0 10px', gap: '6px', fontSize: '12px', fontWeight: 600 }}
            >
              <MapPin size={15} />
              <span style={{ display: 'none', whiteSpace: 'nowrap', maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    className="state-label">
                {user.state || 'State'}
              </span>
              <ChevronDown size={13} />
            </button>

            {stateOpen && (
              <div className="dropdown-menu" style={{ right: 0, top: 'calc(100% + 8px)', width: '240px', maxHeight: '300px', overflowY: 'auto', padding: '6px' }}>
                <div style={{ padding: '8px 12px 6px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                  Select Your State / UT
                </div>
                {INDIAN_STATES.map(s => (
                  <div
                    key={s}
                    className="dropdown-item"
                    style={{ color: user.state === s ? 'var(--primary)' : undefined, fontWeight: user.state === s ? 600 : 400, background: user.state === s ? 'var(--light-blue)' : undefined }}
                    onClick={() => handleSelectState(s)}
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile avatar */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="app-bar-avatar"
              onClick={() => setProfileOpen(!profileOpen)}
            />

            {profileOpen && (
              <div className="dropdown-menu" style={{ right: 0, top: 'calc(100% + 8px)', width: '220px', padding: '6px' }}>
                <div style={{ padding: '10px 14px 10px', borderBottom: '1px solid var(--border-color)', marginBottom: '4px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
                </div>
                <div className="dropdown-item" onClick={() => { setProfileOpen(false); navigateTo('profile'); }}>
                  <User size={16} color="var(--primary)" /> Profile &amp; Settings
                </div>
                <div className="dropdown-item" onClick={() => { setProfileOpen(false); openAuthModal('login'); }}>
                  <ShieldCheck size={16} color="var(--primary)" /> Switch Account
                </div>
                <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px', paddingTop: '4px' }}>
                  <div className="dropdown-item danger" onClick={() => { setProfileOpen(false); logout(); success('Logged out successfully'); }}>
                    <LogOut size={16} /> Log Out
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

    </>
  );
};

/* ────────────────────────────────────────────────────────────
   Page Router
──────────────────────────────────────────────────────────── */
const AppContent = () => {
  const { currentPage, navigateTo, canGoBack, canGoForward, goBack, goForward } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':   return <Dashboard />;
      case 'explore':     return <ExploreDocuments />;
      case 'eligibility': return <EligibilityCheck />;
      case 'guide':       return <ApplicationGuide />;
      case 'status':      return <ApplyStatus />;
      case 'saved':       return <SavedApplications />;
      case 'faq':         return <FAQ />;
      case 'profile':     return <Profile />;
      case 'details':     return <DocumentDetails />;
      default:            return <Dashboard />;
    }
  };

  return (
    <div className="app-shell">
      <AppBar />
      <div className="page-connection" aria-label="Page navigation">
        <div className="page-connection-inner">
          <button className="page-connection-button" onClick={goBack} disabled={!canGoBack} aria-label="Go back">
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <button className="page-connection-button" onClick={goForward} disabled={!canGoForward} aria-label="Go forward">
            <span>Forward</span>
            <ArrowRight size={16} />
          </button>
          {currentPage !== 'dashboard' && (
            <button className="page-connection-home" onClick={() => navigateTo('dashboard')}>
              <Home size={15} />
              <span>Dashboard</span>
            </button>
          )}
        </div>
      </div>
      <main className="main-content">
        {renderPage()}
      </main>
      <AuthModal />
    </div>
  );
};

export const App = () => (
  <ToastProvider>
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  </ToastProvider>
);

export default App;
