'use client';

import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { TranscriptSegment, Participant } from '@/types';
import { TranscriptLine } from './TranscriptLine';

interface TranscriptPanelProps {
  segments: TranscriptSegment[];
  participants: Participant[];
  currentTime: number;
  onClickTimestamp: (time: number) => void;
}

// Sidebar/Main column container holding transcript logs with instant local text querying
export const TranscriptPanel = ({
  segments,
  participants,
  currentTime,
  onClickTimestamp,
}: TranscriptPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Find which segment is currently active based on current media time
  const activeSegmentId = useMemo(() => {
    const active = segments.find(
      (s) => currentTime >= s.start_time && currentTime <= s.end_time
    );
    return active ? active.id : null;
  }, [segments, currentTime]);

  // Filter segments based on local search query
  const filteredSegments = useMemo(() => {
    if (!searchQuery.trim()) return segments;
    return segments.filter(
      (s) =>
        s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.speaker_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [segments, searchQuery]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      {/* Top Search bar */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        position: 'relative',
      }}>
        <span style={{
          position: 'absolute',
          left: '32px',
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
          placeholder="Search transcript..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '10px 12px 10px 36px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--accent-purple)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
        />
      </div>

      {/* Feed list */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}>
        {filteredSegments.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '14px',
          }}>
            No matches found for &quot;{searchQuery}&quot;
          </div>
        ) : (
          filteredSegments.map((segment) => (
            <TranscriptLine
              key={segment.id}
              segment={segment}
              participants={participants}
              isActive={segment.id === activeSegmentId}
              searchQuery={searchQuery}
              onClickTimestamp={onClickTimestamp}
            />
          ))
        )}
      </div>
    </div>
  );
};
export default TranscriptPanel;
