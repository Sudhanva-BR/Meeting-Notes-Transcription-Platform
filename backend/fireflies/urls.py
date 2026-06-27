"""
Root URL configuration - routes all API calls to the meetings app.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('meetings.urls')),
]
