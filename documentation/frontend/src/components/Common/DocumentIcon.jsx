import React from 'react';
import {
  Fingerprint,
  CreditCard,
  Vote,
  Plane,
  Car,
  Baby,
  TrendingUp,
  Shield,
  Home,
  ShoppingBag,
  HeartHandshake,
  FileText,
  FileCheck,
  Award,
  Globe
} from 'lucide-react';

const iconMap = {
  Fingerprint: Fingerprint,
  CreditCard: CreditCard,
  Vote: Vote,
  Plane: Plane,
  Car: Car,
  Baby: Baby,
  TrendingUp: TrendingUp,
  Shield: Shield,
  Home: Home,
  ShoppingBag: ShoppingBag,
  HeartHandshake: HeartHandshake,
  FileText: FileText,
  FileCheck: FileCheck,
  Award: Award,
  Globe: Globe
};

export const DocumentIcon = ({ iconName, size = 24, color = 'currentColor', className = '' }) => {
  const IconComponent = iconMap[iconName] || FileText;
  return <IconComponent size={size} color={color} className={className} />;
};

export default DocumentIcon;
