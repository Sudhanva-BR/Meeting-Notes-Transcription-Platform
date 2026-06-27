"""
Database models for the Meeting Notes & Transcription Platform.
Defines Meeting, Participant, TranscriptSegment, Summary, and ActionItem.
"""
from django.db import models


# Represents a single meeting with its metadata
class Meeting(models.Model):
    title = models.CharField(max_length=255)
    date = models.DateTimeField()
    duration_seconds = models.IntegerField(default=0)
    meeting_type = models.CharField(max_length=50, default='meeting')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title


# A participant in a meeting (name, email, avatar color)
class MeetingParticipant(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='participants')
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, default='')
    avatar_color = models.CharField(max_length=7, default='#7C3AED')

    def __str__(self):
        return f"{self.name} - {self.meeting.title}"


# A single segment of a transcript (one speaker's turn)
class TranscriptSegment(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='transcript_segments')
    speaker_name = models.CharField(max_length=255)
    start_time = models.FloatField()
    end_time = models.FloatField()
    content = models.TextField()
    segment_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['segment_order']

    def __str__(self):
        return f"[{self.start_time}] {self.speaker_name}: {self.content[:50]}"


# AI-generated summary for a meeting (one-to-one with Meeting)
class MeetingSummary(models.Model):
    meeting = models.OneToOneField(Meeting, on_delete=models.CASCADE, related_name='summary')
    overview = models.TextField(blank=True, default='')
    key_topics = models.TextField(blank=True, default='')  # Stored as JSON string
    outline = models.TextField(blank=True, default='')

    def __str__(self):
        return f"Summary for {self.meeting.title}"


# An action item extracted from a meeting
class ActionItem(models.Model):
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='action_items')
    title = models.TextField()
    assignee = models.CharField(max_length=255, blank=True, default='')
    is_completed = models.BooleanField(default=False)
    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f"{'✓' if self.is_completed else '○'} {self.title}"
