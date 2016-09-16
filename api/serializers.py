from api.models import Event
from rest_framework import serializers

class EventSerializer(serializers.ModelSerializer):
  class Meta:
    model = Event
    fields = ('nodename', 'useragent', 'url', 'datetime', 'millisecond', 'session', 'protocol', 'event', 'local_host', 'local_port', 'service', 'remote_host', 'remote_port', 'data')
