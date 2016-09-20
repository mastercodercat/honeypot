from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from api.serializers import EventSerializer, NodeSerializer, UserSerializer, UserConfigSerializer
from api.models import Event, Node, UserConfig

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
    serializer = EventSerializer(data=data)
    if serializer.is_valid():
      serializer.save()
      node = Node.objects.filter(nodename=data['nodename'])
      if node is None:
        new_node = Node(nodename=data['nodename'], owner=request.user)
        new_node.save()
      return Response({
        'result': 1
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

  def get(self, request, format=None):
    nodes = Node.objects.all()
    serializer = NodeSerializer(nodes, many=True)
    return Response(serializer.data)

  def post(self, request, format=None):
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
    if config.save():
      response['result'] = True
    return Response(response)
