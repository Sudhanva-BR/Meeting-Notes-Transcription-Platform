'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Settings, User, Shield, Sliders } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    { icon: <User size={18} />, title: 'Account Profile', desc: 'Manage your contact details, email addresses, and avatar configurations.' },
    { icon: <Sliders size={18} />, title: 'Meeting Preferences', desc: 'Configure default speaker naming rules, languages, and summary layouts.' },
    { icon: <Shield size={18} />, title: 'Security & SSO', desc: 'Manage API keys, login security policies, and team permissions.' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Navbar title="Settings" />
      <div style={{ padding: '32px', flex: 1, maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Settings size={24} color="var(--accent-purple)" />
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Settings</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {sections.map((sec, idx) => (
            <div key={idx} style={{
              padding: '20px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px',
            }}>
              <div style={{
                color: 'var(--accent-purple)',
                backgroundColor: 'var(--accent-purple-light)',
                padding: '10px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {sec.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>{sec.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{sec.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
