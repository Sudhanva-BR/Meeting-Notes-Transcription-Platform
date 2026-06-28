'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { FilterBar } from '@/components/dashboard/FilterBar';
import { MeetingList } from '@/components/dashboard/MeetingList';
import { CreateMeetingModal } from '@/components/dashboard/CreateMeetingModal';
import { api } from '@/lib/api';
import { MeetingListEntry } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { Spinner } from '@/components/ui/Spinner';

export default function Dashboard() {
  const { showToast } = useToast();

  // Dashboard filtering & list states
  const [meetings, setMeetings] = useState<MeetingListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSort, setSelectedSort] = useState('-date');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Fetch meetings with filters
  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getMeetings({
        search: searchQuery,
        sort: selectedSort,
      });

      // Filter by type client-side
      const filtered = selectedType === 'all'
        ? data
        : data.filter((m) => m.meeting_type.toLowerCase() === selectedType.toLowerCase());

      setMeetings(filtered);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch meetings';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedType, selectedSort, showToast]);

  // Refetch when filters or search inputs change
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMeetings();
    }, 300); // 300ms debounce to prevent spamming backend

    return () => clearTimeout(delayDebounceFn);
  }, [fetchMeetings]);

  // Handle meeting deletion
  const handleDeleteMeeting = async (id: number, e: React.MouseEvent) => {
    e.preventDefault(); // Stop click from bubbling up
    e.stopPropagation();

    if (confirm('Are you sure you want to delete this meeting? This action is permanent.')) {
      try {
        await api.deleteMeeting(id);
        showToast('Meeting deleted successfully', 'success');
        fetchMeetings(); // Refresh list
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to delete meeting';
        showToast(msg, 'error');
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Top Navbar */}
      <Navbar
        title="Notebook"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Container */}
      <div style={{ padding: '24px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Welcome Section / Header banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              My Meetings
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              Browse transcripts, notes, summaries and action items.
            </p>
          </div>
          
          {/* Action Trigger */}
          <button
            onClick={() => setIsCreateOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--accent-purple)',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-purple-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--accent-purple)'}
          >
            <Plus size={16} />
            Upload Meeting
          </button>
        </div>

        {/* Filters Panel */}
        <FilterBar
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
        />

        {/* Dynamic List section */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
              <Spinner size={32} />
            </div>
          ) : (
            <MeetingList meetings={meetings} onDelete={handleDeleteMeeting} />
          )}
        </div>
      </div>

      {/* Upload Dialogue modal */}
      <CreateMeetingModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchMeetings}
      />
    </div>
  );
}
