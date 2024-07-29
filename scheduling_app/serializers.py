from rest_framework import serializers
from .models import Account, CustomField, CustomUser, UserType

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'account_id',
            'account_name',
            'admin_first_name',
            'admin_last_name',
            'admin_email',
            'admin_password',
            'phone_number',
            'address',
            'address2',
            'city',
            'state',
            'zip_code',
            'created_at',
            'updated_at',
        ]

class CustomFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomField
        fields = [
            'account',
            'field_name',
            'field_type',
            'required',
        ]

class UserTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserType
        fields = [
            'user_type_id',
            'name',
            'created_at',
            'updated_at',
        ]

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'user_id',
            'account',
            'is_active',
            'user_type',
            'first_name',
            'last_name',
            'primary_email',
            'secondary_email',
            'password',
            'permissions',
            'professional_suffix',
            'npi',
            'mobile_phone',
            'pager',
            'schedule_name',
            'custom_fields',
        ]
