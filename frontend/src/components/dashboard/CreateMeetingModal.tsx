'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useToast } from '../ui/Toast';
import { api } from '@/lib/api';

interface CreateMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Dialog form modal to add/upload a new meeting transcript
export const CreateMeetingModal = ({ isOpen, onClose, onSuccess }: CreateMeetingModalProps) => {
  const { showToast } = useToast();
  
  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [durationMin, setDurationMin] = useState(15);
  const [meetingType, setMeetingType] = useState('planning');
  const [participantsText, setParticipantsText] = useState('');
  const [transcriptText, setTranscriptText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !transcriptText) {
      showToast('Please fill out all required fields.', 'warning');
      return;
    }

    setLoading(true);
    try {
      // Parse participants from comma-separated names
      const participants = participantsText
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean)
        .map((name) => ({ name }));

      // Fallback if empty
      if (participants.length === 0) {
        participants.push({ name: 'Default Presenter' });
      }

      await api.createMeeting({
        title,
        date: new Date(date).toISOString(),
        duration_seconds: durationMin * 60,
        meeting_type: meetingType,
        participants,
        transcript_text: transcriptText,
      });

      showToast('Meeting created successfully!', 'success');
      onSuccess();
      onClose();
      
      // Clear inputs
      setTitle('');
      setDate('');
      setDurationMin(15);
      setMeetingType('planning');
      setParticipantsText('');
      setTranscriptText('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create meeting';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload New Meeting">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Meeting Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Q3 Roadmap Brainstorm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
          />
        </div>

        {/* Date, Duration & Category Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Meeting Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Duration (minutes) *
            </label>
            <input
              type="number"
              required
              min={1}
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Category & Participants */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Category *
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Participants (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah Chen, Michael Park"
              value={participantsText}
              onChange={(e) => setParticipantsText(e.target.value)}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Paste Transcript Text area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Paste Transcript *
            </label>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Format: Speaker Name [MM:SS]: content
            </span>
          </div>
          <textarea
            required
            rows={8}
            placeholder={`Sarah Chen [00:00]: Welcome everyone to the meeting.\nMichael Park [00:15]: Thanks for having me. Let's look at the database schema.`}
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace' }}
          />
        </div>

        {/* Footer Actions */}
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
            {loading ? 'Processing...' : 'Upload & Process'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// Reusable styling for inputs
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
