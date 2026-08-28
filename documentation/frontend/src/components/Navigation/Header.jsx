import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  MapPin,
  CheckCheck,
  ChevronDown,
  User,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth, INDIAN_STATES } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DocumentIcon from '../Common/DocumentIcon';

export const Header = () => {
  const {
    navigateTo,
    documents,
    dashboardStats,
    globalSearchQuery,
    setGlobalSearchQuery,
    refreshStats
  } = useApp();
  const { user, updateProfile, openAuthModal, logout } = useAuth();
  const { success } = useToast();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isStatePickerOpen, setIsStatePickerOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const stateRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setIsProfileMenuOpen(false);
      if (stateRef.current && !stateRef.current.contains(e.target)) setIsStatePickerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered search results
  const searchResults = globalSearchQuery.trim()
    ? documents.filter(d =>
        d.name.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(globalSearchQuery.toLowerCase()) ||
        d.category.toLowerCase().includes(globalSearchQuery.toLowerCase())
      )
    : [];

  const handleMarkAllNotifsRead = async () => {
    try {
      await fetch('/api/stats/notifications/read-all', { method: 'POST' });
      refreshStats();
      success("All notifications marked as read");
    } catch (e) {}
  };

  const handleSelectState = (stateName) => {
    updateProfile({ state: stateName });
    setIsStatePickerOpen(false);
    success(`Preferred state updated to ${stateName}`);
  };

  const unreadCount = dashboardStats?.unread_notifications_count || 0;
  const notifications = dashboardStats?.notifications || [];

  return (
    <header className="app-header">
      {/* Search Input with Autocomplete */}
      <div className="header-search-bar" ref={searchRef}>
        <Search size={18} className="header-search-icon" />
        <input
          type="text"
          className="header-search-input"
          placeholder="Search documents (Aadhaar, PAN, Passport...)"
          value={globalSearchQuery}
          onChange={(e) => {
            setGlobalSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
        />

        {/* Autocomplete Search Dropdown */}
        {isSearchOpen && globalSearchQuery.trim() && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 60,
              maxHeight: '380px',
              overflowY: 'auto'
            }}
          >
            {searchResults.length > 0 ? (
              <div style={{ padding: '8px' }}>
                <div style={{ padding: '6px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Documents Found ({searchResults.length})
                </div>
                {searchResults.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setGlobalSearchQuery('');
                      navigateTo('guide', { docId: doc.id });
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 12px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--light-blue)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--light-blue)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <DocumentIcon iconName={doc.icon} size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-main)' }}>{doc.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{doc.category} • {doc.processing_time}</div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600 }}>Guide →</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                No matching documents found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Header Actions */}
      <div className="header-actions">
        {/* State Selector */}
        <div style={{ position: 'relative' }} ref={stateRef}>
          <button
            onClick={() => setIsStatePickerOpen(!isStatePickerOpen)}
            className="btn btn-outline btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <MapPin size={15} color="var(--primary)" />
            <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.state || 'Maharashtra'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {isStatePickerOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '240px',
                maxHeight: '320px',
                overflowY: 'auto',
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 60,
                padding: '6px'
              }}
            >
              <div style={{ padding: '8px 12px', fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Select Your State / UT
              </div>
              {INDIAN_STATES.map((s) => (
                <div
                  key={s}
                  onClick={() => handleSelectState(s)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    color: user.state === s ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: user.state === s ? 600 : 400,
                    backgroundColor: user.state === s ? 'var(--light-blue)' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (user.state !== s) e.currentTarget.style.backgroundColor = 'var(--secondary-bg)';
                  }}
                  onMouseLeave={(e) => {
                    if (user.state !== s) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="btn btn-outline btn-icon-only"
            style={{ position: 'relative', width: '38px', height: '38px', padding: 0 }}
            title="Notifications"
          >
            <Bell size={18} color="var(--text-secondary)" />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--error)',
                  border: '2px solid var(--white)'
                }}
              />
            )}
          </button>

          {isNotifOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 60,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '14px 18px',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Notifications {unreadCount > 0 && <span style={{ color: 'var(--primary)' }}>({unreadCount})</span>}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllNotifsRead}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCheck size={14} /> Mark read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        padding: '12px 16px',
                        borderBottom: '1px solid #F1F5F9',
                        backgroundColor: n.is_read ? 'var(--white)' : '#F0F7FF'
                      }}
                    >
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '2px' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                        {n.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    No notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar / Menu */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px'
            }}
          >
            <img
              src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
              alt={user.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid var(--light-blue)', objectFit: 'cover' }}
            />
          </button>

          {isProfileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '220px',
                backgroundColor: 'var(--white)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 60,
                padding: '8px'
              }}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)' }}>{user.name}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email}
                </div>
              </div>

              <div style={{ paddingTop: '6px' }}>
                <div
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    navigateTo('profile');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: 'var(--text-main)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <User size={16} color="var(--primary)" /> Profile & Settings
                </div>

                <div
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    openAuthModal('login');
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: 'var(--text-main)',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--secondary-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <ShieldCheck size={16} color="var(--primary)" /> Switch Account
                </div>

                <div
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                    success("Logged out successfully");
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    color: 'var(--error)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    marginTop: '4px',
                    borderTop: '1px solid #F1F5F9'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--error-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <LogOut size={16} /> Log Out
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
