from django.shortcuts import render

def home(request):
  context = RequestContext(
    request,
    {
      'request': request,
      'user': request.user
    }
  )
  return render('home.html', context_instance=context)
