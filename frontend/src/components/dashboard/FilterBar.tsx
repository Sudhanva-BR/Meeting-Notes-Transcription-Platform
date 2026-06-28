'use client';

import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface FilterBarProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
}

// Sidebar/Toolbar controls to sort and filter meetings list
export const FilterBar = ({
  selectedType,
  setSelectedType,
  selectedSort,
  setSelectedSort,
}: FilterBarProps) => {
  const meetingTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'planning', label: 'Planning' },
    { value: 'retrospective', label: 'Retrospectives' },
    { value: 'client', label: 'Client Work' },
    { value: 'design', label: 'Design Reviews' },
    { value: 'standup', label: 'Standups' },
  ];

  const sortOptions = [
    { value: '-date', label: 'Newest First' },
    { value: 'date', label: 'Oldest First' },
    { value: 'title', label: 'Alphabetical (A-Z)' },
    { value: '-title', label: 'Alphabetical (Z-A)' },
    { value: '-duration_seconds', label: 'Longest Duration' },
    { value: 'duration_seconds', label: 'Shortest Duration' },
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      padding: '16px 0',
      borderBottom: '1px solid var(--border-color)',
      marginBottom: '24px',
    }}>
      {/* Category Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {meetingTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              border: '1px solid var(--border-color)',
              backgroundColor: selectedType === type.value ? 'var(--accent-purple)' : 'var(--bg-secondary)',
              color: selectedType === type.value ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              if (selectedType !== type.value) {
                e.currentTarget.style.borderColor = 'var(--text-muted)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (selectedType !== type.value) {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-secondary)';
              }
            }}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Sorting Select and filter icon */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <SlidersHorizontal size={14} color="var(--text-muted)" />
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sort by:</span>
        <select
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
          style={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '6px 24px 6px 10px',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default FilterBar;
