from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from api.serializers import EventSerializer
from api.models import Event

class EventLogger(APIView):
  # authentication_classes = (SessionAuthentication,)
  # permission_classes = (IsAuthenticated,)

  def post(self, request, format=None):
    data = {
      'nodename': request.data.get('nodename'),
      'useragent': request.data.get('useragent'),
      'url': request.data.get('url'),
      'datetime': request.data.get('datetime'),
      'millisecond': request.data.get('millisecond'),
      'session': request.data.get('session'),
      'protocol': request.data.get('protocol'),
      'event': request.data.get('event'),
      'local_host': request.data.get('local_host'),
      'local_port': request.data.get('local_port'),
      'service': request.data.get('service'),
      'remote_host': request.data.get('remote_host'),
      'remote_port': request.data.get('remote_port'),
      'data': request.data.get('data')
    }
    serializer = EventSerializer(data=data)
    if serializer.is_valid():
      serializer.save()
      return Response({
        'result': 1
      })
    return Response(serializer.errors)

class EventsList(APIView):

  def get(self, request, format=None):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)
