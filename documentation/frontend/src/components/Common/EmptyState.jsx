import React from 'react';
import { FileQuestion, FolderSearch, Search, AlertCircle } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: CustomIcon,
  title = "No results found",
  description = "Try adjusting your search filters or browse other categories.",
  actionText,
  onAction,
  actionVariant = "primary"
}) => {
  const Icon = CustomIcon || FolderSearch;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '56px 24px',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        border: '1.5px dashed var(--border-color)',
        margin: '20px 0'
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--light-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--primary)',
          marginBottom: '16px'
        }}
      >
        <Icon size={32} />
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '8px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '440px', marginBottom: actionText ? '24px' : '0' }}>
        {description}
      </p>
      {actionText && onAction && (
        <Button variant={actionVariant} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
