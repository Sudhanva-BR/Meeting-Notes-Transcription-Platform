'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, CheckSquare, Users, Trash2 } from 'lucide-react';
import { MeetingListEntry } from '@/types';
import { Badge } from '../ui/Badge';

interface MeetingCardProps {
  meeting: MeetingListEntry;
  onDelete: (id: number, e: React.MouseEvent) => void;
}

// Formats seconds into MM:SS or HH:MM:SS
function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

// Formats ISO string into nice readable local date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Single card in the dashboard grid representing a meeting session
export const MeetingCard = ({ meeting, onDelete }: MeetingCardProps) => {
  return (
    <div className="card-container" style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '16px',
      position: 'relative',
      height: '100%',
      cursor: 'pointer',
    }}>
      {/* Click overlay link for the whole card */}
      <Link href={`/meeting/${meeting.id}`} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '12px',
        zIndex: 1,
      }} />

      {/* Header Info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
          <Badge type={meeting.meeting_type} />
          
          {/* Delete Button (Z-Index is higher to capture click) */}
          <button
            onClick={(e) => onDelete(meeting.id, e)}
            className="delete-btn"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 10,
              position: 'relative',
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>

        <h3 className="card-title" style={{
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: '1.4',
        }}>
          {meeting.title}
        </h3>
      </div>

      {/* Meta Indicators */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '13px',
        color: 'var(--text-secondary)',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Calendar size={14} className="icon-muted" />
          <span>{formatDate(meeting.date)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} className="icon-muted" />
          <span>{formatDuration(meeting.duration_seconds)}</span>
        </div>
        {meeting.action_items_count > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckSquare size={14} className="icon-muted" />
            <span>
              {meeting.completed_items_count}/{meeting.action_items_count} Action Items
            </span>
          </div>
        )}
      </div>

      {/* Participant avatars footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users size={14} color="var(--text-muted)" style={{ marginRight: '4px' }} />
          <div style={{ display: 'flex', marginLeft: '4px' }}>
            {meeting.participants.slice(0, 4).map((p, index) => (
              <div
                key={p.id}
                title={p.name}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: p.avatar_color || 'var(--accent-purple)',
                  border: '2px solid var(--bg-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  marginLeft: index > 0 ? '-6px' : 0,
                  position: 'relative',
                  zIndex: 4 - index,
                }}
              >
                {p.name.charAt(0)}
              </div>
            ))}
            {meeting.participants.length > 4 && (
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                border: '2px solid var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginLeft: '-6px',
                position: 'relative',
                zIndex: 0,
              }}>
                +{meeting.participants.length - 4}
              </div>
            )}
          </div>
        </div>

        <span className="view-link" style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--accent-purple)',
        }}>
          Open Notes →
        </span>
      </div>

      {/* Card animation styles */}
      <style jsx>{`
        .card-container {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-container:hover {
          transform: translateY(-4px);
          border-color: var(--accent-purple);
          box-shadow: 0 10px 20px -10px rgba(124, 58, 237, 0.3);
        }
        .card-container:hover .card-title {
          color: #FFFFFF;
        }
        .card-container:hover .view-link {
          color: var(--accent-purple-hover);
        }
        .delete-btn {
          opacity: 0.6;
        }
        .delete-btn:hover {
          opacity: 1;
          color: var(--danger) !important;
          background-color: var(--danger-light) !important;
        }
        .icon-muted {
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
