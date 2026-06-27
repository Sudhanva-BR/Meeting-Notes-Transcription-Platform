"""
URL routing for the meetings API.
Maps ViewSets to REST endpoints using DRF router.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Register viewsets with the router for automatic URL generation
router = DefaultRouter()
router.register(r'meetings', views.MeetingViewSet, basename='meeting')
router.register(r'action-items', views.ActionItemViewSet, basename='action-item')

urlpatterns = [
    path('', include(router.urls)),
    path('search/', views.global_search, name='global-search'),
]
