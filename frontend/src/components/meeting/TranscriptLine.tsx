'use client';

import React from 'react';
import { TranscriptSegment, Participant } from '@/types';

interface TranscriptLineProps {
  segment: TranscriptSegment;
  participants: Participant[];
  isActive: boolean;
  searchQuery: string;
  onClickTimestamp: (time: number) => void;
}

// Convert seconds to MM:SS format
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Highlight the matching search terms in the transcript segment content
function highlightText(text: string, search: string): React.ReactNode {
  if (!search) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(search)})`, 'gi'));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === search.toLowerCase() ? (
          <mark key={i} style={{
            backgroundColor: 'rgba(245, 158, 11, 0.4)',
            color: '#FFFFFF',
            padding: '2px 4px',
            borderRadius: '2px',
            borderBottom: '2px solid #F59E0B',
          }}>
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

// Utility to escape regex special characters
function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Renders a single row of transcripts containing user indicators, interactive timelines, and body content
export const TranscriptLine = ({
  segment,
  participants,
  isActive,
  searchQuery,
  onClickTimestamp,
}: TranscriptLineProps) => {
  // Find participant info to match colors
  const participant = participants.find((p) => p.name.toLowerCase() === segment.speaker_name.toLowerCase());
  const avatarColor = participant?.avatar_color || 'var(--accent-purple)';

  return (
    <div
      className={`line-container ${isActive ? 'active-line' : ''}`}
      style={{
        display: 'flex',
        gap: '16px',
        padding: '16px',
        borderRadius: '8px',
        backgroundColor: isActive ? 'var(--bg-hover)' : 'transparent',
        borderLeft: isActive ? '3px solid var(--accent-purple)' : '3px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Avatar Icon */}
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: avatarColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '13px',
        fontWeight: 600,
        color: '#FFFFFF',
        flexShrink: 0,
      }}>
        {segment.speaker_name.charAt(0).toUpperCase()}
      </div>

      {/* Message Info and Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Speaker Name */}
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
            {segment.speaker_name}
          </span>
          {/* Playback seeking timestamp link */}
          <button
            onClick={() => onClickTimestamp(segment.start_time)}
            title="Click to seek player here"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-purple)',
              fontSize: '12px',
              fontFamily: 'monospace',
              cursor: 'pointer',
              fontWeight: 500,
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-tertiary)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.2)'}
            onMouseLeave={(e) => e.currentTarget.style.filter = 'none'}
          >
            {formatTime(segment.start_time)}
          </button>
        </div>

        {/* Content text */}
        <p style={{
          fontSize: '14px',
          color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
        }}>
          {highlightText(segment.content, searchQuery)}
        </p>
      </div>
    </div>
  );
};
export default TranscriptLine;
