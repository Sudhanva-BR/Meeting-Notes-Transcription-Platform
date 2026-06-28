import React from 'react';

interface BadgeProps {
  type: string;
}

// Badge indicating meeting category (e.g., retrospective, planning, client, design)
export const Badge = ({ type }: BadgeProps) => {
  const getBadgeStyle = () => {
    switch (type.toLowerCase()) {
      case 'planning':
        return { backgroundColor: 'rgba(124, 58, 237, 0.15)', color: '#A78BFA' }; // Purple
      case 'retrospective':
        return { backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }; // Blue
      case 'client':
        return { backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }; // Green
      case 'design':
        return { backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#F87171' };  // Red
      case 'standup':
        return { backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#FBBF24' }; // Amber
      default:
        return { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
    }
  };

  const style = getBadgeStyle();

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '11px',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      ...style,
    }}>
      {type}
    </span>
  );
};
