'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Navbar title="Analytics" />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        gap: '16px',
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-purple-light)',
          color: 'var(--accent-purple)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(124, 58, 237, 0.2)',
        }}>
          <BarChart3 size={32} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Analytics & Insights</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '440px', lineHeight: '1.6' }}>
          Analyze speaker talk time, sentiments, topics tracked, and meeting trends across your organization over time. Coming soon.
        </p>
      </div>
    </div>
  );
}
