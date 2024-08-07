import logging
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User as AuthUser
import json
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Account, CustomField, CustomUser, UserType, Location, Assignment
from .serializers import AccountSerializer, CustomFieldSerializer, CustomUserSerializer, UserTypeSerializer, LocationSerializer, AssignmentSerializer

logger = logging.getLogger(__name__)

def add_cors_headers(response):
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE, PATCH"
    response["Access-Control-Allow-Headers"] = "accept, accept-encoding, authorization, content-type, dnt, origin, user-agent, x-csrftoken, x-requested-with"
    return response

@api_view(['GET', 'POST'])
def register_account(request):
    if request.method == 'OPTIONS':
        response = HttpResponse()
        return add_cors_headers(response)
    
    if request.method == 'POST':
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            account = serializer.save()
            user = AuthUser.objects.create_user(
                username=serializer.validated_data['admin_email'],
                email=serializer.validated_data['admin_email'],
                password=serializer.validated_data['admin_password'],
                first_name=serializer.validated_data['admin_first_name'],
                last_name=serializer.validated_data['admin_last_name']
            )
            response = Response(serializer.data, status=status.HTTP_201_CREATED)
            return add_cors_headers(response)
        response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return add_cors_headers(response)

@ensure_csrf_cookie
def get_csrf_token(request):
    if request.method == "OPTIONS":
        response = HttpResponse()
        return add_cors_headers(response)

    csrf_token = get_token(request)
    response = JsonResponse({'csrfToken': csrf_token})
    response = add_cors_headers(response)
    logger.debug(f'CSRF token generated: {csrf_token}')
    return response

@csrf_exempt
def login(request):
    if request.method == 'OPTIONS':
        response = HttpResponse()
        return add_cors_headers(response)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                response = JsonResponse({'error': 'Email and password are required'}, status=400)
                return add_cors_headers(response)

            # Check in Account model
            try:
                account = Account.objects.get(admin_email=email, admin_password=password)
                request.session['user_name'] = f"{account.admin_first_name} {account.admin_last_name}"
                request.session['account_id'] = account.account_id  # Store account_id in session
                request.session.save()  # Explicitly save the session
                logger.debug(f"Session user_name set to: {request.session['user_name']}")
                response = JsonResponse({'token': 'dummy-token', 'user_name': request.session['user_name'], 'account_id': request.session['account_id']})
                return add_cors_headers(response)
            except Account.DoesNotExist:
                pass

            # Check in CustomUser model
            try:
                custom_user = CustomUser.objects.get(primary_email=email, password=password)
                request.session['user_name'] = f"{custom_user.first_name} {custom_user.last_name}"
                request.session['account_id'] = custom_user.account.account_id  # Store account_id in session
                request.session.save()  # Explicitly save the session
                logger.debug(f"Session user_name set to: {request.session['user_name']}")
                response = JsonResponse({'token': 'dummy-token', 'user_name': request.session['user_name'], 'account_id': request.session['account_id']})
                return add_cors_headers(response)
            except CustomUser.DoesNotExist:
                pass

            response = JsonResponse({'error': 'Invalid credentials'}, status=400)
            return add_cors_headers(response)
        except Exception as e:
            logger.exception('Exception during login')
            response = JsonResponse({'error': str(e)}, status=400)
            return add_cors_headers(response)
    response = JsonResponse({'error': 'Invalid method'}, status=405)
    return add_cors_headers(response)

@csrf_exempt
def logout(request):
    if request.method == 'OPTIONS':
        response = HttpResponse()
        return add_cors_headers(response)

    if request.method == 'POST':
        logger.debug('Logout request received')
        auth_logout(request)
        logger.debug('User logged out successfully')
        response = JsonResponse({'message': 'Logged out successfully'}, status=200)
        return add_cors_headers(response)
    logger.debug('Invalid method for logout')
    response = JsonResponse({'error': 'Invalid method'}, status=405)
    return add_cors_headers(response)

@csrf_exempt
def user_profile_fields(request):
    if request.method == 'OPTIONS':
        response = HttpResponse()
        return add_cors_headers(response)

    if request.method == 'GET':
        fields = CustomField.objects.values('field_name', 'field_type', 'required')
        response = JsonResponse(list(fields), safe=False)
        return add_cors_headers(response)
    elif request.method == 'POST':
        data = json.loads(request.body)
        field_name = data.get('field_name')
        field_type = data.get('field_type')
        required = data.get('required', False)

        account_id = data.get('account_id', 1)

        if field_name and field_type:
            try:
                account = Account.objects.get(account_id=account_id)
                CustomField.objects.create(
                    account=account,
                    field_name=field_name,
                    field_type=field_type,
                    required=required
                )
                response = JsonResponse({'status': 'success'})
                return add_cors_headers(response)
            except Account.DoesNotExist:
                response = JsonResponse({'error': 'Account does not exist'}, status=400)
                return add_cors_headers(response)
        response = JsonResponse({'error': 'Field name and type are required'}, status=400)
        return add_cors_headers(response)

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer

    def get_queryset(self):
        account_id = self.request.session.get('account_id')
        return Account.objects.filter(account_id=account_id)

    def retrieve(self, request, *args, **kwargs):
        account_id = self.request.session.get('account_id')
        instance = Account.objects.get(account_id=account_id)
        serializer = self.get_serializer(instance)
        response = Response(serializer.data)
        return add_cors_headers(response)

    def update(self, request, *args, **kwargs):
        account_id = self.request.session.get('account_id')
        instance = Account.objects.get(account_id=account_id)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            response = Response(serializer.data)
            return add_cors_headers(response)
        response = Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return add_cors_headers(response)

class CustomFieldViewSet(viewsets.ModelViewSet):
    queryset = CustomField.objects.all()
    serializer_class = CustomFieldSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        response = Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return add_cors_headers(response)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        logger.debug(f"Request data: {request.data}")

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        response = Response(serializer.data)
        return add_cors_headers(response)

class UserTypeViewSet(viewsets.ModelViewSet):
    queryset = UserType.objects.all()
    serializer_class = UserTypeSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

def get_user_name(request):
    if request.method == 'OPTIONS':
        response = HttpResponse()
        return add_cors_headers(response)

    user_name = request.session.get('user_name', 'User')
    logger.debug(f"Fetched user name from session: {user_name}")
    response = JsonResponse({'user_name': user_name})
    return add_cors_headers(response)
