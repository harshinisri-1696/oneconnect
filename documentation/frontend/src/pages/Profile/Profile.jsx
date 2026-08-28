import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Save,
  LogOut,
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  Camera,
  Activity,
  BookmarkCheck,
  FileCheck
} from 'lucide-react';
import { useAuth, INDIAN_STATES } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import Card, { CardBody, CardHeader } from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Modal from '../../components/Common/Modal';

const AVATAR_OPTIONS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80"
];

export const Profile = () => {
  const { user, updateProfile, token, logout, openAuthModal } = useAuth();
  const { dashboardStats, savedApplications, navigateTo } = useApp();
  const { success, error } = useToast();

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [address, setAddress] = useState(user.address || '');
  const [state, setState] = useState(user.state || 'Maharashtra');
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar || AVATAR_OPTIONS[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(true);

  const recentActivities = dashboardStats?.recent_activities || [];

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          state,
          avatar: selectedAvatar
        })
      });

      const json = await res.json();
      if (json.success) {
        updateProfile({ name, email, phone, address, state, avatar: selectedAvatar });
        success("Profile updated successfully!");
      } else {
        error(json.message || "Failed to update profile");
      }
    } catch (err) {
      error("Profile update failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '6px' }}>
          <Sparkles size={14} /> Citizen Profile & Security
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
          User Profile & Settings
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-secondary)' }}>
          Manage your personal details, residential jurisdiction state, and activity audit history.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)', gap: '28px' }}>
        {/* Left Column: Profile Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card>
            <CardHeader>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
                Personal Information
              </h3>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSaveProfile}>
                {/* Avatar Picker */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ marginBottom: '10px' }}>Select Avatar</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                    {AVATAR_OPTIONS.map((avUrl, idx) => (
                      <img
                        key={idx}
                        src={avUrl}
                        alt="Avatar choice"
                        onClick={() => setSelectedAvatar(avUrl)}
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: selectedAvatar === avUrl ? '3px solid var(--primary)' : '2px solid transparent',
                          boxShadow: selectedAvatar === avUrl ? '0 0 0 3px rgba(65, 105, 225, 0.25)' : 'none',
                          transition: 'all 0.15s'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Add a phone number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-textarea"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Add your residential address"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Permanent State / UT of Residence</label>
                  <select
                    className="form-select"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  >
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <div className="form-help">
                    State selection is used to tailor dynamic eligibility questions and local e-District portals.
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '28px' }}>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={isSaving}
                    icon={<Save size={16} />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>

          {/* Preferences & Notifications */}
          <Card>
            <CardHeader>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-main)' }}>
                Notification Preferences
              </h3>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                      Application Milestone Alerts
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Receive notifications when your application advances stage (e.g. Police Verification, Approved).
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifEmail}
                    onChange={(e) => setNotifEmail(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                      Government Policy Updates
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Get alerts about new UIDAI biometric rules, fee reductions, or state quota schemes.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifSms}
                    onChange={(e) => setNotifSms(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                  />
                </label>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column: User Snapshot & Audit Trail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* User Snapshot Card */}
          <Card style={{ textAlign: 'center' }}>
            <CardBody style={{ padding: '28px 20px' }}>
              <img
                src={selectedAvatar}
                alt={user.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  margin: '0 auto 14px auto',
                  border: '3px solid var(--light-blue)'
                }}
              />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>{user.name}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{user.email}</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', backgroundColor: 'var(--secondary-bg)', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Saved Apps</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--primary)' }}>{savedApplications.length}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>State</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>{user.state}</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openAuthModal('login')}
                  style={{ width: '100%' }}
                >
                  Switch / Login Another Account
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  icon={<LogOut size={14} />}
                  onClick={() => {
                    logout();
                    success("Logged out successfully");
                  }}
                  style={{ width: '100%' }}
                >
                  Log Out
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Activity Audit Trail */}
          <Card>
            <CardHeader>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="var(--primary)" />
                <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-main)' }}>
                  Saved Activity History
                </h4>
              </div>
            </CardHeader>
            <CardBody style={{ padding: '16px' }}>
              {recentActivities.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {recentActivities.map((act) => (
                    <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--primary)', marginTop: '6px', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-main)' }}>{act.title}</div>
                        <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                          {act.description}
                        </p>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                          {new Date(act.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', textAlign: 'center', padding: '12px 0' }}>
                  No saved history yet.
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
