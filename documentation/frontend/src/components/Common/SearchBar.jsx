import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({
  value,
  onChange,
  placeholder = "Search government documents…",
  onClear,
  className = "",
  autoFocus = false
}) => {
  return (
    <div className={`search-bar-wrapper ${className}`} style={{ position: 'relative', width: '100%' }}>
      <Search size={18} className="search-bar-icon" />
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
        style={{ paddingRight: value ? '44px' : '16px' }}
      />
      {value && (
        <button
          type="button"
          onClick={() => { if (onClear) onClear(); else onChange(''); }}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            padding: '4px',
            borderRadius: '4px'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
