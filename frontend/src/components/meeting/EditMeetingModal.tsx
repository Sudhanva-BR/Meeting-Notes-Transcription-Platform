/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { api } from '@/lib/api';
import { MeetingDetail } from '@/types';

interface EditMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingDetail;
  onSuccess: () => void;
}

// Modal dialog containing options to modify meeting details
export const EditMeetingModal = ({ isOpen, onClose, meeting, onSuccess }: EditMeetingModalProps) => {
  const { showToast } = useToast();
  const [title, setTitle] = useState(meeting.title);
  const [meetingType, setMeetingType] = useState(meeting.meeting_type);
  const [participantsText, setParticipantsText] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync state with meeting prop updates
  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title);
      setMeetingType(meeting.meeting_type);
      const names = meeting.participants.map((p) => p.name).join(', ');
      setParticipantsText(names);
    }
  }, [meeting, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      showToast('Title is required', 'warning');
      return;
    }

    setLoading(true);
    try {
      const participants = participantsText
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((name) => ({ name }));

      await api.updateMeeting(meeting.id, {
        title,
        meeting_type: meetingType,
        participants,
      });

      showToast('Meeting updated successfully', 'success');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update meeting';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Meeting Details">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Meeting Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Category Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Category
          </label>
          <select
            value={meetingType}
            onChange={(e) => setMeetingType(e.target.value)}
            style={inputStyle}
          >
            <option value="planning">Planning</option>
            <option value="retrospective">Retrospective</option>
            <option value="client">Client Work</option>
            <option value="design">Design Review</option>
            <option value="standup">Standup</option>
          </select>
        </div>

        {/* Participants input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Participants (comma separated)
          </label>
          <input
            type="text"
            value={participantsText}
            onChange={(e) => setParticipantsText(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Action Controls */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          paddingTop: '8px',
          borderTop: '1px solid var(--border-color)',
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--accent-purple)',
              color: '#FFFFFF',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

const inputStyle = {
  backgroundColor: 'var(--bg-primary)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '10px 12px',
  color: 'var(--text-primary)',
  fontSize: '14px',
  outline: 'none',
  width: '100%',
};
export default EditMeetingModal;
