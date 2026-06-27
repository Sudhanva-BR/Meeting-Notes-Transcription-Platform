"""
DRF Serializers for the meetings API.
Handles nested serialization for meeting detail views.
"""
from rest_framework import serializers
from .models import Meeting, MeetingParticipant, TranscriptSegment, MeetingSummary, ActionItem


# Serializer for meeting participants
class MeetingParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingParticipant
        fields = ['id', 'name', 'email', 'avatar_color']


# Serializer for individual transcript segments
class TranscriptSegmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TranscriptSegment
        fields = ['id', 'speaker_name', 'start_time', 'end_time', 'content', 'segment_order']


# Serializer for AI-generated meeting summary
class MeetingSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingSummary
        fields = ['id', 'overview', 'key_topics', 'outline']


# Serializer for action items with completion toggle
class ActionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionItem
        fields = ['id', 'meeting', 'title', 'assignee', 'is_completed', 'due_date', 'created_at']
        read_only_fields = ['created_at']


# List view serializer (lightweight - no transcript)
class MeetingListSerializer(serializers.ModelSerializer):
    participants = MeetingParticipantSerializer(many=True, read_only=True)
    action_items_count = serializers.SerializerMethodField()
    completed_items_count = serializers.SerializerMethodField()

    class Meta:
        model = Meeting
        fields = ['id', 'title', 'date', 'duration_seconds', 'meeting_type',
                  'participants', 'action_items_count', 'completed_items_count',
                  'created_at', 'updated_at']

    # Count total action items for this meeting
    def get_action_items_count(self, obj):
        return obj.action_items.count()

    # Count completed action items for this meeting
    def get_completed_items_count(self, obj):
        return obj.action_items.filter(is_completed=True).count()


# Detail view serializer (full data including transcript, summary, action items)
class MeetingDetailSerializer(serializers.ModelSerializer):
    participants = MeetingParticipantSerializer(many=True, read_only=True)
    transcript_segments = TranscriptSegmentSerializer(many=True, read_only=True)
    summary = MeetingSummarySerializer(read_only=True)
    action_items = ActionItemSerializer(many=True, read_only=True)

    class Meta:
        model = Meeting
        fields = ['id', 'title', 'date', 'duration_seconds', 'meeting_type',
                  'participants', 'transcript_segments', 'summary', 'action_items',
                  'created_at', 'updated_at']


# Serializer for creating/updating a meeting
class MeetingCreateSerializer(serializers.ModelSerializer):
    participants = serializers.ListField(child=serializers.DictField(), write_only=True, required=False)
    transcript_text = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Meeting
        fields = ['id', 'title', 'date', 'duration_seconds', 'meeting_type',
                  'participants', 'transcript_text', 'created_at', 'updated_at']
        read_only_fields = ['created_at', 'updated_at']

    # Create meeting with participants and parse transcript text into segments
    def create(self, validated_data):
        participants_data = validated_data.pop('participants', [])
        transcript_text = validated_data.pop('transcript_text', '')

        meeting = Meeting.objects.create(**validated_data)

        # Create participants
        avatar_colors = ['#7C3AED', '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#EC4899']
        for i, p in enumerate(participants_data):
            MeetingParticipant.objects.create(
                meeting=meeting,
                name=p.get('name', f'Speaker {i+1}'),
                email=p.get('email', ''),
                avatar_color=avatar_colors[i % len(avatar_colors)]
            )

        # Parse transcript text into segments (format: "Speaker Name [MM:SS]: text")
        if transcript_text:
            self._parse_transcript(meeting, transcript_text)

        # Create empty summary
        MeetingSummary.objects.create(
            meeting=meeting,
            overview='Summary will be generated after processing.',
            key_topics='[]',
            outline=''
        )

        return meeting

    # Parse pasted transcript text into individual segments
    def _parse_transcript(self, meeting, text):
        import re
        lines = text.strip().split('\n')
        segment_order = 0
        # Pattern: "Speaker Name [MM:SS]:" or "Speaker Name [HH:MM:SS]:"
        pattern = re.compile(r'^(.+?)\s*\[(\d{1,2}:?\d{2}:?\d{2})\]\s*:\s*(.+)$')

        for line in lines:
            line = line.strip()
            if not line:
                continue

            match = pattern.match(line)
            if match:
                speaker = match.group(1).strip()
                timestamp_str = match.group(2).strip()
                content = match.group(3).strip()

                # Convert timestamp to seconds
                parts = timestamp_str.split(':')
                if len(parts) == 3:
                    seconds = int(parts[0]) * 3600 + int(parts[1]) * 60 + int(parts[2])
                elif len(parts) == 2:
                    seconds = int(parts[0]) * 60 + int(parts[1])
                else:
                    seconds = int(parts[0])

                TranscriptSegment.objects.create(
                    meeting=meeting,
                    speaker_name=speaker,
                    start_time=float(seconds),
                    end_time=float(seconds + 15),
                    content=content,
                    segment_order=segment_order
                )
                segment_order += 1
            else:
                # Treat as plain text without speaker/timestamp
                if line:
                    TranscriptSegment.objects.create(
                        meeting=meeting,
                        speaker_name='Unknown Speaker',
                        start_time=float(segment_order * 15),
                        end_time=float((segment_order + 1) * 15),
                        content=line,
                        segment_order=segment_order
                    )
                    segment_order += 1
