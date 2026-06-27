"""
API views for meetings, action items, and transcript operations.
Uses DRF ViewSets and generic views.
"""
from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Q
from .models import Meeting, MeetingParticipant, TranscriptSegment, MeetingSummary, ActionItem
from .serializers import (
    MeetingListSerializer, MeetingDetailSerializer, MeetingCreateSerializer,
    ActionItemSerializer, TranscriptSegmentSerializer, MeetingParticipantSerializer
)


# ViewSet for Meeting CRUD operations with search and filtering
class MeetingViewSet(viewsets.ModelViewSet):

    def get_queryset(self):
        queryset = Meeting.objects.all()
        search = self.request.query_params.get('search', '')
        sort = self.request.query_params.get('sort', '-date')
        date_from = self.request.query_params.get('date_from', '')
        date_to = self.request.query_params.get('date_to', '')

        # Search by title, participant name, or transcript content
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(participants__name__icontains=search) |
                Q(transcript_segments__content__icontains=search)
            ).distinct()

        # Filter by date range
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        # Sort by the specified field
        valid_sorts = ['date', '-date', 'title', '-title', 'duration_seconds', '-duration_seconds']
        if sort in valid_sorts:
            queryset = queryset.order_by(sort)

        return queryset

    # Use lightweight serializer for list, detailed for retrieve
    def get_serializer_class(self):
        if self.action == 'list':
            return MeetingListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return MeetingCreateSerializer
        return MeetingDetailSerializer

    # Update meeting metadata and optionally update participants
    def update(self, request, *args, **kwargs):
        meeting = self.get_object()
        meeting.title = request.data.get('title', meeting.title)
        meeting.meeting_type = request.data.get('meeting_type', meeting.meeting_type)
        meeting.save()

        # Update participants if provided
        participants_data = request.data.get('participants', None)
        if participants_data is not None:
            meeting.participants.all().delete()
            avatar_colors = ['#7C3AED', '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#EC4899']
            for i, p in enumerate(participants_data):
                MeetingParticipant.objects.create(
                    meeting=meeting,
                    name=p.get('name', f'Speaker {i+1}'),
                    email=p.get('email', ''),
                    avatar_color=avatar_colors[i % len(avatar_colors)]
                )

        serializer = MeetingDetailSerializer(meeting)
        return Response(serializer.data)

    # Get just the transcript segments for a meeting
    @action(detail=True, methods=['get'])
    def transcript(self, request, pk=None):
        meeting = self.get_object()
        segments = meeting.transcript_segments.all()
        serializer = TranscriptSegmentSerializer(segments, many=True)
        return Response(serializer.data)


# ViewSet for Action Item CRUD operations
class ActionItemViewSet(viewsets.ModelViewSet):
    serializer_class = ActionItemSerializer
    queryset = ActionItem.objects.all()

    def get_queryset(self):
        queryset = ActionItem.objects.all()
        meeting_id = self.request.query_params.get('meeting', None)
        if meeting_id:
            queryset = queryset.filter(meeting_id=meeting_id)
        return queryset


# Global search across all meeting transcripts
@api_view(['GET'])
def global_search(request):
    query = request.query_params.get('q', '')
    if not query:
        return Response([])

    # Search in meeting titles, transcript content, and summaries
    meetings = Meeting.objects.filter(
        Q(title__icontains=query) |
        Q(transcript_segments__content__icontains=query) |
        Q(summary__overview__icontains=query)
    ).distinct()

    serializer = MeetingListSerializer(meetings, many=True)
    return Response(serializer.data)
