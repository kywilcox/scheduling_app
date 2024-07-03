# scheduling_app/serializers.py

from rest_framework import serializers
from .models import Account

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'account_id', 'account_name', 'admin_first_name', 'admin_last_name',
            'admin_email', 'admin_password', 'phone_number', 'address', 'address2',
            'city', 'state', 'zip_code'
        ]
