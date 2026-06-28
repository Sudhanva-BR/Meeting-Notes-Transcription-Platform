// Participant info for a meeting
export interface Participant {
  id: number;
  name: string;
  email: string;
  avatar_color: string;
}

// Single transcript segment (one turn of a speaker)
export interface TranscriptSegment {
  id: number;
  speaker_name: string;
  start_time: number; // in seconds
  end_time: number; // in seconds
  content: string;
  segment_order: number;
}

// AI-generated summary of a meeting
export interface MeetingSummary {
  id: number;
  overview: string;
  key_topics: string; // JSON string representing array of topics
  outline: string; // Markdown content for outline
}

// Action item/task extracted from a meeting
export interface ActionItem {
  id: number;
  meeting: number;
  title: string;
  assignee: string;
  is_completed: boolean;
  due_date: string | null;
  created_at: string;
}

// Lightweight meeting structure used in dashboard lists
export interface MeetingListEntry {
  id: number;
  title: string;
  date: string;
  duration_seconds: number;
  meeting_type: string;
  participants: Participant[];
  action_items_count: number;
  completed_items_count: number;
  created_at: string;
  updated_at: string;
}

// Full detailed meeting structure
export interface MeetingDetail extends Omit<MeetingListEntry, 'action_items_count' | 'completed_items_count'> {
  transcript_segments: TranscriptSegment[];
  summary: MeetingSummary;
  action_items: ActionItem[];
}
