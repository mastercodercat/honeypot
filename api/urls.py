from django.conf.urls import include, url
from . import views
from django.views.generic import TemplateView

urlpatterns = [
  url(r'^logger', views.EventLogger.as_view()),
  url(r'^events', views.EventsList.as_view())
]
