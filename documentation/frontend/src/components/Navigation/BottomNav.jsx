import React from 'react';
import {
  LayoutDashboard,
  Compass,
  CheckCircle2,
  Activity,
  BookmarkCheck,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav = () => {
  const { currentPage, navigateTo, savedApplications } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'eligibility', label: 'Eligibility', icon: CheckCircle2 },
    { id: 'status', label: 'Status', icon: Activity, badge: savedApplications.filter(a => a.status !== 'Completed' && a.status !== 'Draft').length },
    { id: 'saved', label: 'Saved', icon: BookmarkCheck },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id;

        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              navigateTo(item.id);
            }}
          >
            <div style={{ position: 'relative' }}>
              <Icon size={20} />
              {item.badge > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-8px',
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--white)',
                    fontSize: '9px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
};

export default BottomNav;
