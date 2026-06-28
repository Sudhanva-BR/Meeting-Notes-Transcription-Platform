'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit3, Trash2, Calendar, Users } from 'lucide-react';
import { MeetingDetail } from '@/types';
import { Badge } from '../ui/Badge';
import EditMeetingModal from '@/components/meeting/EditMeetingModal';
import { api } from '@/lib/api';
import { useToast } from '../ui/Toast';

interface MeetingHeaderProps {
  meeting: MeetingDetail;
  onRefresh: () => void;
}

// Format ISO date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Top section of the meeting detail view, exposing navigation links and admin controls
export const MeetingHeader = ({ meeting, onRefresh }: MeetingHeaderProps) => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this meeting? This action is permanent.')) {
      setDeleting(true);
      try {
        await api.deleteMeeting(meeting.id);
        showToast('Meeting deleted successfully', 'success');
        router.push('/');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete meeting';
        showToast(msg, 'error');
        setDeleting(false);
      }
    }
  };

  return (
    <div style={{
      borderBottom: '1px solid var(--border-color)',
      padding: '20px 24px',
      backgroundColor: 'var(--bg-secondary)',
    }}>
      {/* Back button & Control links */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--text-secondary)',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 500,
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        {/* Edit / Delete Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsEditOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
          >
            <Edit3 size={14} />
            Edit Info
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: 'var(--danger)',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: deleting ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!deleting) {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              if (!deleting) {
                e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
              }
            }}
          >
            <Trash2 size={14} />
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Main Title & Type tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)' }}>
          {meeting.title}
        </h1>
        <Badge type={meeting.meeting_type} />
      </div>

      {/* Footer details: Date & Participants list */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '24px',
        fontSize: '14px',
        color: 'var(--text-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={16} color="var(--text-muted)" />
          <span>{formatDate(meeting.date)}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={16} color="var(--text-muted)" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span>Participants:</span>
            {meeting.participants.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: 'var(--bg-tertiary)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: p.avatar_color || 'var(--accent-purple)',
                }} />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit modal connection */}
      <EditMeetingModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        meeting={meeting}
        onSuccess={onRefresh}
      />
    </div>
  );
};
