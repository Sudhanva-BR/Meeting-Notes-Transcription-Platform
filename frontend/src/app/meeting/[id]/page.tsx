/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { MeetingHeader } from '@/components/meeting/MeetingHeader';
import { MediaPlayer } from '@/components/meeting/MediaPlayer';
import { TranscriptPanel } from '@/components/meeting/TranscriptPanel';
import { SummaryPanel } from '@/components/meeting/SummaryPanel';
import { api } from '@/lib/api';
import { MeetingDetail } from '@/types';
import { Spinner } from '@/components/ui/Spinner';
import { useToast } from '@/components/ui/Toast';

// Split-pane layout rendering Transcript views on left side and AI Summaries/Actions on right side
export default function MeetingDetailPage() {
  const params = useParams();
  const { showToast } = useToast();
  const meetingId = Number(params.id);

  const [meeting, setMeeting] = useState<MeetingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Global Media Player Audio States
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load meeting details
  const loadMeeting = React.useCallback(async () => {
    try {
      const data = await api.getMeetingDetail(meetingId);
      setMeeting(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load meeting details';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [meetingId, showToast]);

  useEffect(() => {
    if (meetingId) {
      loadMeeting();
    }
  }, [meetingId, loadMeeting]);

  // Click segment timestamp callback to seek player
  const handleSeekToTime = (time: number) => {
    setCurrentTime(time);
    setIsPlaying(true); // Automatically play when clicked
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar title="Loading Meeting..." />
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Spinner size={36} />
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar title="Meeting Not Found" />
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>We couldn&apos;t find the requested meeting.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Top Navbar */}
      <Navbar title={meeting.title} />

      {/* Header Meta information */}
      <MeetingHeader meeting={meeting} onRefresh={loadMeeting} />

      {/* Main Split Body */}
      <div style={{
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        padding: '24px',
        gap: '24px',
      }}>
        
        {/* Left Side: Transcript Logs and Playback Control */}
        <div style={{
          flex: '1.4',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          height: '100%',
        }}>
          {/* Transcript Scroll panel */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <TranscriptPanel
              segments={meeting.transcript_segments}
              participants={meeting.participants}
              currentTime={currentTime}
              onClickTimestamp={handleSeekToTime}
            />
          </div>

          {/* Media Player seek-bar footer */}
          <MediaPlayer
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            duration={meeting.duration_seconds}
          />
        </div>

        {/* Right Side: AI summary text and action checklist */}
        <div style={{
          flex: '1',
          height: '100%',
          overflow: 'hidden',
        }}>
          <SummaryPanel
            meetingId={meeting.id}
            summary={meeting.summary}
            actionItems={meeting.action_items}
          />
        </div>
      </div>
    </div>
  );
}
