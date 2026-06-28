'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Library, Activity, Settings, Radio, Layers, Sparkles } from 'lucide-react';

// Main Navigation Sidebar matching Fireflies styling
export const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { icon: <Library size={20} />, label: 'Notebook', href: '/' },
    { icon: <Radio size={20} />, label: 'My Feed', href: '/feed' },
    { icon: <Layers size={20} />, label: 'Integrations', href: '/integrations' },
    { icon: <Activity size={20} />, label: 'Analytics', href: '/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  return (
    <div style={{
      width: 'var(--sidebar-width)',
      height: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 50,
    }}>
      {/* Brand logo container */}
      <div style={{
        height: 'var(--navbar-height)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 20px',
        borderBottom: '1px solid var(--border-color)',
      }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          backgroundColor: 'var(--accent-purple)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 12px var(--accent-purple)',
        }}>
          <Sparkles size={16} color="#FFFFFF" />
        </div>
        <span style={{
          fontSize: '18px',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(90deg, #FFFFFF 0%, #A78BFA 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          fireflies.ai
        </span>
      </div>

      {/* Nav Menu */}
      <nav style={{
        flex: 1,
        padding: '24px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/' && pathname.startsWith('/meeting'));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 16px',
                borderRadius: '8px',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-purple-light)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-purple)' : '3px solid transparent',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive ? 600 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ color: isActive ? 'var(--accent-purple)' : 'inherit' }}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Default User workspace badge at bottom */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#F59E0B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 600,
          color: '#FFFFFF',
        }}>
          S
        </div>
        <div style={{ overflow: 'hidden' }}>
          <p style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Sudha&apos;s Workspace
          </p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            sudha@company.com
          </p>
        </div>
      </div>
    </div>
  );
};
