from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        if username and password:
            user = User.objects.create_user(username=username, password=password)
            return JsonResponse({'status': 'User created'})
        return JsonResponse({'error': 'Missing username or password'}, status=400)

@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            return JsonResponse({'status': 'Login successful'})
        return JsonResponse({'error': 'Invalid credentials'}, status=400)

