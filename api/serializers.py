from api.models import Event, Node, UserConfig
from rest_framework import serializers
from django.contrib.auth.models import User

class EventSerializer(serializers.ModelSerializer):
  class Meta:
    model = Event
    fields = ('nodename', 'useragent', 'url', 'datetime', 'millisecond', 'session', 'protocol', 'event', 'local_host', 'local_port', 'service', 'remote_host', 'remote_port', 'data', 'node')

class NodeSerializer(serializers.ModelSerializer):
  class Meta:
    model = Node
    fields = ('id', 'nodename', 'api_key')

class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff')

class UserConfigSerializer(serializers.ModelSerializer):
  class Meta:
    model = UserConfig
    fields = ('user', 'threshold', 'email')
