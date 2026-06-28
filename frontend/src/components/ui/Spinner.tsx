import React from 'react';

// Spinner loader for loading states
export const Spinner = ({ size = 24 }: { size?: number }) => {
  return (
    <div style={{ display: 'inline-block' }}>
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        border: '3px solid var(--border-color)',
        borderTop: '3px solid var(--accent-purple)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
