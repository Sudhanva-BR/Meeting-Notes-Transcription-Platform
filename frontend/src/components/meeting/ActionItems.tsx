'use client';

import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare, Square, User } from 'lucide-react';
import { ActionItem } from '@/types';
import { api } from '@/lib/api';
import { useToast } from '../ui/Toast';

interface ActionItemsProps {
  meetingId: number;
  initialItems: ActionItem[];
}

// Interactive check-list tool for monitoring, toggling, and appending tasks to a meeting
export const ActionItems = ({ meetingId, initialItems }: ActionItemsProps) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<ActionItem[]>(initialItems);
  
  // Adding items states
  const [newTitle, setNewTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [adding, setAdding] = useState(false);

  // Toggle checklist status
  const handleToggle = async (item: ActionItem) => {
    try {
      const updated = await api.updateActionItem(item.id, {
        is_completed: !item.is_completed,
      });
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
      showToast(
        updated.is_completed ? 'Task completed!' : 'Task marked as incomplete',
        'success'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update task';
      showToast(msg, 'error');
    }
  };

  // Add a new task
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setAdding(true);
    try {
      const added = await api.addActionItem({
        meeting: meetingId,
        title: newTitle,
        assignee: assignee || 'Unassigned',
      });
      setItems((prev) => [...prev, added]);
      setNewTitle('');
      setAssignee('');
      showToast('Action item added', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add task';
      showToast(msg, 'error');
    } finally {
      setAdding(false);
    }
  };

  // Delete a task
  const handleDelete = async (id: number) => {
    try {
      await api.deleteActionItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast('Action item removed', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete task';
      showToast(msg, 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Add New Item Form */}
      <form onSubmit={handleAdd} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '16px',
        backgroundColor: 'var(--bg-primary)',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
      }}>
        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Create Action Item
        </h4>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <input
            type="text"
            required
            placeholder="What needs to be done?"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <input
            type="text"
            placeholder="Assignee (name)"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            style={{
              width: '120px',
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '6px 10px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={adding}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--accent-purple)',
              color: '#FFFFFF',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: adding ? 'not-allowed' : 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <Plus size={16} />
          </button>
        </div>
      </form>

      {/* List items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {items.length === 0 ? (
          <div style={{
            padding: '24px',
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '13px',
            border: '1px dashed var(--border-color)',
            borderRadius: '8px',
          }}>
            No action items identified for this meeting.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                gap: '12px',
                transition: 'opacity 0.2s',
                opacity: item.is_completed ? 0.6 : 1,
              }}
            >
              {/* Checkbox and Text */}
              <div style={{ display: 'flex', gap: '10px', flex: 1, alignItems: 'flex-start' }}>
                <button
                  onClick={() => handleToggle(item)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: item.is_completed ? 'var(--success)' : 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '2px',
                  }}
                >
                  {item.is_completed ? <CheckSquare size={18} /> : <Square size={18} />}
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{
                    fontSize: '13.5px',
                    color: 'var(--text-primary)',
                    textDecoration: item.is_completed ? 'line-through' : 'none',
                    lineHeight: '1.4',
                  }}>
                    {item.title}
                  </span>
                  
                  {/* Assignee pill */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '11px' }}>
                    <User size={10} />
                    <span>{item.assignee}</span>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--danger)';
                  e.currentTarget.style.backgroundColor = 'var(--danger-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default ActionItems;
