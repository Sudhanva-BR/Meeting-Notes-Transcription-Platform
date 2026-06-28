'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Layers } from 'lucide-react';

export default function IntegrationsPage() {
  const tools = [
    { name: 'Zoom', category: 'Video Conferencing', status: 'Coming Soon' },
    { name: 'Google Meet', category: 'Video Conferencing', status: 'Coming Soon' },
    { name: 'Slack', category: 'Collaboration', status: 'Coming Soon' },
    { name: 'Notion', category: 'Notes & Wiki', status: 'Coming Soon' },
    { name: 'Salesforce', category: 'CRM', status: 'Coming Soon' },
    { name: 'HubSpot', category: 'CRM', status: 'Coming Soon' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <Navbar title="Integrations" />
      <div style={{ padding: '32px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Layers size={24} color="var(--accent-purple)" />
          <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Integrations</h2>
        </div>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', maxWidth: '600px', lineHeight: '1.6' }}>
          Connect Fireflies to your favorite tools. Send meeting summaries, transcripts, and action items directly to CRMs, collaborative documents, and group channels automatically.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '20px',
        }}>
          {tools.map((t, idx) => (
            <div key={idx} style={{
              padding: '20px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '12px',
            }}>
              <div>
                <h4 style={{ fontSize: '15px', color: 'var(--text-primary)', marginBottom: '4px' }}>{t.name}</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{t.category}</p>
              </div>
              <span style={{
                alignSelf: 'flex-start',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-muted)',
                backgroundColor: 'var(--bg-tertiary)',
                padding: '4px 8px',
                borderRadius: '4px',
              }}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
