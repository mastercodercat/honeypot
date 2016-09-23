from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from django.core.mail import send_mail
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from api.serializers import EventSerializer, NodeSerializer, UserSerializer, UserConfigSerializer
from api.models import Event, Node, UserConfig
from honeypot_visualizer.settings import SECRET_KEY, EMAIL_HOST
import jwt, random
from datetime import datetime, timedelta, time


def get_client_ip(request):
  x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
  if x_forwarded_for:
      ip = x_forwarded_for.split(',')[0]
  else:
      ip = request.META.get('REMOTE_ADDR')
  return ip


class EventLogger(APIView):

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
    response = {
      'result': False,
      'reason': ''
    }
    # ip check
    if get_client_ip(request) != request.data.get('local_host'):
      response['reason'] = 'IP check failed'
      return Response(response)
    # api key check
    node = Node.objects.filter(nodename=data['nodename']).first()
    if node is None:
      response['result'] = True
      response['node_registered'] = True
      newnode = Node(nodename=data['nodename'], api_key='')
      newnode.save()
      return Response(response)
    if (node.api_key != request.data.get('api_key')) and (node.api_key != ''):
      response['reason'] = 'Invalid api key'
      return Response(response)
    decoded = jwt.decode(node.api_key, SECRET_KEY, algorithm='HS256')
    if decoded['nodename'] != data['nodename']:
      response['reason'] = 'Invalid nodename'
      return Response(response)
    # save event
    data['node'] = node.id
    serializer = EventSerializer(data=data)
    if serializer.is_valid():
      serializer.save()
      if node.owner is not None:
        config = UserConfig.objects.filter(user=node.owner).first()
        if (config is not None) and (EMAIL_HOST != '') and (config.email != ''):
          send_mail(
            'Honeypot Event',
            'The event ' + data['event'] + ' occurred on honeypot ' + data['nodename'],
            'notify@honeydb.com',
            [config.email],
            fail_silently=True,
          )

      return Response({
        'result': True
      })

    return Response(serializer.errors)


@api_view(['POST'])
def login(request):
  result = {
    'status': False,
    'type': 0,
  }
  username = request.data.get('username')
  password = request.data.get('password')
  user = authenticate(username=username, password=password)
  if user is not None:
    auth_login(request, user)
    result['status'] = True
    result['username'] = user.username
    result['email'] = user.email
    if user.is_staff:
      result['type'] = 1
  return Response(result)


class EventsList(APIView):
  authentication_classes = (SessionAuthentication,)
  permission_classes = (IsAuthenticated,)

  def get(self, request, format=None):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


class NodesList(APIView):
  authentication_classes = (SessionAuthentication,)
  permission_classes = (IsAuthenticated, IsAdminUser)

  # get list
  def get(self, request, format=None):
    nodes = Node.objects.all()
    response = []
    for node in nodes:
      today = datetime.now().date()
      tomorrow = today + timedelta(1)
      today_start = datetime.combine(today, time())
      today_end = datetime.combine(tomorrow, time())
      nobj = {
        'id': node.id,
        'nodename': node.nodename,
        'owner': node.owner.id if node.owner is not None else 0,
        'events_count': node.event_set.count(),
        'events_count_today': node.event_set.filter(datetime__lte=today_end, datetime__gte=today_start).count()
      }
      # api key
      if request.user.is_staff:
        nobj['api_key'] = node.api_key
      response.append(nobj)
    return Response(response)

  # create node
  def post(self, request, format=None):
    response = {
      'result': False,
      'reason': ''
    }
    nodename = request.data.get('nodename')
    owner_id = request.data.get('owner')
    owner = User.objects.get(pk=owner_id)
    api_key = jwt.encode({ 'nodename': nodename, 'rand': int(random.random() * 10000) }, SECRET_KEY, algorithm='HS256')
    node = Node(nodename=nodename, owner=owner, api_key=api_key)
    node.save()
    serializer = NodeSerializer(node)
    return Response(serializer.data)

  # assign to user
  def put(self, request, format=None):
    response = {
      'result': False
    }
    id = request.data.get('id')
    owner_id = request.data.get('owner')
    node = Node.objects.get(pk=id)
    user = User.objects.get(pk=owner_id)
    if (node is not None) and (user is not None):
      node.owner = user
      node.save()
      response['result'] = True
    return Response(response)

  # remove node
  def delete(self, request, format=None):
    response = {
      'result': False
    }
    id = request.data.get('id')
    node = Node.objects.get(pk=id)
    if node is None:
      response['reason'] = 'Agent node not found'
      return Response(response)
    node.delete()
    response['result'] = True
    return Response(response)


@api_view(['DELETE'])
@permission_classes((IsAuthenticated, IsAdminUser))
@authentication_classes((SessionAuthentication,))
def node_clear_events(request, id=None):
  response = {
    'result': False,
    'reason': ''
  }
  node = Node.objects.get(pk=id)
  if node is None:
    response['reason'] = 'Agent node not found'
    return Response(response)
  node.event_set.all().delete()
  response['result'] = True
  return Response(response)


@api_view(['POST'])
@permission_classes((IsAuthenticated, IsAdminUser))
@authentication_classes((SessionAuthentication,))
def node_regenerate_api_key(request, id=None):
  response = {
    'result': False,
    'reason': ''
  }
  node = Node.objects.get(pk=id)
  if node is None:
    response['reason'] = 'Agent node not found'
    return Response(response)
  node.api_key = jwt.encode({ 'nodename': node.nodename, 'rand': int(random.random() * 10000) }, SECRET_KEY, algorithm='HS256')
  node.save()
  response['result'] = True
  response['api_key'] = node.api_key
  return Response(response)


class UsersList(APIView):
  authentication_classes = (SessionAuthentication,)
  permission_classes = (IsAuthenticated, IsAdminUser)

  def get(self, request, format=None):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


class UserConfigAPI(APIView):
  authentication_classes = (SessionAuthentication,)
  permission_classes = (IsAuthenticated,)

  def get(self, request, format=None):
    configs = UserConfig.objects.filter(user=request.user)
    if configs.count() > 0:
      config = configs[0]
      serializer = UserConfigSerializer(config)
      return Response(serializer.data)
    return Response({
      'result': False
    })

  def post(self, request, format=None):
    configs = UserConfig.objects.filter(user=request.user)
    if configs.count() > 0:
      config = configs[0]
      config.email = request.data.get('email')
      config.threshold = request.data.get('threshold')
    else:
      config = UserConfig(user=request.user, email=request.data.get('email'), threshold=request.data.get('threshold'))
    response = {
      'result': False
    }
    config.save()
    response['result'] = True
    return Response(response)

