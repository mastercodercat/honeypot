from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
  nodename = models.CharField(max_length=50)
  useragent = models.CharField(max_length=50)
  url = models.TextField(max_length=300, blank=True, default='')
  datetime = models.DateTimeField()
  millisecond = models.IntegerField()
  session = models.CharField(max_length=50)
  protocol = models.CharField(max_length=10)
  event = models.CharField(max_length=30)
  local_host = models.CharField(max_length=30)
  local_port = models.IntegerField()
  service = models.CharField(max_length=10)
  remote_host = models.CharField(max_length=30)
  remote_port = models.IntegerField()
  data = models.TextField(max_length=300, blank=True, default='')

class Node(models.Model):
  nodename = models.CharField(max_length=50)
  owner = models.ForeignKey(User, models.SET_NULL, blank=True, null=True)
