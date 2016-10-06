from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User

class Node(models.Model):
  nodename = models.CharField(max_length=50)
  api_key = models.CharField(max_length=150, blank=True)

class NodeOwner(models.Model):
  node = models.ForeignKey(Node, models.SET_NULL, blank=True, null=True)
  user = models.ForeignKey(User, models.SET_NULL, blank=True, null=True)

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
  node = models.ForeignKey(Node, on_delete=models.CASCADE)

class UserConfig(models.Model):
  user = models.ForeignKey(User, models.SET_NULL, blank=True, null=True)
  email = models.CharField(max_length=50, blank=True)
  threshold = models.IntegerField()
