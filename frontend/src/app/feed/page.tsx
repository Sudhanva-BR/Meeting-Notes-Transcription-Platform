'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Radio } from 'lucide-react';

export default function FeedPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Navbar title="My Feed" />
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
          <Radio size={32} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 600 }}>My Feed</h2>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: '1.6' }}>
          This area displays real-time updates and notifications from collaborative meetings. Connect your calendar to sync streams.
        </p>
      </div>
    </div>
  );
}
