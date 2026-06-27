"""
Register models with Django admin for easy management.
"""
from django.contrib import admin
from .models import Meeting, MeetingParticipant, TranscriptSegment, MeetingSummary, ActionItem

admin.site.register(Meeting)
admin.site.register(MeetingParticipant)
admin.site.register(TranscriptSegment)
admin.site.register(MeetingSummary)
admin.site.register(ActionItem)
