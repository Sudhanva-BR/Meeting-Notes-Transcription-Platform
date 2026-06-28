import { MeetingListEntry, MeetingDetail, ActionItem } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Helper for fetch requests
async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Something went wrong');
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Fetch meetings with optional search, sorting, and filter queries
  async getMeetings(params?: { search?: string; sort?: string; date_from?: string; date_to?: string }): Promise<MeetingListEntry[]> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.sort) query.append('sort', params.sort);
    if (params?.date_from) query.append('date_from', params.date_from);
    if (params?.date_to) query.append('date_to', params.date_to);

    const res = await fetch(`${API_BASE_URL}/meetings/?${query.toString()}`, { cache: 'no-store' });
    return handleResponse(res);
  },

  // Get single meeting detail
  async getMeetingDetail(id: number): Promise<MeetingDetail> {
    const res = await fetch(`${API_BASE_URL}/meetings/${id}/`, { cache: 'no-store' });
    return handleResponse(res);
  },

  // Create a new meeting (requires title, date, duration, participants list, and transcript text)
  async createMeeting(data: {
    title: string;
    date: string;
    duration_seconds: number;
    meeting_type: string;
    participants: { name: string; email?: string }[];
    transcript_text: string;
  }): Promise<MeetingDetail> {
    const res = await fetch(`${API_BASE_URL}/meetings/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Update meeting info (title, participants, type)
  async updateMeeting(id: number, data: {
    title?: string;
    meeting_type?: string;
    participants?: { name: string; email?: string }[];
  }): Promise<MeetingDetail> {
    const res = await fetch(`${API_BASE_URL}/meetings/${id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Delete a meeting
  async deleteMeeting(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/meetings/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Add a new action item to a meeting
  async addActionItem(data: {
    meeting: number;
    title: string;
    assignee: string;
    due_date?: string | null;
  }): Promise<ActionItem> {
    const res = await fetch(`${API_BASE_URL}/action-items/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Update action item status or details
  async updateActionItem(id: number, data: Partial<ActionItem>): Promise<ActionItem> {
    const res = await fetch(`${API_BASE_URL}/action-items/${id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Delete an action item
  async deleteActionItem(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/action-items/${id}/`, {
      method: 'DELETE',
    });
    return handleResponse(res);
  },

  // Global search query
  async globalSearch(q: string): Promise<MeetingListEntry[]> {
    const res = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(q)}`, { cache: 'no-store' });
    return handleResponse(res);
  }
};
