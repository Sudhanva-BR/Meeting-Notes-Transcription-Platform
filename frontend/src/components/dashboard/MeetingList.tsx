'use client';

import React from 'react';
import { MeetingListEntry } from '@/types';
import { MeetingCard } from './MeetingCard';

interface MeetingListProps {
  meetings: MeetingListEntry[];
  onDelete: (id: number, e: React.MouseEvent) => void;
}

// Renders the responsive grid containing all parsed meeting items
export const MeetingList = ({ meetings, onDelete }: MeetingListProps) => {
  if (meetings.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
        border: '1.5px dashed var(--border-color)',
        borderRadius: '16px',
        backgroundColor: 'var(--bg-secondary)',
        textAlign: 'center',
        gap: '12px',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
          No meetings found
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '360px', lineHeight: '1.5' }}>
          We couldn&apos;t find any meetings matching your criteria. Try adjusting your query or upload a new meeting transcript.
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      width: '100%',
    }}>
      {meetings.map((meeting) => (
        <MeetingCard
          key={meeting.id}
          meeting={meeting}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
