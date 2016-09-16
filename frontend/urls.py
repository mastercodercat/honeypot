from django.conf.urls import include, url
from . import views
from django.views.generic import TemplateView

urlpatterns = [
  url(r'^test/', TemplateView.as_view(template_name='test.html')),
  url(r'^$', TemplateView.as_view(template_name='index.html')),
]
