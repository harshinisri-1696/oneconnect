import React from 'react';
import { Loader2 } from 'lucide-react';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger', 'ghost'
  size = 'md', // 'sm', 'md', 'lg', 'icon'
  loading = false,
  disabled = false,
  icon = null,
  iconRight = null,
  className = '',
  onClick,
  type = 'button',
  style = {},
  ...props
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary': return 'btn-primary';
      case 'secondary': return 'btn-secondary';
      case 'outline': return 'btn-outline';
      case 'danger': return 'btn-danger';
      case 'ghost': return 'btn-ghost';
      default: return 'btn-primary';
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'btn-sm';
      case 'lg': return 'btn-lg';
      case 'icon': return 'btn-icon-only';
      default: return '';
    }
  };

  return (
    <button
      type={type}
      className={`btn ${getVariantClass()} ${getSizeClass()} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      style={style}
      {...props}
    >
      {loading ? (
        <Loader2 className="btn-spinner animate-spin" size={size === 'sm' ? 14 : 18} />
      ) : (
        icon && <span className="btn-icon-left">{icon}</span>
      )}
      {children}
      {!loading && iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </button>
  );
};

export default Button;
