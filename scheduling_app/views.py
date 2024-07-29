import logging
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth.models import User as AuthUser
import json
from rest_framework import status, viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Account, CustomField, CustomUser, UserType
from .serializers import AccountSerializer, CustomFieldSerializer, CustomUserSerializer, UserTypeSerializer

logger = logging.getLogger(__name__)

@api_view(['GET', 'POST'])
def register_account(request):
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

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@ensure_csrf_cookie
def get_csrf_token(request):
    response = JsonResponse({'csrfToken': get_token(request)})
    response["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response["Access-Control-Allow-Credentials"] = "true"
    return response

@csrf_exempt
def login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            if not email or not password:
                return JsonResponse({'error': 'Email and password are required'}, status=400)

            # Check in Account model
            try:
                account = Account.objects.get(admin_email=email, admin_password=password)
                request.session['user_name'] = f"{account.admin_first_name} {account.admin_last_name}"
                request.session['account_id'] = account.account_id  # Store account_id in session
                request.session.save()  # Explicitly save the session
                logger.debug(f"Session user_name set to: {request.session['user_name']}")
                return JsonResponse({'token': 'dummy-token', 'user_name': request.session['user_name'], 'account_id': request.session['account_id']})
            except Account.DoesNotExist:
                pass

            # Check in CustomUser model
            try:
                custom_user = CustomUser.objects.get(primary_email=email, password=password)
                request.session['user_name'] = f"{custom_user.first_name} {custom_user.last_name}"
                request.session['account_id'] = custom_user.account.account_id  # Store account_id in session
                request.session.save()  # Explicitly save the session
                logger.debug(f"Session user_name set to: {request.session['user_name']}")
                return JsonResponse({'token': 'dummy-token', 'user_name': request.session['user_name'], 'account_id': request.session['account_id']})
            except CustomUser.DoesNotExist:
                pass

            return JsonResponse({'error': 'Invalid credentials'}, status=400)
        except Exception as e:
            logger.exception('Exception during login')
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def logout(request):
    if request.method == 'POST':
        logger.debug('Logout request received')
        auth_logout(request)
        logger.debug('User logged out successfully')
        return JsonResponse({'message': 'Logged out successfully'}, status=200)
    logger.debug('Invalid method for logout')
    return JsonResponse({'error': 'Invalid method'}, status=405)

@csrf_exempt
def user_profile_fields(request):
    if request.method == 'GET':
        fields = CustomField.objects.values('field_name', 'field_type', 'required')
        return JsonResponse(list(fields), safe=False)
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
                return JsonResponse({'status': 'success'})
            except Account.DoesNotExist:
                return JsonResponse({'error': 'Account does not exist'}, status=400)
        return JsonResponse({'error': 'Field name and type are required'}, status=400)

class AccountViewSet(viewsets.ModelViewSet):
    serializer_class = AccountSerializer

    def get_queryset(self):
        account_id = self.request.session.get('account_id')
        return Account.objects.filter(account_id=account_id)

    def retrieve(self, request, *args, **kwargs):
        account_id = self.request.session.get('account_id')
        instance = Account.objects.get(account_id=account_id)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        account_id = self.request.session.get('account_id')
        instance = Account.objects.get(account_id=account_id)
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        logger.debug(f"Request data: {request.data}")

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

class UserTypeViewSet(viewsets.ModelViewSet):
    queryset = UserType.objects.all()
    serializer_class = UserTypeSerializer

def get_user_name(request):
    user_name = request.session.get('user_name', 'User')
    logger.debug(f"Fetched user name from session: {user_name}")
    return JsonResponse({'user_name': user_name})
 