import React from 'react';

export const LoadingSkeleton = ({ count = 3, type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="docs-grid">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="card" style={{ padding: '24px' }}>
            <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px', marginBottom: '16px' }} />
            <div className="skeleton" style={{ width: '60%', height: '20px', marginBottom: '10px' }} />
            <div className="skeleton" style={{ width: '90%', height: '14px', marginBottom: '8px' }} />
            <div className="skeleton" style={{ width: '75%', height: '14px', marginBottom: '24px' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <div className="skeleton" style={{ flex: 1, height: '36px', borderRadius: '8px' }} />
              <div className="skeleton" style={{ width: '80px', height: '36px', borderRadius: '8px' }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="skeleton" style={{ width: '100%', height: '64px', borderRadius: '12px' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton" style={{ width: '100%', height: '32px', borderRadius: '6px' }} />
      ))}
    </div>
  );
};

export default LoadingSkeleton;
