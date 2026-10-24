import React from 'react';
import { RiskLevel } from '@/lib/types';
import { ShieldCheck, ShieldAlert, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showScore = false,
  size = 'md',
}) => {
  const config = {
    safe: {
      label: 'Safe / Legitimate',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      badgeBg: 'bg-emerald-500',
      icon: ShieldCheck,
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-blue-50 text-blue-800 border-blue-200',
      badgeBg: 'bg-blue-500',
      icon: CheckCircle2,
    },
    medium: {
      label: 'Medium Risk',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      badgeBg: 'bg-amber-500',
      icon: AlertTriangle,
    },
    high: {
      label: 'High Risk',
      bg: 'bg-orange-50 text-orange-800 border-orange-200',
      badgeBg: 'bg-orange-500',
      icon: ShieldAlert,
    },
    critical: {
      label: 'Critical Phishing',
      bg: 'bg-red-50 text-red-800 border-red-200',
      badgeBg: 'bg-red-600',
      icon: AlertOctagon,
    },
  }[level] || {
    label: 'Unknown',
    bg: 'bg-slate-50 text-slate-800 border-slate-200',
    badgeBg: 'bg-slate-500',
    icon: AlertTriangle,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  const iconSizes = {
    sm: 13,
    md: 16,
    lg: 19,
  }[size];

  return (
    <span
      className={`inline-flex items-center font-medium border rounded-full ${config.bg} ${sizeClasses}`}
    >
      <Icon size={iconSizes} className="shrink-0" />
      <span>{config.label}</span>
      {showScore && typeof score === 'number' && (
        <span className="ml-1 pl-1.5 border-l border-current/25 font-mono text-xs opacity-90">
          {score}/100
        </span>
      )}
    </span>
  );
};
