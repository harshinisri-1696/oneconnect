import React, { useState } from 'react';
import { useAuth, INDIAN_STATES } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

export const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authMode, setAuthMode, login } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [state, setState] = useState('Maharashtra');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = authMode === 'login'
      ? { email, password }
      : { name, email, password, state };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const json = await res.json();
      if (json.success) {
        login(json.user, json.token);
        success(json.message || (authMode === 'login' ? 'Logged in!' : 'Account registered!'));
      } else {
        error(json.message || 'Authentication failed');
      }
    } catch (err) {
      error('Network error during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={authMode === 'login' ? 'CitizenDoc Login' : 'Create CitizenDoc Account'}
      subtitle={authMode === 'login' ? 'Access your saved applications and tracked milestones' : 'Join India’s premier smart citizen assistance platform'}
    >
      <form onSubmit={handleSubmit}>
        {authMode === 'register' && (
          <div className="form-group">
            <label className="form-label">Full Legal Name</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            required
            placeholder="e.g. yourname@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {authMode === 'login' && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
              Demo hint: Password is <code>password123</code>
            </div>
          )}
        </div>

        {authMode === 'register' && (
          <div className="form-group">
            <label className="form-label">State / UT</label>
            <select
              className="form-select"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        <div style={{ marginTop: '24px' }}>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%' }}
          >
            {authMode === 'login' ? 'Sign In to CitizenDoc' : 'Create Account'}
          </Button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
          {authMode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('register')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AuthModal;
