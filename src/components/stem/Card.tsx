import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  accent?: 'teal' | 'coral' | 'amber' | 'violet' | 'none';
}

const accentBorder: Record<NonNullable<CardProps['accent']>, string> = {
  teal: 'border-stem-teal/30',
  coral: 'border-stem-coral/30',
  amber: 'border-stem-amber/40',
  violet: 'border-stem-violet/30',
  none: 'border-stem-line'
};

export const Card: React.FC<CardProps> = ({ children, className = '', accent = 'none' }) => (
  <div
    className={`bg-stem-cloud border-2 ${accentBorder[accent]} rounded-3xl shadow-[0_4px_0_0_rgba(27,36,48,0.06)] p-6 ${className}`}
  >
    {children}
  </div>
);
