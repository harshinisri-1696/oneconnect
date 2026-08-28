import React from 'react';
import {
  LayoutDashboard,
  Compass,
  CheckCircle2,
  Activity,
  BookmarkCheck,
  HelpCircle,
  User,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { currentPage, navigateTo, isSidebarCollapsed, toggleSidebar, savedApplications } = useApp();
  const { user } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Documents', icon: Compass },
    { id: 'eligibility', label: 'Eligibility Check', icon: CheckCircle2 },
    { id: 'status', label: 'Apply Status', icon: Activity, badge: savedApplications.filter(a => a.status !== 'Completed' && a.status !== 'Draft').length },
    { id: 'saved', label: 'Saved Applications', icon: BookmarkCheck, badge: savedApplications.length },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <aside className={`desktop-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div
          className="brand-logo-container"
          onClick={() => navigateTo('dashboard')}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-icon-box">
            <FileCheck2 size={22} />
          </div>
          {!isSidebarCollapsed && (
            <div className="brand-title-box">
              <h1>CitizenDoc</h1>
              <span>Assistance Platform</span>
            </div>
          )}
        </div>

        <button
          onClick={toggleSidebar}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '6px',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {!isSidebarCollapsed && <div className="nav-section-title">Navigation Menu</div>}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`nav-link-item ${isActive ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigateTo(item.id);
              }}
              title={isSidebarCollapsed ? item.label : undefined}
            >
              <Icon size={20} style={{ flexShrink: 0 }} />
              {!isSidebarCollapsed && <span>{item.label}</span>}
              {!isSidebarCollapsed && item.badge > 0 && (
                <span className="nav-badge-pill">{item.badge}</span>
              )}
            </a>
          );
        })}

        {/* Verification banner in expanded mode */}
        {!isSidebarCollapsed && (
          <div
            style={{
              marginTop: 'auto',
              padding: '14px',
              backgroundColor: 'var(--light-blue)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #BFDBFE',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--dark-blue)', fontWeight: 600, fontSize: '12px' }}>
              <ShieldCheck size={16} color="var(--primary)" />
              <span>Official Portals Direct</span>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              100% verified links to UIDAI, NSDL, Passport Seva & Parivahan.
            </p>
          </div>
        )}
      </nav>

      {/* Sidebar Footer / User Profile */}
      <div className="sidebar-footer">
        <div
          className="sidebar-user-card"
          onClick={() => navigateTo('profile')}
          style={{ cursor: 'pointer' }}
          title="Manage profile"
        >
          <img
            src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"}
            alt={user.name}
            className="user-avatar-img"
          />
          {!isSidebarCollapsed && (
            <div className="user-meta-info">
              <div className="user-name-text">{user.name}</div>
              <div className="user-state-text">📍 {user.state}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
