import React from 'react';
import {
  FileEdit,
  Send,
  Inbox,
  Clock,
  CheckCircle2,
  XCircle,
  Award
} from 'lucide-react';

const statusConfig = {
  Draft: { class: 'badge-draft', icon: FileEdit, label: 'Draft' },
  Submitted: { class: 'badge-submitted', icon: Send, label: 'Submitted' },
  Received: { class: 'badge-received', icon: Inbox, label: 'Received' },
  'In Review': { class: 'badge-in-review', icon: Clock, label: 'In Review' },
  InReview: { class: 'badge-in-review', icon: Clock, label: 'In Review' },
  Approved: { class: 'badge-approved', icon: CheckCircle2, label: 'Approved' },
  Rejected: { class: 'badge-rejected', icon: XCircle, label: 'Rejected' },
  Completed: { class: 'badge-completed', icon: Award, label: 'Completed' }
};

export const Badge = ({ status, variant, children, showIcon = true, className = '' }) => {
  const config = statusConfig[status] || { class: 'badge-draft', icon: null, label: status || children };
  const badgeClass = variant ? `badge-${variant}` : config.class;
  const Icon = showIcon ? config.icon : null;

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {Icon && <Icon size={12} />}
      {children || config.label}
    </span>
  );
};

export default Badge;
