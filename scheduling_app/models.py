# scheduling_app/models.py

from django.db import models

class Account(models.Model):
    account_id = models.AutoField(primary_key=True)
    account_name = models.CharField(max_length=255)
    admin_first_name = models.CharField(max_length=255)
    admin_last_name = models.CharField(max_length=255)
    admin_email = models.EmailField(unique=True)
    admin_password = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    address2 = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.account_name
