'use client';

import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';

interface NavbarProps {
  title?: string;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

// Global top navigation navbar
export const Navbar = ({ title = 'Notebook', searchQuery, setSearchQuery }: NavbarProps) => {
  return (
    <header style={{
      height: 'var(--navbar-height)',
      backgroundColor: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      position: 'sticky',
      top: 0,
      zIndex: 40,
    }}>
      {/* Title */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>{title}</h2>
      </div>

      {/* Middle Search & Utility Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {setSearchQuery !== undefined && (
          <div style={{ position: 'relative', width: '320px' }}>
            <span style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search meetings or transcripts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '8px 12px 8px 36px',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Bell size={18} />
          </button>
          
          <button style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};
