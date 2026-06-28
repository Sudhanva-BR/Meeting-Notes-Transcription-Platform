'use client';

import React, { useState } from 'react';
import { Sparkles, CheckSquare, List } from 'lucide-react';
import { MeetingSummary, ActionItem } from '@/types';
import { ActionItems } from './ActionItems';

interface SummaryPanelProps {
  meetingId: number;
  summary: MeetingSummary;
  actionItems: ActionItem[];
}

// Custom simple parser to render Markdown outline strings into clean HTML tags
const MarkdownRenderer = ({ content }: { content: string }) => {
  if (!content) return <p style={{ color: 'var(--text-muted)' }}>No outline details available.</p>;

  const lines = content.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', lineHeight: '1.6' }}>
      {lines.map((line, index) => {
        const trimmed = line.trim();
        
        // H2 headers: ## Header
        if (trimmed.startsWith('## ')) {
          return (
            <h4
              key={index}
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginTop: '16px',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '4px',
              }}
            >
              {trimmed.substring(3)}
            </h4>
          );
        }
        
        // List items: - text
        if (trimmed.startsWith('- ')) {
          return (
            <li
              key={index}
              style={{
                fontSize: '13px',
                color: 'var(--text-secondary)',
                marginLeft: '16px',
                listStyleType: 'disc',
              }}
            >
              {trimmed.substring(2)}
            </li>
          );
        }

        // Standard text line
        if (trimmed) {
          return (
            <p key={index} style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {trimmed}
            </p>
          );
        }

        return <div key={index} style={{ height: '4px' }} />;
      })}
    </div>
  );
};

// Side panel managing meeting summaries, key tags, outlines, and checklist tabs
export const SummaryPanel = ({ meetingId, summary, actionItems }: SummaryPanelProps) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'actions'>('summary');

  // Parse topics list from JSON string
  const topics: string[] = React.useMemo(() => {
    try {
      return JSON.parse(summary?.key_topics || '[]');
    } catch {
      return [];
    }
  }, [summary]);

  return (
    <div style={{
      backgroundColor: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: '12px',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Tab Select Header */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
      }}>
        <button
          onClick={() => setActiveTab('summary')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'summary' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            backgroundColor: activeTab === 'summary' ? 'var(--bg-tertiary)' : 'transparent',
            color: activeTab === 'summary' ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          <Sparkles size={14} color={activeTab === 'summary' ? 'var(--accent-purple)' : 'inherit'} />
          AI Summary & Notes
        </button>
        <button
          onClick={() => setActiveTab('actions')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '14px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            borderBottom: activeTab === 'actions' ? '2px solid var(--accent-purple)' : '2px solid transparent',
            backgroundColor: activeTab === 'actions' ? 'var(--bg-tertiary)' : 'transparent',
            color: activeTab === 'actions' ? 'var(--text-primary)' : 'var(--text-secondary)',
          }}
        >
          <CheckSquare size={14} color={activeTab === 'actions' ? 'var(--accent-purple)' : 'inherit'} />
          Action Items
        </button>
      </div>

      {/* Scrollable Tab Content Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
      }}>
        {activeTab === 'summary' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Overview Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Overview
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                {summary?.overview || 'No AI summary generated for this transcript yet.'}
              </p>
            </div>

            {/* Key Topics Section */}
            {topics.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Key Topics
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {topics.map((topic, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '11px',
                        fontWeight: 500,
                        backgroundColor: 'var(--bg-tertiary)',
                        color: 'var(--text-primary)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Outline / Chapters Section */}
            {summary?.outline && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <List size={14} />
                  Meeting Outline
                </h3>
                <MarkdownRenderer content={summary.outline} />
              </div>
            )}
          </div>
        ) : (
          /* Action Items Checklist View */
          <ActionItems meetingId={meetingId} initialItems={actionItems} />
        )}
      </div>
    </div>
  );
};
export default SummaryPanel;
